import type { PostStatus } from "@/lib/posts/types";

const styles: Record<PostStatus, string> = {
  published: "bg-brand-primary/10 text-brand-primary-dark",
  draft: "bg-brand-border/60 text-brand-body",
  scheduled: "bg-brand-orange/12 text-brand-orange-deep",
};

const labels: Record<PostStatus, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
};

export default function PostStatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
