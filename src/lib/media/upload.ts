"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

export type MediaItem = {
  id: string;
  url: string;
  storagePath: string;
  altText: string | null;
  createdAt: string;
};

export type UploadResult = { ok: true; item: MediaItem } | { ok: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const profile = await requireRole(["admin", "editor"]);

  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };
  if (!file.type.startsWith("image/")) return { ok: false, error: "Only image files are allowed." };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Image must be under 5MB." };

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({
      storage_path: path,
      url: publicUrl.publicUrl,
      alt_text: altText || null,
      size_bytes: file.size,
      uploaded_by: profile.id,
    })
    .select("id, url, storage_path, alt_text, created_at")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Upload succeeded but saving to the library failed." };

  revalidatePath("/admin/media");
  return {
    ok: true,
    item: { id: data.id, url: data.url, storagePath: data.storage_path, altText: data.alt_text, createdAt: data.created_at },
  };
}

/** Server Action wrapper so client components (the Media Picker) can fetch
 * the library on demand. See lib/media/queries.ts for the Server-Component
 * equivalent used by the /admin/media page itself. */
export async function listMedia(): Promise<MediaItem[]> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("id, url, storage_path, alt_text, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    url: row.url,
    storagePath: row.storage_path,
    altText: row.alt_text,
    createdAt: row.created_at,
  }));
}
