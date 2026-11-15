"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageCircle,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  CornerDownRight,
  Reply,
  ChefHat,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitComment } from "@/lib/recipes/comments";
import type { Recipe, RecipeComment } from "@/lib/recipes/types";

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            size,
            i <= Math.round(value)
              ? "fill-brand-orange text-brand-orange"
              : "fill-none text-brand-border"
          )}
        />
      ))}
    </span>
  );
}

// Inline reply form for a specific comment
function ReplyForm({
  recipeId,
  slug,
  parentId,
  parentAuthor,
  onClose,
  onSuccess,
}: {
  recipeId: string;
  slug: string;
  parentId: string;
  parentAuthor: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (body.trim().length < 3) return setError("Please write your reply first (at least 3 characters).");

    setSubmitting(true);
    const result = await submitComment(recipeId, slug, {
      name,
      email: email.trim() || undefined,
      body,
      parentId,
      honeypot: website,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-3 overflow-hidden rounded-[16px] border border-brand-primary/25 bg-brand-primary/[0.02] p-4 sm:p-5"
    >
      <div className="flex items-center justify-between pb-3 border-b border-brand-border/40">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-heading">
          <CornerDownRight className="size-3.5 text-brand-primary" />
          Replying to <span className="text-brand-primary-dark">@{parentAuthor}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-brand-light hover:bg-brand-gray hover:text-brand-heading transition-colors"
          aria-label="Cancel reply"
        >
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={handleReplySubmit} className="mt-3 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-heading">Your name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya L."
              maxLength={80}
              className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-xs sm:text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-light">
              Your email <span className="text-[10px] text-brand-light/70">(optional, never published)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya@example.com"
              maxLength={120}
              className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-xs sm:text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-brand-heading">Your reply *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Share your thoughts with @${parentAuthor}...`}
            rows={3}
            maxLength={2000}
            className="w-full resize-none rounded-[10px] border border-brand-border bg-white px-3 py-2.5 text-xs sm:text-sm focus:border-brand-primary focus:outline-none"
          />
        </div>

        {/* Honeypot for bots */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[9999px] size-px opacity-0"
          aria-hidden="true"
        />

        {error && <p className="text-xs text-brand-error">{error}</p>}

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-brand-light">Replies are checked before going live.</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-[10px] px-3.5 text-xs font-medium text-brand-light hover:text-brand-heading transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-9 items-center gap-1.5 rounded-[10px] bg-brand-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
            >
              {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
              {submitting ? "Sending..." : "Post reply"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

export default function RecipeComments({
  recipe,
  comments,
}: {
  recipe: Recipe;
  comments: RecipeComment[];
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Replying state: tracks which comment id currently has the reply box open
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replySuccessId, setReplySuccessId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (rating === 0) return setError("Please select a star rating (1–5).");
    if (body.trim().length < 3) return setError("Please write a short comment first.");

    setSubmitting(true);
    const result = await submitComment(recipe.id, recipe.slug, {
      name,
      rating,
      body,
      honeypot: website,
    });
    setSubmitting(false);

    if (!result.ok) return setError(result.error);

    setDone(true);
    setName("");
    setRating(0);
    setBody("");
  };

  // Count total items (top-level + all nested replies)
  const totalCommentsAndReplies = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <div id="reviews" className="scroll-mt-28 space-y-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-brand-heading">Reviews &amp; Comments</h2>
            <p className="text-sm text-brand-light">
              {totalCommentsAndReplies > 0
                ? `${totalCommentsAndReplies} review${totalCommentsAndReplies === 1 ? "" : "s"} & replies · ${recipe.ratingCount || comments.length} verified ratings`
                : "Be the first to rate, review, or ask a question about this recipe."}
            </p>
          </div>
        </div>

        {recipe.rating != null && recipe.rating > 0 && (
          <div className="flex items-center gap-2.5 rounded-[16px] border border-brand-border/60 bg-white px-4 py-2.5 shadow-xs">
            <span className="font-display text-2xl text-brand-heading">
              {recipe.rating.toFixed(1)}
            </span>
            <div>
              <Stars value={recipe.rating} size="size-3.5" />
              <p className="mt-0.5 text-[11px] text-brand-light">
                {recipe.ratingCount} rating{recipe.ratingCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comment List */}
      {comments.length > 0 ? (
        <ul className="space-y-6">
          {comments.map((c, i) => {
            const hasReplies = Boolean(c.replies && c.replies.length > 0);
            const isReplying = activeReplyId === c.id;
            const isSuccess = replySuccessId === c.id;

            return (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="group relative rounded-[20px] border border-brand-border/70 bg-white p-5 sm:p-6 shadow-xs hover:border-brand-border transition-colors"
              >
                {/* Main Comment */}
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-xs",
                      c.isAdmin || c.authorRole === "admin"
                        ? "bg-brand-primary text-white"
                        : "bg-emerald-50 text-brand-primary-dark border border-brand-primary/20"
                    )}
                  >
                    {c.isAdmin ? <ChefHat className="size-5" /> : initialsOf(c.authorName) || "?"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-brand-heading text-sm sm:text-base">
                          {c.authorName}
                        </p>
                        {(c.isAdmin || c.authorRole === "admin") && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-primary-dark">
                            <Sparkles className="size-3" />
                            Recipe Author
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-brand-light">{timeAgo(c.createdAt)}</span>
                    </div>

                    {c.rating != null && c.rating > 0 && (
                      <div className="mt-1">
                        <Stars value={c.rating} size="size-4" />
                      </div>
                    )}

                    <p className="mt-2.5 text-[15px] leading-relaxed text-brand-body whitespace-pre-line">
                      {c.body}
                    </p>

                    {/* Action buttons (Reply button) */}
                    <div className="mt-3.5 flex items-center gap-3 pt-2 border-t border-brand-border/40">
                      <button
                        type="button"
                        onClick={() => {
                          setReplySuccessId(null);
                          setActiveReplyId(isReplying ? null : c.id);
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-xs font-semibold transition-all",
                          isReplying
                            ? "bg-brand-primary/10 text-brand-primary-dark"
                            : "text-brand-light hover:bg-brand-gray hover:text-brand-heading"
                        )}
                      >
                        <Reply className="size-3.5" />
                        Reply
                      </button>

                      {hasReplies && (
                        <span className="text-xs font-medium text-brand-light/80">
                          {c.replies!.length} {c.replies!.length === 1 ? "reply" : "replies"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reply Success notification */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 flex items-start gap-2.5 rounded-[12px] bg-brand-primary/10 p-3 text-xs text-brand-primary-dark"
                    >
                      <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Thank you for your reply!</p>
                        <p className="text-brand-body text-[11px]">
                          It will appear here as soon as our moderation team gives it a quick check.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expandable Reply Input Box */}
                <AnimatePresence>
                  {isReplying && (
                    <ReplyForm
                      recipeId={recipe.id}
                      slug={recipe.slug}
                      parentId={c.id}
                      parentAuthor={c.authorName}
                      onClose={() => setActiveReplyId(null)}
                      onSuccess={() => {
                        setActiveReplyId(null);
                        setReplySuccessId(c.id);
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Threaded / Nested Replies Section */}
                {hasReplies && (
                  <div className="mt-5 space-y-3.5 border-l-2 border-brand-primary/25 pl-4 sm:pl-7 pt-1">
                    {c.replies!.map((reply) => {
                      const isReplyAdmin = reply.isAdmin || reply.authorRole === "admin";
                      const isNestedReplying = activeReplyId === reply.id;
                      const isNestedSuccess = replySuccessId === reply.id;

                      return (
                        <div
                          key={reply.id}
                          className={cn(
                            "rounded-[16px] p-4 transition-colors",
                            isReplyAdmin
                              ? "bg-brand-primary/[0.04] border border-brand-primary/25"
                              : "bg-brand-gray/60 border border-brand-border/50"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-2xs",
                                isReplyAdmin
                                  ? "bg-brand-primary text-white"
                                  : "bg-white text-brand-primary-dark border border-brand-border"
                              )}
                            >
                              {isReplyAdmin ? (
                                <ChefHat className="size-4" />
                              ) : (
                                initialsOf(reply.authorName) || "?"
                              )}
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-xs sm:text-sm font-semibold text-brand-heading">
                                    {reply.authorName}
                                  </p>
                                  {isReplyAdmin && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary-dark">
                                      <Sparkles className="size-2.5" />
                                      Team / Chef
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-brand-light">
                                  {timeAgo(reply.createdAt)}
                                </span>
                              </div>

                              <p className="mt-1.5 text-xs sm:text-[14px] leading-relaxed text-brand-body whitespace-pre-line">
                                {reply.body}
                              </p>

                              {/* Nested Reply button */}
                              <div className="mt-2.5 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplySuccessId(null);
                                    setActiveReplyId(isNestedReplying ? null : reply.id);
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-light hover:text-brand-primary transition-colors"
                                >
                                  <Reply className="size-3" />
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Nested reply success */}
                          <AnimatePresence>
                            {isNestedSuccess && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-2.5 flex items-start gap-2 rounded-[10px] bg-brand-primary/10 p-2.5 text-xs text-brand-primary-dark"
                              >
                                <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                                <p className="text-[11px]">
                                  Your reply has been submitted and will appear after moderation.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Nested Reply form */}
                          <AnimatePresence>
                            {isNestedReplying && (
                              <ReplyForm
                                recipeId={recipe.id}
                                slug={recipe.slug}
                                parentId={c.id} // replies connect to the top-level thread
                                parentAuthor={reply.authorName}
                                onClose={() => setActiveReplyId(null)}
                                onSuccess={() => {
                                  setActiveReplyId(null);
                                  setReplySuccessId(reply.id);
                                }}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-[18px] border border-dashed border-brand-border/80 bg-brand-gray/40 px-6 py-10 text-center">
          <MessageCircle className="mx-auto size-8 text-brand-light/70" />
          <p className="mt-2 text-sm font-medium text-brand-heading">No comments yet</p>
          <p className="mt-1 text-xs text-brand-light">
            Be the first cook to share feedback or ask a question about this recipe!
          </p>
        </div>
      )}

      {/* Leave a Review Form */}
      <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
            <Star className="size-4 fill-brand-primary" />
          </span>
          <h3 className="font-display text-xl text-brand-heading">Leave a Review &amp; Rating</h3>
        </div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-start gap-3.5 rounded-[16px] bg-brand-primary/10 p-5 text-sm text-brand-primary-dark border border-brand-primary/20"
          >
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-primary" />
            <div>
              <p className="font-semibold text-base">Thanks for your review!</p>
              <p className="mt-1 text-brand-body leading-relaxed">
                Your feedback has been received and will appear on this recipe as soon as our team completes a quick check.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-3 text-xs font-semibold underline hover:text-brand-heading"
              >
                Write another review
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-heading">
                  Your name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sara K."
                  maxLength={80}
                  className="h-11 w-full rounded-[12px] border border-brand-border bg-white px-3.5 text-sm focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-heading">
                  Your overall rating *
                </label>
                <div className="flex h-11 items-center gap-1 rounded-[12px] border border-brand-border/60 bg-brand-gray/30 px-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${i} star${i > 1 ? "s" : ""}`}
                      className="p-1 text-brand-orange transition-transform duration-150 hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "size-6",
                          i <= (hoverRating || rating)
                            ? "fill-brand-orange text-brand-orange"
                            : "fill-none text-brand-border"
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-brand-heading">
                    {(hoverRating || rating) > 0 ? `${hoverRating || rating} / 5` : "Tap to rate"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-brand-heading">
                Your review or question *
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What did you think of the flavor? Any tips, prep swaps, or questions for other meal preppers?"
                rows={4}
                maxLength={2000}
                className="w-full resize-none rounded-[12px] border border-brand-border bg-white px-3.5 py-3 text-sm focus:border-brand-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Honeypot */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] size-px opacity-0"
              aria-hidden="true"
            />

            {error && (
              <p className="rounded-[10px] bg-brand-error/10 px-3 py-2 text-xs font-medium text-brand-error">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="flex items-center gap-1.5 text-xs text-brand-light">
                <ShieldCheck className="size-4 text-brand-primary" />
                Comments are moderated for community safety. External links are filtered.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-6 text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-primary-dark active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
