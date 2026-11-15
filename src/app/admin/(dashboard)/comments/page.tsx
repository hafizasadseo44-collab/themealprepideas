import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getCommentsForModeration } from "@/lib/recipes/queries";
import CommentModerationDashboard from "@/components/admin/comments/CommentModerationDashboard";

export const metadata: Metadata = {
  title: "Comments & Reviews | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  await requireRole(["admin", "editor"]);
  const comments = await getCommentsForModeration();

  return (
    <div className="mx-auto max-w-6xl">
      <CommentModerationDashboard comments={comments} />
    </div>
  );
}
