import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/posts/types";

type CategoryWithCountRow = { id: string; name: string; slug: string; posts: { count: number }[] | null };

export async function getCategoriesForAdmin(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, posts(count)")
    .order("name");

  if (error || !data) return [];
  return (data as unknown as CategoryWithCountRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    postCount: row.posts?.[0]?.count ?? 0,
  }));
}
