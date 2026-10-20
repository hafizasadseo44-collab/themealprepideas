"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Upload, Loader2, Trash2, Check, Pencil, ImageOff, Search, Copy, X,
  CheckCheck, ExternalLink, ZoomIn,
} from "lucide-react";
import { uploadImage, type MediaItem } from "@/lib/media/upload";
import { optimizeImageBeforeUpload } from "@/lib/media/client-compress";
import { updateMediaAlt, deleteMedia } from "@/lib/media/mutations";

// ─── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border/60 px-5 py-4">
          <p className="truncate text-sm font-semibold text-brand-heading">{item.altText || "No alt text"}</p>
          <button type="button" onClick={onClose} className="ml-3 shrink-0 text-brand-light hover:text-brand-heading">
            <X className="size-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative flex-1 overflow-hidden bg-[#f9f9f9]" style={{ minHeight: 300 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.altText ?? ""} className="h-auto max-h-[60vh] w-full object-contain" />
        </div>

        {/* Footer */}
        <div className="border-t border-brand-border/60 px-5 py-4">
          <p className="mb-3 break-all text-xs text-brand-light">{item.url}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copy}
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-brand-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
            >
              {copied ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy URL"}
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[10px] border border-brand-border px-4 py-2.5 text-sm font-medium text-brand-body transition-colors hover:bg-brand-gray"
            >
              <ExternalLink className="size-4" />
              Open
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Media Card ───────────────────────────────────────────────────────────────
function MediaCard({
  item,
  onDeleted,
  onPreview,
}: {
  item: MediaItem;
  onDeleted: (id: string) => void;
  onPreview: (item: MediaItem) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [alt, setAlt] = useState(item.altText ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const saveAlt = async () => {
    setSaving(true);
    await updateMediaAlt(item.id, alt);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this image? Posts using it will show a broken image.")) return;
    setDeleting(true);
    const result = await deleteMedia(item.id, item.storagePath);
    if (result.ok) onDeleted(item.id);
    else {
      alert(result.error);
      setDeleting(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(item.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const date = new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="group overflow-hidden rounded-[16px] border border-brand-border/60 bg-white transition-shadow hover:shadow-[0_8px_24px_-8px_rgba(17,24,39,0.18)]">
      {/* Thumbnail */}
      <div
        className="relative aspect-square w-full cursor-pointer overflow-hidden bg-brand-gray"
        onClick={() => onPreview(item)}
      >
        <Image src={item.url} alt={item.altText ?? ""} fill sizes="220px" className="object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
        {!item.altText && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-orange-deep px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            No alt
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
          <ZoomIn className="size-6 text-white drop-shadow" />
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Alt text */}
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveAlt()}
              placeholder="Describe this image…"
              className="h-8 min-w-0 flex-1 rounded-[8px] border border-brand-border px-2 text-xs focus:border-brand-primary focus:outline-none"
            />
            <button type="button" onClick={saveAlt} disabled={saving} className="text-brand-primary-dark">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-brand-light">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex w-full items-center gap-1.5 text-left text-xs text-brand-light hover:text-brand-heading"
            title="Edit alt text"
          >
            <Pencil className="size-3 shrink-0" />
            <span className="truncate">{item.altText || "Add alt text…"}</span>
          </button>
        )}

        <p className="mt-1.5 text-[11px] text-brand-light/70">{date}</p>

        {/* Actions */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={copyUrl}
            title="Copy URL"
            className={`flex flex-1 items-center justify-center gap-1 rounded-[8px] py-1.5 text-xs font-medium transition-colors ${
              copied
                ? "bg-brand-primary/10 text-brand-primary-dark"
                : "border border-brand-border text-brand-body hover:bg-brand-gray"
            }`}
          >
            {copied ? <CheckCheck className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied" : "Copy URL"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
            className="flex items-center justify-center rounded-[8px] border border-brand-border p-1.5 text-brand-error transition-colors hover:bg-brand-error/8 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Drop Zone ────────────────────────────────────────────────────────────────
function DropZone({ onUpload, uploading }: { onUpload: (file: File) => void; uploading: boolean }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith("image/")) onUpload(file);
    },
    [onUpload],
  );

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed transition-all ${
        dragging
          ? "border-brand-primary bg-brand-primary/5 text-brand-primary-dark"
          : "border-brand-border bg-white text-brand-light hover:border-brand-primary/50 hover:text-brand-primary-dark"
      }`}
    >
      {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
      <span className="text-sm font-medium">{uploading ? "Uploading…" : "Click or drag & drop to upload"}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onUpload(file);
        }}
      />
    </label>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────
export default function MediaGrid({ items: initialItems }: { items: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const optimized = await optimizeImageBeforeUpload(file);
      const formData = new FormData();
      formData.append("file", optimized);
      const result = await uploadImage(formData);
      if (result.ok) setItems((prev) => [result.item, ...prev]);
      else alert(result.error);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const filtered = search.trim()
    ? items.filter(
        (i) =>
          i.altText?.toLowerCase().includes(search.toLowerCase()) ||
          i.url.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  return (
    <>
      {preview && <PreviewModal item={preview} onClose={() => setPreview(null)} />}

      {/* Upload zone */}
      <DropZone onUpload={handleUpload} uploading={uploading} />

      {/* Stats + Search bar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-light">
          {filtered.length} {filtered.length === 1 ? "file" : "files"}
          {search && items.length !== filtered.length && ` of ${items.length}`}
        </p>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by alt text or URL…"
            className="h-9 w-full rounded-[10px] border border-brand-border bg-white pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-light hover:text-brand-heading"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[16px] border border-brand-border/60 bg-white py-16 text-brand-light">
            <ImageOff className="size-8" />
            <p className="text-sm">{search ? "No results for that search." : "No media uploaded yet."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onDeleted={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
                onPreview={setPreview}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
