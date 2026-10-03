"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, CheckCircle2, Circle, Search, X, ImagePlus } from "lucide-react";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaItem } from "@/lib/media/upload";

export type SeoState = {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  focusKeyword: string;
  ogImage: string;
  noindex: boolean;
  nofollow: boolean;
};

function CounterBar({ length, min, max }: { length: number; min: number; max: number }) {
  const color = length === 0 ? "bg-brand-border" : length < min || length > max ? "bg-brand-orange" : "bg-brand-primary";
  const pct = Math.min(100, (length / max) * 100);
  return (
    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-brand-border/50">
      <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function SeoPanel({
  seo,
  onChange,
  title,
  excerpt,
  bodyText,
  wordCount,
  hasAltText,
  hasLinks,
  slug,
  basePath = "blog",
}: {
  seo: SeoState;
  onChange: (seo: SeoState) => void;
  title: string;
  excerpt: string;
  bodyText: string;
  wordCount: number;
  hasAltText: boolean;
  hasLinks: boolean;
  slug: string;
  basePath?: string;
}) {
  const [open, setOpen] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);

  const effectiveTitle = seo.seoTitle || title;
  const effectiveDescription = seo.seoDescription || excerpt;
  const keyword = seo.focusKeyword.trim().toLowerCase();
  const firstParagraph = bodyText.slice(0, 300).toLowerCase();

  const checks = [
    { label: "Focus keyword is set", pass: keyword.length > 0 },
    { label: "Keyword appears in the title", pass: !!keyword && effectiveTitle.toLowerCase().includes(keyword) },
    { label: "Keyword appears in the URL slug", pass: !!keyword && slug.toLowerCase().includes(keyword.replace(/\s+/g, "-")) },
    { label: "Keyword appears in the first paragraph", pass: !!keyword && firstParagraph.includes(keyword) },
    { label: "Keyword appears in the meta description", pass: !!keyword && effectiveDescription.toLowerCase().includes(keyword) },
    { label: "Meta title is 30–60 characters", pass: effectiveTitle.length >= 30 && effectiveTitle.length <= 60 },
    { label: "Meta description is 120–160 characters", pass: effectiveDescription.length >= 120 && effectiveDescription.length <= 160 },
    { label: "Content is at least 300 words", pass: wordCount >= 300 },
    { label: "At least one link in the content", pass: hasLinks },
    { label: "At least one image has alt text", pass: hasAltText },
  ];
  const passCount = checks.filter((c) => c.pass).length;

  return (
    <div className="rounded-[18px] border border-brand-border/60 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-brand-heading">
          <Search className="size-4 text-brand-primary-dark" />
          SEO
          <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary-dark">
            {passCount}/{checks.length}
          </span>
        </span>
        <ChevronDown className={`size-4 text-brand-light transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-brand-border/60 p-5">
          {/* Google SERP preview */}
          <div className="rounded-[12px] border border-brand-border/60 bg-brand-gray/40 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-brand-light">Search Preview</p>
            <p className="truncate text-[13px] text-[#1a0dab]">
              themealprepideas.com › {basePath} › {slug || "…"}
            </p>
            <p className="mt-0.5 truncate text-[18px] leading-snug text-[#1a0dab]">{effectiveTitle || "Your post title"}</p>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#4d5156]">
              {effectiveDescription || "Add a meta description to control how this looks in search results."}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Focus Keyword</label>
            <input
              type="text"
              value={seo.focusKeyword}
              onChange={(e) => onChange({ ...seo, focusKeyword: e.target.value })}
              placeholder="e.g. meal prep containers"
              className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Meta Title</label>
            <input
              type="text"
              value={seo.seoTitle}
              onChange={(e) => onChange({ ...seo, seoTitle: e.target.value })}
              placeholder={title || "Defaults to post title"}
              className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
            <CounterBar length={effectiveTitle.length} min={30} max={60} />
            <p className="mt-1 text-[11px] text-brand-light">{effectiveTitle.length} / 60 characters</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Meta Description</label>
            <textarea
              value={seo.seoDescription}
              onChange={(e) => onChange({ ...seo, seoDescription: e.target.value })}
              placeholder={excerpt || "Defaults to post excerpt"}
              rows={3}
              className="w-full resize-none rounded-[10px] border border-brand-border bg-white px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
            />
            <CounterBar length={effectiveDescription.length} min={120} max={160} />
            <p className="mt-1 text-[11px] text-brand-light">{effectiveDescription.length} / 160 characters</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Social Share Image (OG Image)</label>
            {seo.ogImage ? (
              <div className="relative h-32 w-full overflow-hidden rounded-[10px]">
                <Image src={seo.ogImage} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => onChange({ ...seo, ogImage: "" })}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-brand-heading"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex h-20 w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-brand-border text-brand-light transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
              >
                <ImagePlus className="size-4" />
                <span className="text-xs font-medium">Choose from Media Library</span>
              </button>
            )}
            <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(item: MediaItem) => onChange({ ...seo, ogImage: item.url })} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-brand-heading">Canonical URL</label>
            <input
              type="text"
              value={seo.canonicalUrl}
              onChange={(e) => onChange({ ...seo, canonicalUrl: e.target.value })}
              placeholder={`https://themealprepideas.com/blog/${slug || "…"}`}
              className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2 border-t border-brand-border/60 pt-4">
            <p className="text-xs font-semibold text-brand-heading">Robots Meta</p>
            <label className="flex items-center gap-2 text-sm text-brand-body">
              <input type="checkbox" checked={seo.noindex} onChange={(e) => onChange({ ...seo, noindex: e.target.checked })} className="size-4 accent-brand-primary" />
              No-index (hide from search engines)
            </label>
            <label className="flex items-center gap-2 text-sm text-brand-body">
              <input type="checkbox" checked={seo.nofollow} onChange={(e) => onChange({ ...seo, nofollow: e.target.checked })} className="size-4 accent-brand-primary" />
              No-follow (don&apos;t pass link equity)
            </label>
          </div>

          <div className="space-y-1.5 border-t border-brand-border/60 pt-4">
            <p className="mb-1 text-xs font-semibold text-brand-heading">Content Analysis</p>
            {checks.map((check) => (
              <div key={check.label} className="flex items-center gap-2 text-[13px]">
                {check.pass ? (
                  <CheckCircle2 className="size-4 shrink-0 text-brand-primary" />
                ) : (
                  <Circle className="size-4 shrink-0 text-brand-border" />
                )}
                <span className={check.pass ? "text-brand-body" : "text-brand-light"}>{check.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
