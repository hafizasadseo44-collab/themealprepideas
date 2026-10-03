"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { AlertTriangle } from "lucide-react";

export default function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) ?? "";
  const title = (node.attrs.title as string) ?? "";
  const caption = (node.attrs.caption as string) ?? "";

  return (
    <NodeViewWrapper className={`my-3 ${selected ? "rounded-[14px] ring-2 ring-brand-primary/50" : ""}`}>
      <figure className="m-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} title={title || undefined} className="max-w-full rounded-[14px]" />
        {!alt && (
          <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-orange-deep">
            <AlertTriangle className="size-3.5" />
            Missing alt text — click the image and add one in the sidebar for SEO.
          </span>
        )}
        <input
          type="text"
          value={caption}
          onChange={(e) => updateAttributes({ caption: e.target.value })}
          placeholder="Add a caption…"
          contentEditable={false}
          className="mt-2 w-full bg-transparent text-center text-sm italic text-brand-light placeholder:text-brand-light/60 focus:outline-none"
        />
      </figure>
    </NodeViewWrapper>
  );
}
