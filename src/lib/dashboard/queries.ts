import "server-only";
import { getAllPostsForAdmin } from "@/lib/posts/queries";
import { getMediaLibrary } from "@/lib/media/queries";
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
  const [profile, posts, media] = await Promise.all([getCurrentProfile(), getAllPostsForAdmin(), getMediaLibrary()]);

  const categoryMap = new Map<string, number>();
  posts.forEach((p) => categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1));

  return {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    mediaCount: media.length,
    categoryBreakdown: Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    recentPosts: posts.slice(0, 5),
    isAdmin: profile?.role === "admin",
  };
}
