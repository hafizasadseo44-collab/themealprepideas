"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2, ImageOff } from "lucide-react";
import { uploadImage, listMedia, type MediaItem } from "@/lib/media/upload";

export default function MediaPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    listMedia().then((data) => {
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImage(formData);
    setUploading(false);

    if (!result.ok) return setError(result.error);
    setItems((prev) => [result.item, ...prev]);
    onSelect(result.item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-brand-border/60 p-5">
          <p className="font-display text-lg text-brand-heading">Media Library</p>
          <button type="button" onClick={onClose} aria-label="Close" className="text-brand-light hover:text-brand-heading">
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-brand-border/60 p-5">
          <label className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-dashed border-brand-border text-brand-light transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark">
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            <span className="text-sm font-medium">{uploading ? "Uploading…" : "Upload a new image"}</span>
            <input
              ref={fileInputRef}
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
          {error && <p className="mt-2 text-sm text-brand-error">{error}</p>}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center py-10 text-brand-light">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-brand-light">
              <ImageOff className="size-6" />
              <p className="text-sm">No media yet — upload your first image above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group relative aspect-square overflow-hidden rounded-[12px] border border-brand-border/60 transition-colors hover:border-brand-primary"
                >
                  <Image src={item.url} alt={item.altText ?? ""} fill sizes="150px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
