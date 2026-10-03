"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Link2, X } from "lucide-react";

type RelType = "dofollow" | "nofollow" | "sponsored" | "ugc";

const relOptions: { value: RelType; label: string; hint: string }[] = [
  { value: "dofollow", label: "Normal (Do-follow)", hint: "Passes SEO link equity — the default." },
  { value: "nofollow", label: "No-follow", hint: "Tells search engines not to pass equity to this link." },
  { value: "sponsored", label: "Sponsored", hint: "For paid or affiliate links (Google's recommended tag)." },
  { value: "ugc", label: "UGC", hint: "For links inside user-generated content." },
];

function relToType(rel: string | undefined): RelType {
  if (!rel) return "dofollow";
  if (rel.includes("sponsored")) return "sponsored";
  if (rel.includes("ugc")) return "ugc";
  if (rel.includes("nofollow")) return "nofollow";
  return "dofollow";
}

export default function LinkPopover({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const existing = editor.getAttributes("link") as { href?: string; target?: string; rel?: string };
  const [url, setUrl] = useState(existing.href ?? "");
  const [newTab, setNewTab] = useState(existing.target === "_blank");
  const [relType, setRelType] = useState<RelType>(relToType(existing.rel));

  const apply = () => {
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      onClose();
      return;
    }
    const rel: string[] = [];
    if (relType !== "dofollow") rel.push(relType);
    if (newTab) rel.push("noopener", "noreferrer");

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim(), target: newTab ? "_blank" : null, rel: rel.length ? rel.join(" ") : null })
      .run();
    onClose();
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute left-0 top-full z-30 mt-2 w-80 rounded-[16px] border border-brand-border/60 bg-white p-4 shadow-[0_20px_44px_-16px_rgba(17,24,39,0.3)]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
            <Link2 className="size-4" />
            Link
          </p>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-4 text-brand-light" />
          </button>
        </div>

        <input
          autoFocus
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply();
          }}
          placeholder="https://example.com"
          className="mt-3 h-10 w-full rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none"
        />

        <label className="mt-3 flex items-center gap-2 text-sm text-brand-body">
          <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} className="size-4 accent-brand-primary" />
          Open in new tab
        </label>

        <div className="mt-3 space-y-1.5 border-t border-brand-border/60 pt-3">
          <p className="text-xs font-semibold text-brand-heading">Link Type</p>
          {relOptions.map((opt) => (
            <label key={opt.value} className="flex items-start gap-2 text-sm text-brand-body">
              <input
                type="radio"
                name="rel-type"
                checked={relType === opt.value}
                onChange={() => setRelType(opt.value)}
                className="mt-0.5 size-4 accent-brand-primary"
              />
              <span>
                {opt.label}
                <span className="block text-[11px] text-brand-light">{opt.hint}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={apply}
            className="flex-1 rounded-[10px] bg-brand-primary py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
          >
            Apply
          </button>
          {existing.href && (
            <button
              type="button"
              onClick={remove}
              className="rounded-[10px] border border-brand-border px-3 text-sm text-brand-error transition-colors hover:bg-brand-error/8"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </>
  );
}
