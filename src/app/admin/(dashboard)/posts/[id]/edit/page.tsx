import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostById, getCategories } from "@/lib/posts/queries";
import PostEditor from "@/components/admin/posts/editor/PostEditor";

export const metadata: Metadata = {
  title: "Edit Post | Admin",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(id), getCategories()]);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-brand-light hover:text-brand-heading">
        <ArrowLeft className="size-4" />
        Back to Posts
      </Link>
      <PostEditor post={post} categories={categories} />
    </div>
  );
}
