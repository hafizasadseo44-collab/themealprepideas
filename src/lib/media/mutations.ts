"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

export type MediaActionResult = { ok: true } | { ok: false; error: string };

export async function updateMediaAlt(id: string, altText: string): Promise<MediaActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();
  const { error } = await supabase.from("media").update({ alt_text: altText || null }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function deleteMedia(id: string, storagePath: string): Promise<MediaActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  await supabase.storage.from("media").remove([storagePath]);

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/media");
  return { ok: true };
}
