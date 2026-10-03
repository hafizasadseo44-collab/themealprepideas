import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import type { MediaItem } from "@/lib/media/upload";

export async function getMediaLibrary(): Promise<MediaItem[]> {
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
