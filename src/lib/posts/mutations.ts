"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { notifyNewPost } from "@/lib/email/notify";
import type { PostStatus } from "@/lib/posts/types";
import type { TiptapNode } from "@/lib/tiptap/inline-text";

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  categoryId: string | null;
  status: PostStatus;
  scheduledFor: string | null;
  tags: string[];
  trending: boolean;
  featured: boolean;
  content: TiptapNode;
  minutes: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoOgImageUrl: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  seoNoindex: boolean;
  seoNofollow: boolean;
  authorId?: string | null;
  coAuthorIds?: string[];
};

export type ActionResult = { ok: true; id: string } | { ok: false; error: string };

function toRow(input: PostInput, authorId?: string, authorIdOverride?: string | null) {
  const resolvedAuthorId = authorIdOverride !== undefined ? authorIdOverride : authorId;
  const publishedAt =
    input.status === "published"
      ? new Date().toISOString()
      : input.status === "scheduled"
        ? input.scheduledFor
        : null;

  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    cover_image_url: input.coverImageUrl,
    cover_image_alt: input.coverImageAlt,
    category_id: input.categoryId,
    status: input.status,
    published_at: publishedAt,
    scheduled_for: input.status === "scheduled" ? input.scheduledFor : null,
    tags: input.tags,
    trending: input.trending,
    featured: input.featured,
    content: input.content,
    minutes: input.minutes,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
    seo_og_image_url: input.seoOgImageUrl,
    canonical_url: input.canonicalUrl,
    focus_keyword: input.focusKeyword,
    seo_noindex: input.seoNoindex,
    seo_nofollow: input.seoNofollow,
    ...(resolvedAuthorId ? { author_id: resolvedAuthorId } : {}),
  };
}

export async function createPost(input: PostInput, isAutosave?: boolean): Promise<ActionResult> {
  const profile = await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  if (input.featured) {
    await supabase.from("posts").update({ featured: false }).eq("featured", true);
  }

  const effectiveAuthorId = input.authorId !== undefined ? input.authorId : profile.id;
  const { data, error } = await supabase
    .from("posts")
    .insert(toRow(input, undefined, effectiveAuthorId))
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Could not create post." };

  // Save co-authors
  if (!isAutosave && input.coAuthorIds && input.coAuthorIds.length > 0) {
    await supabase.from("post_co_authors").delete().eq("post_id", data.id);
    await supabase.from("post_co_authors").insert(
      input.coAuthorIds.map((profile_id) => ({ post_id: data.id, profile_id }))
    );
  }

  if (!isAutosave) {
    revalidatePath("/admin/posts");
    if (input.status === "published") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${input.slug}`);
      revalidatePath("/sitemap.xml");
    }
  }

  if (input.status === "published") {
    notifyOfPublishedPost(input).catch((err) => console.error("[email] notifyNewPost failed:", err));
  }

  return { ok: true, id: data.id };
}

export async function updatePost(id: string, input: PostInput, isAutosave?: boolean): Promise<ActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  if (input.featured) {
    await supabase.from("posts").update({ featured: false }).eq("featured", true).neq("id", id);
  }

  const { data: existing } = await supabase.from("posts").select("status").eq("id", id).maybeSingle();
  const wasPublished = existing?.status === "published";

  const authorRow = input.authorId !== undefined ? toRow(input, undefined, input.authorId) : toRow(input);
  const { error } = await supabase.from("posts").update(authorRow).eq("id", id);
  if (error) return { ok: false, error: error.message };

  // Sync co-authors (always replace when not autosave)
  if (!isAutosave && input.coAuthorIds !== undefined) {
    await supabase.from("post_co_authors").delete().eq("post_id", id);
    if (input.coAuthorIds.length > 0) {
      await supabase.from("post_co_authors").insert(
        input.coAuthorIds.map((profile_id) => ({ post_id: id, profile_id }))
      );
    }
  }

  if (!isAutosave) {
    revalidatePath("/admin/posts");
    if (wasPublished || input.status === "published") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${input.slug}`);
      revalidatePath("/sitemap.xml");
    }
  }

  if (!wasPublished && input.status === "published") {
    notifyOfPublishedPost(input).catch((err) => console.error("[email] notifyNewPost failed:", err));
  }

  return { ok: true, id };
}

async function notifyOfPublishedPost(input: PostInput) {
  let categoryName: string | null = null;
  if (input.categoryId) {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("name").eq("id", input.categoryId).maybeSingle();
    categoryName = data?.name ?? null;
  }

  await notifyNewPost({
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    imageUrl: input.coverImageUrl,
    categoryName,
  });
}

export async function deletePost(id: string, slug: string): Promise<ActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
  revalidatePath("/sitemap.xml");
  return { ok: true, id };
}
