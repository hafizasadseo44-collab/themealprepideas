import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getCurrentProfile } from "@/lib/auth/session";
import { postRowToBlogPost, type PostRow } from "@/lib/posts/mappers";
import type { BlogPost, Category } from "@/lib/posts/types";

const POST_SELECT = `
  id, slug, title, excerpt, cover_image_url, cover_image_alt, status, published_at, scheduled_for,
  minutes, tags, trending, featured, content,
  seo_title, seo_description, seo_og_image_url, canonical_url, focus_keyword, seo_noindex, seo_nofollow,
  created_at, updated_at, category_id,
  categories ( id, name, slug ),
  author_id,
  profiles ( id, full_name, avatar_url, email, bio )
`;

/** Public site: posts visible to everyone. Uses the cookie-less client since
 * this also runs from generateStaticParams, where Next.js forbids cookies(). */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.error("[getPublishedPosts]", error?.message);
    return [];
  }
  return (data as unknown as PostRow[]).map(postRowToBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  return postRowToBlogPost(data as unknown as PostRow);
}

export async function getRelatedPosts(slug: string, count = 3): Promise<BlogPost[]> {
  const all = await getPublishedPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.filter((p) => p.slug !== slug).slice(0, count);
  const sameCategory = all.filter((p) => p.slug !== slug && p.category === current.category);
  const others = all.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

/** Admin: every post regardless of status — admins see everyone's, editors
 * only see their own (mirrors the posts_staff_read RLS policy). */
export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  let query = supabase.from("posts").select(POST_SELECT).order("created_at", { ascending: false });

  if (profile && profile.role !== "admin") {
    query = query.eq("author_id", profile.id);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("[getAllPostsForAdmin]", error?.message);
    return [];
  }
  return (data as unknown as PostRow[]).map(postRowToBlogPost);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select(POST_SELECT).eq("id", id).maybeSingle();
  if (error || !data) return null;
  return postRowToBlogPost(data as unknown as PostRow);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("categories").select("id, name, slug").order("name");
  if (error || !data) return [];
  return data;
}

/** Minimal slug + timestamp list for sitemap.ts — avoids fetching full post bodies. */
export async function getSitemapPosts(): Promise<{ slug: string; updatedAt: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published");
  if (error || !data) return [];
  return data.map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
}
