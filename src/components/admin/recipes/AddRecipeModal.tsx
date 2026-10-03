"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { createRecipe } from "@/lib/recipes/mutations";
import { slugify, type RecipeStatus } from "@/lib/recipes/types";
import type { RecipeSection } from "@/lib/recipes/types";
import type { MediaItem } from "@/lib/media/upload";

export default function AddRecipeModal({
  open,
  onClose,
  pageId,
  sections,
}: {
  open: boolean;
  onClose: () => void;
  pageId: string;
  sections: RecipeSection[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [sectionId, setSectionId] = useState<string>(sections[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [status, setStatus] = useState<RecipeStatus>("draft");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setTitle("");
    setSectionId(sections[0]?.id ?? "");
    setDescription("");
    setImageUrl(null);
    setImageAlt("");
    setStatus("draft");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (!description.trim()) return setError("A short description is required.");

    setSaving(true);
    const result = await createRecipe({
      title: title.trim(),
      slug: slugify(title.trim()),
      description: description.trim(),
      heroImageUrl: imageUrl,
      heroImageAlt: imageAlt.trim() || title.trim(),
      pageId,
      sectionIds: sectionId ? [sectionId] : [],
      prepTimeMinutes: null,
      cookTimeMinutes: null,
      totalTimeMinutes: null,
      servings: null,
      servingsLabel: null,
      content: { type: "doc", content: [] },
      calories: null,
      proteinGrams: null,
      carbsGrams: null,
      fatGrams: null,
      tag: null,
      rating: null,
      status,
      seoTitle: null,
      seoDescription: null,
      seoOgImageUrl: null,
      canonicalUrl: null,
      focusKeyword: null,
      seoNoindex: false,
      seoNofollow: false,
      showAiShare: true,
    });
    setSaving(false);

    if (!result.ok) return setError(result.error);

    router.refresh();
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-brand-border/60 p-5">
          <p className="font-display text-lg text-brand-heading">Add Recipe</p>
          <button type="button" onClick={handleClose} aria-label="Close" className="text-brand-light hover:text-brand-heading">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {error && (
            <div className="flex items-start gap-2 rounded-[12px] bg-brand-error/10 px-4 py-3 text-sm text-brand-error">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. High-Protein Egg Bites"
              className="h-11 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>

          {sections.length > 0 && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-heading">Section</label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
              >
                <option value="">No section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.heading}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short, appetizing summary shown on the recipe card…"
              rows={3}
              className="w-full resize-none rounded-[10px] border border-brand-border bg-white px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Photo</label>
            {imageUrl ? (
              <div className="relative mb-2 h-36 w-full overflow-hidden rounded-[12px]">
                <Image src={imageUrl} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-brand-heading"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mb-2 flex h-28 w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-brand-border text-brand-light transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
              >
                <ImagePlus className="size-5" />
                <span className="text-xs font-medium">Choose from Media Library</span>
              </button>
            )}
            <MediaPicker
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
              onSelect={(item: MediaItem) => {
                setImageUrl(item.url);
                if (item.altText) setImageAlt(item.altText);
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RecipeStatus)}
              className="h-11 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            >
              <option value="draft">Draft — finish ingredients &amp; steps before publishing</option>
              <option value="published">Published — visible on the live site now</option>
            </select>
          </div>
        </div>

        <div className="border-t border-brand-border/60 p-5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving ? "Adding…" : "Add Recipe"}
          </button>
          <p className="mt-2 text-center text-[11px] text-brand-light">
            You can add ingredients, steps, and SEO details afterward by editing the recipe.
          </p>
        </div>
      </div>
    </div>
  );
}
