"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, ShieldCheck, Send, Loader2, CheckCircle2 } from "lucide-react";
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
        <Star key={i} className={cn(size, i <= Math.round(value) ? "fill-brand-orange text-brand-orange" : "fill-none text-brand-border")} />
      ))}
    </span>
  );
}

export default function RecipeComments({ recipe, comments }: { recipe: Recipe; comments: RecipeComment[] }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Enter your name.");
    if (rating === 0) return setError("Pick a star rating.");
    if (body.trim().length < 3) return setError("Write a short comment first.");

    setSubmitting(true);
    const result = await submitComment(recipe.id, recipe.slug, { name, rating, body, honeypot: website });
    setSubmitting(false);

    if (!result.ok) return setError(result.error);

    setDone(true);
    setName("");
    setRating(0);
    setBody("");
  };

  return (
    <div id="reviews" className="scroll-mt-28 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-brand-heading">Reviews &amp; Comments</h2>
            <p className="text-sm text-brand-light">
              {recipe.ratingCount > 0
                ? `${comments.length} comment${comments.length === 1 ? "" : "s"} · ${recipe.ratingCount} rating${recipe.ratingCount === 1 ? "" : "s"}`
                : "Be the first to rate and review this recipe."}
            </p>
          </div>
        </div>
        {recipe.ratingCount > 0 && recipe.rating != null && (
          <div className="flex items-center gap-2.5 rounded-[16px] border border-brand-border/60 bg-white px-4 py-2.5">
            <span className="font-display text-2xl text-brand-heading">{recipe.rating.toFixed(1)}</span>
            <div>
              <Stars value={recipe.rating} size="size-3.5" />
              <p className="mt-0.5 text-[11px] text-brand-light">{recipe.ratingCount} rating{recipe.ratingCount === 1 ? "" : "s"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Comment list */}
      {comments.length > 0 ? (
        <ul className="space-y-5">
          {comments.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className="rounded-[18px] border border-brand-border/60 bg-white p-5"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-bold text-brand-primary-dark">
                  {initialsOf(c.authorName) || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p className="font-semibold text-brand-heading">{c.authorName}</p>
                    <span className="text-xs text-brand-light">{timeAgo(c.createdAt)}</span>
                  </div>
                  <div className="mt-1">
                    <Stars value={c.rating} />
                  </div>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-brand-body">{c.body}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[16px] border border-dashed border-brand-border/70 bg-brand-gray/50 px-5 py-8 text-center text-sm text-brand-light">
          No comments yet — share what you thought of this recipe.
        </p>
      )}

      {/* Write a review */}
      <div className="rounded-[22px] border border-brand-border/60 bg-white p-6 sm:p-7">
        <h3 className="font-display text-xl text-brand-heading">Leave a Review</h3>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 rounded-[14px] bg-brand-primary/8 px-4 py-4 text-sm text-brand-primary-dark"
          >
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">Thanks for your review!</p>
              <p className="mt-0.5 text-brand-body">It&apos;s been sent for a quick check and will appear here once approved.</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-heading">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sara K."
                  maxLength={80}
                  className="h-11 w-full rounded-[12px] border border-brand-border bg-white px-3.5 text-sm focus:border-brand-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-heading">Your rating</label>
                <div className="flex h-11 items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${i} star${i > 1 ? "s" : ""}`}
                      className="p-0.5 text-brand-orange transition-transform duration-150 hover:scale-125"
                    >
                      <Star className={cn("size-6", i <= (hoverRating || rating) ? "fill-brand-orange text-brand-orange" : "fill-none text-brand-border")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-heading">Your comment</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What did you think? Any swaps or tips for other cooks?"
                rows={4}
                maxLength={2000}
                className="w-full resize-none rounded-[12px] border border-brand-border bg-white px-3.5 py-3 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>

            {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] size-px opacity-0"
              aria-hidden="true"
            />

            {error && <p className="text-sm text-brand-error">{error}</p>}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="flex items-center gap-1.5 text-xs text-brand-light">
                <ShieldCheck className="size-3.5" />
                Reviews are checked before they&apos;re published. Links aren&apos;t allowed.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {submitting ? "Sending…" : "Submit review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
