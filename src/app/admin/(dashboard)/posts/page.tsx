import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPostsForAdmin } from "@/lib/posts/queries";
import PostsTable from "@/components/admin/posts/PostsTable";

export const metadata: Metadata = {
  title: "Posts | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPostsPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-brand-heading">Posts</h1>
          <p className="mt-1 text-sm text-brand-light">{posts.length} total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-[12px] bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
        >
          <Plus className="size-4" />
          New Post
        </Link>
      </div>

      <div className="mt-6">
        <PostsTable posts={posts} />
      </div>
    </div>
  );
}
