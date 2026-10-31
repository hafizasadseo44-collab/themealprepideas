import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import type { BlogPost } from "@/lib/posts/types";

export type DashboardStats = {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
  mediaCount: number;
  categoryBreakdown: { name: string; count: number }[];
  recentPosts: BlogPost[];
  isAdmin: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    profile,
    { count: total },
    { count: published },
    { count: draft },
    { count: scheduled },
    { count: mediaCount },
    { data: categoryRows },
    { data: recentRows },
  ] = await Promise.all([
    getCurrentProfile(),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
    supabase.from("media").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("category").order("category"),
    supabase
      .from("posts")
      .select("id, title, slug, status, published_at, category, hero_image_url, author_id, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const categoryMap = new Map<string, number>();
  (categoryRows ?? []).forEach((r: { category: string }) =>
    categoryMap.set(r.category, (categoryMap.get(r.category) ?? 0) + 1)
  );

  return {
    total: total ?? 0,
    published: published ?? 0,
    draft: draft ?? 0,
    scheduled: scheduled ?? 0,
    mediaCount: mediaCount ?? 0,
    categoryBreakdown: Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    recentPosts: (recentRows ?? []) as BlogPost[],
    isAdmin: profile?.role === "admin",
  };
}
