"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, Trash2, Check, Pencil, ImageOff } from "lucide-react";
import { uploadImage, type MediaItem } from "@/lib/media/upload";
import { updateMediaAlt, deleteMedia } from "@/lib/media/mutations";

function MediaCard({ item, onDeleted }: { item: MediaItem; onDeleted: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [alt, setAlt] = useState(item.altText ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <div className="overflow-hidden rounded-[16px] border border-brand-border/60 bg-white">
      <div className="relative aspect-square w-full bg-brand-gray">
        <Image src={item.url} alt={item.altText ?? ""} fill sizes="220px" className="object-cover" />
        {!item.altText && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-orange-deep px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            No alt text
          </span>
        )}
      </div>
      <div className="p-3">
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
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex w-full items-center gap-1.5 text-left text-xs text-brand-light hover:text-brand-heading"
          >
            <Pencil className="size-3 shrink-0" />
            <span className="truncate">{item.altText || "Add alt text…"}</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-error hover:underline disabled:opacity-50"
        >
          {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          Delete
        </button>
      </div>
    </div>
  );
}

export default function MediaGrid({ items: initialItems }: { items: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImage(formData);
    setUploading(false);
    if (result.ok) setItems((prev) => [result.item, ...prev]);
    else alert(result.error);
  };

  return (
    <div>
      <label className="mb-6 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-brand-border bg-white text-brand-light transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark">
        {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
        <span className="text-sm font-medium">{uploading ? "Uploading…" : "Upload new image"}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) handleUpload(file);
          }}
        />
      </label>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-[16px] border border-brand-border/60 bg-white py-16 text-brand-light">
          <ImageOff className="size-8" />
          <p className="text-sm">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} onDeleted={(id) => setItems((prev) => prev.filter((i) => i.id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
}
