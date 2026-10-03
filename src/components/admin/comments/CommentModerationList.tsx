"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Check, X, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { moderateComment, deleteComment } from "@/lib/recipes/comments";
import type { RecipeComment, CommentStatus } from "@/lib/recipes/types";

type Filter = CommentStatus;

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("size-3.5", i <= value ? "fill-brand-orange text-brand-orange" : "fill-none text-brand-border")} />
      ))}
    </span>
  );
}

export default function CommentModerationList({ comments }: { comments: RecipeComment[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      pending: comments.filter((c) => c.status === "pending").length,
      approved: comments.filter((c) => c.status === "approved").length,
      rejected: comments.filter((c) => c.status === "rejected").length,
    }),
    [comments]
  );

  const filtered = comments.filter((c) => c.status === filter);

  const handleModerate = async (comment: RecipeComment, action: "approve" | "reject") => {
    if (!comment.recipeSlug) return;
    setBusyId(comment.id);
    await moderateComment(comment.id, comment.recipeSlug, action);
    setBusyId(null);
    router.refresh();
  };

  const handleDelete = async (comment: RecipeComment) => {
    if (!comment.recipeSlug) return;
    if (!confirm(`Delete this comment from "${comment.authorName}" permanently?`)) return;
    setBusyId(comment.id);
    await deleteComment(comment.id, comment.recipeSlug);
    setBusyId(null);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-1.5 rounded-[12px] bg-brand-gray p-1">
        {(
          [
            { value: "pending", label: `Pending ${counts.pending}` },
            { value: "approved", label: `Approved ${counts.approved}` },
            { value: "rejected", label: `Rejected ${counts.rejected}` },
          ] as { value: Filter; label: string }[]
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={cn(
              "rounded-[9px] px-3.5 py-1.5 text-sm font-semibold transition-colors",
              filter === opt.value ? "bg-white text-brand-heading shadow-sm" : "text-brand-light hover:text-brand-heading"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[16px] border border-dashed border-brand-border/70 bg-white px-5 py-10 text-center text-sm text-brand-light">
          No {filter} comments.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((c) => (
            <li key={c.id} className="rounded-[16px] border border-brand-border/60 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-brand-heading">{c.authorName}</p>
                    <Stars value={c.rating} />
                  </div>
                  {c.recipeTitle && c.recipeSlug && (
                    <Link
                      href={`/recipes/${c.recipeSlug}`}
                      target="_blank"
                      className="mt-0.5 flex items-center gap-1 text-xs font-medium text-brand-primary-dark hover:underline"
                    >
                      {c.recipeTitle}
                      <ExternalLink className="size-3" />
                    </Link>
                  )}
                </div>
                <span className="shrink-0 text-xs text-brand-light">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-brand-body">{c.body}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-border/60 pt-4">
                {c.status !== "approved" && (
                  <button
                    type="button"
                    disabled={busyId === c.id}
                    onClick={() => handleModerate(c, "approve")}
                    className="flex items-center gap-1.5 rounded-[10px] bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
                  >
                    <Check className="size-3.5" />
                    Approve
                  </button>
                )}
                {c.status !== "rejected" && (
                  <button
                    type="button"
                    disabled={busyId === c.id}
                    onClick={() => handleModerate(c, "reject")}
                    className="flex items-center gap-1.5 rounded-[10px] border border-brand-border bg-white px-3.5 py-2 text-xs font-semibold text-brand-body transition-colors hover:border-brand-orange-deep hover:text-brand-orange-deep disabled:opacity-60"
                  >
                    <X className="size-3.5" />
                    Reject
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === c.id}
                  onClick={() => handleDelete(c)}
                  className="flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-xs font-semibold text-brand-error transition-colors hover:bg-brand-error/10 disabled:opacity-60"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
