"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink, Search } from "lucide-react";
import PostStatusBadge from "@/components/admin/posts/PostStatusBadge";
import { deletePost } from "@/lib/posts/mutations";
import type { BlogPost } from "@/lib/posts/types";

export default function PostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));

  const handleDelete = (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setPendingId(post.id);
    startTransition(async () => {
      await deletePost(post.id, post.slug);
      setPendingId(null);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 rounded-[14px] border border-brand-border/70 bg-white px-4 py-2.5">
        <Search className="size-4 text-brand-light" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-[16px] border border-brand-border/60 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border/60 bg-brand-gray/50 text-xs font-semibold uppercase tracking-wide text-brand-light">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-brand-border/40 last:border-0 hover:bg-brand-gray/30">
                  <td className="max-w-[280px] truncate px-5 py-3.5 font-medium text-brand-heading">{post.title}</td>
                  <td className="px-5 py-3.5">
                    <PostStatusBadge status={post.status} />
                  </td>
                  <td className="px-5 py-3.5 text-brand-body">{post.category}</td>
                  <td className="px-5 py-3.5 text-brand-body">{post.author.name}</td>
                  <td className="px-5 py-3.5 text-brand-light">{post.date || "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === "published" && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="flex size-8 items-center justify-center rounded-lg text-brand-light hover:bg-brand-gray hover:text-brand-heading"
                          aria-label="View live"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="flex size-8 items-center justify-center rounded-lg text-brand-light hover:bg-brand-gray hover:text-brand-heading"
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        disabled={isPending && pendingId === post.id}
                        className="flex size-8 items-center justify-center rounded-lg text-brand-light hover:bg-brand-error/10 hover:text-brand-error disabled:opacity-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-brand-light">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
