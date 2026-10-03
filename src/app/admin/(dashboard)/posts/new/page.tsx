import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/posts/queries";
import PostEditor from "@/components/admin/posts/editor/PostEditor";

export const metadata: Metadata = {
  title: "New Post | Admin",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-brand-light hover:text-brand-heading">
        <ArrowLeft className="size-4" />
        Back to Posts
      </Link>
      <PostEditor categories={categories} />
    </div>
  );
}
