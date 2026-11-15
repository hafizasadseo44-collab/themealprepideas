"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Check,
  X,
  Trash2,
  ExternalLink,
  Search,
  MessageCircle,
  Reply,
  CheckCircle2,
  Clock,
  Filter,
  CornerDownRight,
  ShieldCheck,
  ChefHat,
  Sparkles,
  Edit2,
  Save,
  RotateCcw,
  Copy,
  ChevronDown,
  ChevronUp,
  Database,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  moderateComment,
  deleteComment,
  submitAdminReply,
  updateComment,
  bulkModerateComments,
} from "@/lib/recipes/comments";
import type { RecipeComment, CommentStatus } from "@/lib/recipes/types";

type TabFilter = "all" | CommentStatus | "reviews" | "replies";

function Stars({ value, size = "size-3.5" }: { value: number; size?: string }) {
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

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function CommentModerationDashboard({
  comments: initialComments,
}: {
  comments: RecipeComment[];
}) {
  const router = useRouter();

  // Filter & Search states
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating-high" | "rating-low">("newest");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Interactive states
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyingBusy, setReplyingBusy] = useState(false);

  // Edit comment state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editBusy, setEditBusy] = useState(false);

  // Expanded thread IDs (which comments have their replies expanded)
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  // SQL helper modal state
  const [showSqlHelper, setShowSqlHelper] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Unique recipes for dropdown
  const uniqueRecipes = useMemo(() => {
    const map = new Map<string, string>();
    initialComments.forEach((c) => {
      if (c.recipeSlug && c.recipeTitle) {
        map.set(c.recipeSlug, c.recipeTitle);
      }
    });
    return Array.from(map.entries()).map(([slug, title]) => ({ slug, title }));
  }, [initialComments]);

  // High-level statistics
  const stats = useMemo(() => {
    const total = initialComments.length;
    const pending = initialComments.filter((c) => c.status === "pending").length;
    const approved = initialComments.filter((c) => c.status === "approved").length;
    const rejected = initialComments.filter((c) => c.status === "rejected").length;
    const replies = initialComments.filter((c) => Boolean(c.parentId)).length;
    const reviews = total - replies;

    const ratedComments = initialComments.filter((c) => c.rating != null && c.rating > 0);
    const avgRating =
      ratedComments.length > 0
        ? (
            ratedComments.reduce((acc, c) => acc + (c.rating || 0), 0) /
            ratedComments.length
          ).toFixed(1)
        : null;

    return { total, pending, approved, rejected, replies, reviews, avgRating };
  }, [initialComments]);

  // Filtered & Sorted comments
  const filteredComments = useMemo(() => {
    return initialComments
      .filter((c) => {
        // Tab filter
        if (tab === "pending" && c.status !== "pending") return false;
        if (tab === "approved" && c.status !== "approved") return false;
        if (tab === "rejected" && c.status !== "rejected") return false;
        if (tab === "reviews" && Boolean(c.parentId)) return false;
        if (tab === "replies" && !c.parentId) return false;

        // Recipe filter
        if (selectedRecipe !== "all" && c.recipeSlug !== selectedRecipe) return false;

        // Rating filter
        if (ratingFilter !== "all") {
          const target = parseInt(ratingFilter, 10);
          if (c.rating !== target) return false;
        }

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = c.authorName.toLowerCase().includes(q);
          const matchBody = c.body.toLowerCase().includes(q);
          const matchEmail = c.authorEmail?.toLowerCase().includes(q);
          const matchRecipe = c.recipeTitle?.toLowerCase().includes(q);
          if (!matchName && !matchBody && !matchEmail && !matchRecipe) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "rating-high") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === "rating-low") {
          return (a.rating || 0) - (b.rating || 0);
        }
        return 0;
      });
  }, [initialComments, tab, selectedRecipe, ratingFilter, search, sortBy]);

  // Bulk actions handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredComments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredComments.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    if (selectedIds.size === 0) return;
    if (
      action === "delete" &&
      !confirm(`Permanently delete ${selectedIds.size} selected comments? This cannot be undone.`)
    ) {
      return;
    }

    setBulkBusy(true);
    await bulkModerateComments(Array.from(selectedIds), action);
    setSelectedIds(new Set());
    setBulkBusy(false);
    router.refresh();
  };

  // Single action moderation
  const handleModerate = async (comment: RecipeComment, action: "approve" | "reject") => {
    setBusyId(comment.id);
    await moderateComment(comment.id, comment.recipeSlug, action);
    setBusyId(null);
    router.refresh();
  };

  const handleDelete = async (comment: RecipeComment) => {
    if (!confirm(`Delete this comment from "${comment.authorName}" permanently?`)) return;
    setBusyId(comment.id);
    await deleteComment(comment.id, comment.recipeSlug);
    setBusyId(null);
    router.refresh();
  };

  // Admin Reply handler
  const handlePostAdminReply = async (comment: RecipeComment) => {
    if (!replyText.trim()) return;
    if (!comment.recipeSlug) return;

    setReplyingBusy(true);
    const result = await submitAdminReply(
      comment.recipeId,
      comment.recipeSlug,
      comment.id,
      replyText
    );
    setReplyingBusy(false);

    if (result.ok) {
      setReplyingToId(null);
      setReplyText("");
      router.refresh();
    } else {
      alert(`Error posting reply: ${result.error}`);
    }
  };

  // Edit comment handler
  const handleSaveEdit = async (comment: RecipeComment) => {
    if (!editText.trim()) return;
    setEditBusy(true);
    const result = await updateComment(comment.id, comment.recipeSlug, editText);
    setEditBusy(false);

    if (result.ok) {
      setEditingId(null);
      router.refresh();
    } else {
      alert(`Error saving comment: ${result.error}`);
    }
  };

  // Toggle thread view
  const toggleThread = (id: string) => {
    const next = new Set(expandedThreads);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedThreads(next);
  };

  // SQL code for copy helper
  const sqlCode = `-- Run this in your Supabase SQL Editor:
ALTER TABLE recipe_comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES recipe_comments(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS recipe_comments_parent_id_idx ON recipe_comments(parent_id);
ALTER TABLE recipe_comments ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;
ALTER TABLE recipe_comments ADD COLUMN IF NOT EXISTS author_role text NOT NULL DEFAULT 'user';
ALTER TABLE recipe_comments ADD COLUMN IF NOT EXISTS author_email text;
ALTER TABLE recipe_comments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE recipe_comments ALTER COLUMN rating DROP NOT NULL;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-brand-heading">
            Comments &amp; Reviews Moderation
          </h1>
          <p className="mt-1 text-sm text-brand-light">
            Manage customer reviews, community questions, and nested replies across all recipes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSqlHelper(!showSqlHelper)}
            className="inline-flex items-center gap-1.5 rounded-[12px] border border-brand-border/70 bg-white px-3.5 py-2 text-xs font-semibold text-brand-heading shadow-2xs hover:bg-brand-gray transition-colors"
          >
            <Database className="size-3.5 text-brand-primary" />
            Database Setup
          </button>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-1.5 rounded-[12px] bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-brand-primary-dark transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Database Setup Helper Collapsible */}
      {showSqlHelper && (
        <div className="rounded-[18px] border border-brand-primary/30 bg-brand-primary/[0.03] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Database className="size-5 text-brand-primary" />
              <h3 className="font-semibold text-sm text-brand-heading">
                Threaded Replies &amp; Admin Badges Database Migration
              </h3>
            </div>
            <button
              type="button"
              onClick={copySqlToClipboard}
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-primary-dark"
            >
              {sqlCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {sqlCopied ? "Copied SQL!" : "Copy SQL Script"}
            </button>
          </div>
          <p className="mt-2 text-xs text-brand-body leading-relaxed">
            Migration file <code className="rounded bg-white px-1.5 py-0.5 border border-brand-border font-mono text-[11px]">supabase/migrations/0019_recipe_comment_replies.sql</code> is ready in your repository. Run it once in your Supabase SQL Editor to enable threaded parent-child links and admin badges in PostgreSQL.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-[12px] border border-brand-border/80 bg-white p-3 font-mono text-xs text-brand-body">
            {sqlCode}
          </pre>
        </div>
      )}

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total */}
        <div className="rounded-[16px] border border-brand-border/60 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-brand-light">Total Comments</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl text-brand-heading">{stats.total}</span>
            <span className="text-[11px] text-brand-light">
              {stats.reviews} reviews · {stats.replies} replies
            </span>
          </div>
        </div>

        {/* Pending Moderation */}
        <div
          className={cn(
            "rounded-[16px] border p-4 shadow-2xs transition-colors",
            stats.pending > 0
              ? "border-amber-300 bg-amber-50/70"
              : "border-brand-border/60 bg-white"
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-800">Needs Review</p>
            {stats.pending > 0 && (
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl text-amber-900">{stats.pending}</span>
            <span className="text-[11px] text-amber-700">pending approval</span>
          </div>
        </div>

        {/* Approved */}
        <div className="rounded-[16px] border border-brand-border/60 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-brand-light">Approved &amp; Live</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl text-brand-heading">{stats.approved}</span>
            <span className="text-[11px] text-emerald-600 font-medium">published</span>
          </div>
        </div>

        {/* Rejected */}
        <div className="rounded-[16px] border border-brand-border/60 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-brand-light">Rejected</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl text-brand-heading">{stats.rejected}</span>
            <span className="text-[11px] text-brand-light">hidden</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="col-span-2 sm:col-span-1 rounded-[16px] border border-brand-border/60 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-brand-light">Average Rating</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl text-brand-heading">
              {stats.avgRating ? `${stats.avgRating} ★` : "—"}
            </span>
            <span className="text-[11px] text-brand-light">from reviews</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="space-y-3.5 rounded-[20px] border border-brand-border/60 bg-white p-4 shadow-2xs">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-border/40 pb-3">
          {(
            [
              { value: "all", label: `All (${stats.total})` },
              {
                value: "pending",
                label: `Pending (${stats.pending})`,
                alert: stats.pending > 0,
              },
              { value: "approved", label: `Approved (${stats.approved})` },
              { value: "rejected", label: `Rejected (${stats.rejected})` },
              { value: "reviews", label: `Reviews (${stats.reviews})` },
              { value: "replies", label: `Replies (${stats.replies})` },
            ] as { value: TabFilter; label: string; alert?: boolean }[]
          ).map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTab(t.value);
                setSelectedIds(new Set());
              }}
              className={cn(
                "relative rounded-[10px] px-3.5 py-1.5 text-xs font-semibold transition-all",
                tab === t.value
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-brand-gray/60 text-brand-heading hover:bg-brand-gray"
              )}
            >
              {t.label}
              {t.alert && (
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-amber-500" />
              )}
            </button>
          ))}
        </div>

        {/* Search, Recipe & Sort Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search box */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search author, keyword, email..."
              className="h-9 w-full rounded-[10px] border border-brand-border bg-brand-gray/30 pl-9 pr-3 text-xs focus:border-brand-primary focus:bg-white focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-light hover:text-brand-heading"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Recipe Filter Dropdown */}
          <div>
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="h-9 w-full rounded-[10px] border border-brand-border bg-brand-gray/30 px-3 text-xs focus:border-brand-primary focus:bg-white focus:outline-none"
            >
              <option value="all">All Recipes ({uniqueRecipes.length})</option>
              {uniqueRecipes.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter Dropdown */}
          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="h-9 w-full rounded-[10px] border border-brand-border bg-brand-gray/30 px-3 text-xs focus:border-brand-primary focus:bg-white focus:outline-none"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "newest" | "oldest" | "rating-high" | "rating-low"
                )
              }
              className="h-9 w-full rounded-[10px] border border-brand-border bg-brand-gray/30 px-3 text-xs focus:border-brand-primary focus:bg-white focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="rating-high">Sort: Highest Rating</option>
              <option value="rating-low">Sort: Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-brand-heading p-3 text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {selectedIds.size}
            </span>
            <span className="text-xs font-semibold">Comments Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkAction("approve")}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Check className="size-3" />
              Approve
            </button>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkAction("reject")}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              <X className="size-3" />
              Reject
            </button>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkAction("delete")}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              <Trash2 className="size-3" />
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-[8px] px-2.5 py-1.5 text-xs font-medium text-white/80 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comments List Header & Select All */}
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-brand-body">
          <input
            type="checkbox"
            checked={
              filteredComments.length > 0 &&
              selectedIds.size === filteredComments.length
            }
            onChange={toggleSelectAll}
            className="size-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
          />
          <span>
            Select All ({filteredComments.length}{" "}
            {filteredComments.length === 1 ? "comment" : "comments"})
          </span>
        </label>

        <span className="text-xs text-brand-light">
          Showing {filteredComments.length} of {initialComments.length}
        </span>
      </div>

      {/* Main Comments List */}
      {filteredComments.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-brand-border/80 bg-white px-6 py-16 text-center">
          <MessageCircle className="mx-auto size-10 text-brand-light/60" />
          <h3 className="mt-3 font-semibold text-base text-brand-heading">
            No comments match your filter
          </h3>
          <p className="mt-1 text-xs text-brand-light max-w-sm mx-auto">
            Try clearing your search query or selecting a different status filter tab above.
          </p>
          {(search || tab !== "all" || selectedRecipe !== "all" || ratingFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setTab("all");
                setSearch("");
                setSelectedRecipe("all");
                setRatingFilter("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-[10px] bg-brand-primary px-4 py-2 text-xs font-semibold text-white hover:bg-brand-primary-dark"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredComments.map((c) => {
            const isSelected = selectedIds.has(c.id);
            const isReplying = replyingToId === c.id;
            const isEditing = editingId === c.id;
            const isBusy = busyId === c.id;
            const isReply = Boolean(c.parentId);
            const isAdmin = c.isAdmin || c.authorRole === "admin";

            // Find any replies that belong to this comment
            const childReplies = initialComments.filter((item) => item.parentId === c.id);
            const isThreadExpanded = expandedThreads.has(c.id);

            return (
              <li
                key={c.id}
                className={cn(
                  "rounded-[20px] border bg-white p-5 sm:p-6 shadow-2xs transition-all",
                  isSelected
                    ? "border-brand-primary bg-brand-primary/[0.02]"
                    : c.status === "pending"
                    ? "border-amber-300 bg-amber-50/[0.15]"
                    : "border-brand-border/70"
                )}
              >
                {/* Header row: Checkbox, Author, Rating/Badge, Recipe link, Status, Date */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(c.id)}
                      className="mt-1 size-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary cursor-pointer"
                    />

                    {/* Author Avatar */}
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        isAdmin
                          ? "bg-brand-primary text-white"
                          : "bg-emerald-50 text-brand-primary-dark border border-brand-primary/20"
                      )}
                    >
                      {isAdmin ? <ChefHat className="size-4" /> : initialsOf(c.authorName) || "?"}
                    </span>

                    {/* Author Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm sm:text-base text-brand-heading">
                          {c.authorName}
                        </p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary-dark">
                            <Sparkles className="size-2.5" />
                            Official Admin
                          </span>
                        )}
                        {isReply && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-semibold">
                            <Reply className="size-2.5" />
                            Reply
                          </span>
                        )}
                      </div>

                      {c.authorEmail && (
                        <p className="text-[11px] text-brand-light">{c.authorEmail}</p>
                      )}

                      {/* Recipe Link */}
                      {c.recipeTitle && c.recipeSlug && (
                        <Link
                          href={`/recipes/${c.recipeSlug}`}
                          target="_blank"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-brand-primary-dark hover:underline"
                        >
                          <span>{c.recipeTitle}</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right side: Status pill, Rating, Date */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                      {/* Rating (if review) */}
                      {c.rating != null && c.rating > 0 && <Stars value={c.rating} />}

                      {/* Status Pill */}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                          c.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "pending"
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : "bg-rose-100 text-rose-800"
                        )}
                      >
                        {c.status === "approved" && <Check className="size-3" />}
                        {c.status === "pending" && <Clock className="size-3" />}
                        {c.status === "rejected" && <X className="size-3" />}
                        {c.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-brand-light">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Parent comment context if this is a reply */}
                {isReply && c.parentAuthorName && (
                  <div className="mt-3.5 flex items-start gap-2 rounded-[12px] bg-brand-gray/60 p-3 text-xs text-brand-body border-l-2 border-brand-primary/40">
                    <CornerDownRight className="size-3.5 text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-brand-heading">
                        Replying to @{c.parentAuthorName}:
                      </span>{" "}
                      <span className="italic text-brand-light">
                        &ldquo;{c.parentBody ? c.parentBody.slice(0, 140) + "..." : "original comment"}&rdquo;
                      </span>
                    </div>
                  </div>
                )}

                {/* Comment Body / Edit View */}
                {isEditing ? (
                  <div className="mt-3.5 space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full rounded-[10px] border border-brand-border bg-white p-3 text-xs sm:text-sm focus:border-brand-primary focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={editBusy}
                        onClick={() => handleSaveEdit(c)}
                        className="inline-flex items-center gap-1 rounded-[8px] bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-dark"
                      >
                        {editBusy ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-[8px] px-3 py-1.5 text-xs text-brand-light hover:text-brand-heading"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3.5 text-xs sm:text-[15px] leading-relaxed text-brand-body whitespace-pre-line">
                    {c.body}
                  </p>
                )}

                {/* Admin Reply Composer Form */}
                {isReplying && (
                  <div className="mt-4 rounded-[16px] border border-brand-primary/30 bg-brand-primary/[0.03] p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-brand-primary/20">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-heading">
                        <ChefHat className="size-4 text-brand-primary" />
                        Reply as <span className="text-brand-primary-dark">Admin / Recipe Author</span> to @{c.authorName}
                      </p>
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-brand-light hover:text-brand-heading"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Write an official answer or tip for ${c.authorName}...`}
                        rows={3}
                        className="w-full resize-none rounded-[10px] border border-brand-border bg-white p-3 text-xs sm:text-sm focus:border-brand-primary focus:outline-none"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-brand-light">
                          Will be published instantly with the verified Official Author badge.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="rounded-[8px] px-3 py-1.5 text-xs text-brand-light hover:text-brand-heading"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={replyingBusy || !replyText.trim()}
                            onClick={() => handlePostAdminReply(c)}
                            className="inline-flex items-center gap-1.5 rounded-[10px] bg-brand-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-dark disabled:opacity-50"
                          >
                            {replyingBusy ? <Loader2 className="size-3 animate-spin" /> : <Reply className="size-3" />}
                            Post Official Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Moderation Actions Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-border/40 pt-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Approve button */}
                    {c.status !== "approved" && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleModerate(c, "approve")}
                        className="inline-flex items-center gap-1.5 rounded-[10px] bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 shadow-2xs"
                      >
                        <Check className="size-3.5" />
                        Approve
                      </button>
                    )}

                    {/* Reject button */}
                    {c.status !== "rejected" && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleModerate(c, "reject")}
                        className="inline-flex items-center gap-1.5 rounded-[10px] border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-body hover:border-amber-500 hover:text-amber-700 disabled:opacity-60 shadow-2xs"
                      >
                        <X className="size-3.5" />
                        Reject
                      </button>
                    )}

                    {/* Admin Reply button */}
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingToId(isReplying ? null : c.id);
                        setReplyText("");
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs",
                        isReplying
                          ? "bg-brand-primary text-white"
                          : "border border-brand-primary/40 bg-brand-primary/5 text-brand-primary-dark hover:bg-brand-primary/10"
                      )}
                    >
                      <Reply className="size-3.5" />
                      Reply as Admin
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(isEditing ? null : c.id);
                        setEditText(c.body);
                      }}
                      className="inline-flex items-center gap-1 rounded-[10px] border border-brand-border bg-white px-2.5 py-1.5 text-xs font-medium text-brand-light hover:text-brand-heading shadow-2xs"
                    >
                      <Edit2 className="size-3" />
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDelete(c)}
                      className="inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-xs font-medium text-brand-error hover:bg-brand-error/10 disabled:opacity-60"
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                  </div>

                  {/* Child replies indicator & toggle */}
                  {childReplies.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleThread(c.id)}
                      className="inline-flex items-center gap-1 rounded-[8px] bg-brand-gray px-2.5 py-1 text-xs font-semibold text-brand-heading hover:bg-brand-border/40"
                    >
                      <span>
                        {childReplies.length} {childReplies.length === 1 ? "nested reply" : "nested replies"}
                      </span>
                      {isThreadExpanded ? (
                        <ChevronUp className="size-3" />
                      ) : (
                        <ChevronDown className="size-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Nested Thread Inside Admin */}
                {childReplies.length > 0 && isThreadExpanded && (
                  <div className="mt-4 space-y-2.5 border-l-2 border-brand-primary/30 pl-4 sm:pl-6 pt-2">
                    <p className="text-[11px] font-bold text-brand-light uppercase tracking-wider">
                      Conversation Thread ({childReplies.length})
                    </p>
                    {childReplies.map((reply) => (
                      <div
                        key={reply.id}
                        className={cn(
                          "rounded-[14px] p-3 text-xs",
                          reply.isAdmin
                            ? "bg-brand-primary/[0.04] border border-brand-primary/20"
                            : "bg-brand-gray/50 border border-brand-border/50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-brand-heading">
                              {reply.authorName}
                            </span>
                            {reply.isAdmin && (
                              <span className="rounded bg-brand-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-brand-primary-dark">
                                Admin
                              </span>
                            )}
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
                                reply.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : reply.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              )}
                            >
                              {reply.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-brand-light">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-brand-body leading-relaxed">{reply.body}</p>

                        <div className="mt-2 flex items-center gap-2">
                          {reply.status !== "approved" && (
                            <button
                              type="button"
                              onClick={() => handleModerate(reply, "approve")}
                              className="text-[10px] font-semibold text-emerald-600 hover:underline"
                            >
                              Approve
                            </button>
                          )}
                          {reply.status !== "rejected" && (
                            <button
                              type="button"
                              onClick={() => handleModerate(reply, "reject")}
                              className="text-[10px] font-semibold text-amber-600 hover:underline"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(reply)}
                            className="text-[10px] font-semibold text-brand-error hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
