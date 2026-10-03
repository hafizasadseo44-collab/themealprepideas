import { tiptapJsonToBlocks } from "@/lib/tiptap/json-to-blocks";
import { formatReadTime, type BlogPost, type PostStatus } from "@/lib/posts/types";
import type { TiptapNode } from "@/lib/tiptap/inline-text";

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  status: PostStatus;
  published_at: string | null;
  scheduled_for: string | null;
  minutes: number | null;
  tags: string[];
  trending: boolean;
  featured: boolean;
  content: TiptapNode | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image_url: string | null;
  canonical_url: string | null;
  focus_keyword: string | null;
  seo_noindex: boolean;
  seo_nofollow: boolean;
  created_at: string;
  updated_at: string;
  category_id: string | null;
  categories: { id: string; name: string; slug: string } | null;
  author_id: string | null;
  profiles: { id: string; full_name: string | null; avatar_url: string | null; email: string; bio: string | null } | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function postRowToBlogPost(row: PostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    image: row.cover_image_url ?? "",
    imageAlt: row.cover_image_alt || row.title,
    category: row.categories?.name ?? "Uncategorized",
    categoryId: row.category_id,
    readTime: formatReadTime(row.minutes),
    minutes: row.minutes ?? 3,
    date: formatDate(row.published_at ?? row.created_at),
    author: {
      name: row.profiles?.full_name || row.profiles?.email?.split("@")[0] || "Unknown",
      avatar: row.profiles?.avatar_url || "",
      bio: row.profiles?.bio || undefined,
    },
    tags: row.tags ?? [],
    trending: row.trending,
    featured: row.featured,
    content: tiptapJsonToBlocks(row.content),
    contentJson: row.content ?? { type: "doc", content: [] },
    status: row.status,
    seo: {
      title: row.seo_title,
      description: row.seo_description,
      ogImage: row.seo_og_image_url,
      canonical: row.canonical_url,
      focusKeyword: row.focus_keyword,
      noindex: row.seo_noindex,
      nofollow: row.seo_nofollow,
    },
  };
}
