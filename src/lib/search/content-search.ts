"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

export type ContentSuggestion = {
  id: string;
  title: string;
  slug: string;
  type: "recipe" | "blog";
  url: string;
};

export async function searchContent(query: string): Promise<ContentSuggestion[]> {
  await requireRole(["admin", "editor"]);
  if (!query.trim() || query.trim().length < 2) return [];

  const supabase = await createClient();
  const q = `%${query.trim()}%`;

  const [recipes, posts] = await Promise.all([
    supabase.from("recipes").select("id, title, slug").ilike("title", q).eq("status", "published").limit(5),
    supabase.from("posts").select("id, title, slug").ilike("title", q).eq("status", "published").limit(5),
  ]);

  const results: ContentSuggestion[] = [];

  for (const r of recipes.data ?? []) {
    results.push({ id: r.id, title: r.title, slug: r.slug, type: "recipe", url: `/recipes/${r.slug}` });
  }
  for (const p of posts.data ?? []) {
    results.push({ id: p.id, title: p.title, slug: p.slug, type: "blog", url: `/blog/${p.slug}` });
  }

  return results.slice(0, 8);
}
