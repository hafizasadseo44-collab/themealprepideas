"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import PostStatusBadge from "@/components/admin/posts/PostStatusBadge";
import type { BlogPost } from "@/lib/posts/types";

export default function RecentPostsList({ posts }: { posts: BlogPost[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-[18px] border border-brand-border/60 bg-white"
    >
      <div className="flex items-center justify-between border-b border-brand-border/60 px-5 py-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-heading">
          <FileText className="size-4 text-brand-primary-dark" />
          Recent Posts
        </p>
        <Link href="/admin/posts" className="flex items-center gap-1 text-xs font-medium text-brand-primary-dark hover:underline">
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-brand-light">No posts yet — create your first one.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/posts/${post.id}/edit`}
              className="flex items-center gap-3 border-b border-brand-border/40 px-5 py-3.5 transition-colors last:border-0 hover:bg-brand-gray/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-heading">{post.title}</p>
                <p className="mt-0.5 text-xs text-brand-light">{post.category} · {post.date || "Not yet published"}</p>
              </div>
              <PostStatusBadge status={post.status} />
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
