"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { createRecipePage } from "@/lib/recipes/mutations";
import { slugify } from "@/lib/recipes/types";
import type { MediaItem } from "@/lib/media/upload";

export default function AddPageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [route, setRoute] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setRoute("");
    setDescription("");
    setCoverImageUrl(null);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async () => {
    setError(null);
    const finalSlug = slugify(slug || name);
    if (!name.trim()) return setError("Page name is required.");
    if (!finalSlug) return setError("Slug is required.");
    if (!route.trim() || !route.startsWith("/")) return setError("Route must start with / — e.g. /vegetarian-meal-prep-ideas");

    setSaving(true);
    const result = await createRecipePage({
      name: name.trim(),
      slug: finalSlug,
      route: route.trim(),
      description: description.trim() || null,
      coverImageUrl,
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
          <p className="font-display text-lg text-brand-heading">Add a Page</p>
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
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Page Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Vegetarian Page"
              className="h-11 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="vegetarian"
              className="h-11 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-brand-light">Used internally as /admin/recipes/{slug || "…"}</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Live Route</label>
            <input
              type="text"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="/vegetarian-meal-prep-ideas"
              className="h-11 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-brand-light">
              The actual site page that will display these recipes. Building that page itself is a separate step.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Shown on this card in the dashboard…"
              rows={2}
              className="w-full resize-none rounded-[10px] border border-brand-border bg-white px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Cover Image (optional)</label>
            {coverImageUrl ? (
              <div className="relative mb-2 h-32 w-full overflow-hidden rounded-[12px]">
                <Image src={coverImageUrl} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl(null)}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-brand-heading"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mb-2 flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-brand-border text-brand-light transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
              >
                <ImagePlus className="size-5" />
                <span className="text-xs font-medium">Choose from Media Library</span>
              </button>
            )}
            <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(item: MediaItem) => setCoverImageUrl(item.url)} />
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
            {saving ? "Adding…" : "Add Page"}
          </button>
        </div>
      </div>
    </div>
  );
}
