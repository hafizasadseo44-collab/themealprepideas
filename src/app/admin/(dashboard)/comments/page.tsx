import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getCommentsForModeration } from "@/lib/recipes/queries";
import CommentModerationList from "@/components/admin/comments/CommentModerationList";

export const metadata: Metadata = {
  title: "Comments | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  await requireRole(["admin", "editor"]);
  const comments = await getCommentsForModeration();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-brand-heading">Comments</h1>
      <p className="mt-1 text-sm text-brand-light">
        Reviews people leave on recipes — approve the good ones, reject the rest. Nothing goes live until you say so.
      </p>

      <div className="mt-6">
        <CommentModerationList comments={comments} />
      </div>
    </div>
  );
}
