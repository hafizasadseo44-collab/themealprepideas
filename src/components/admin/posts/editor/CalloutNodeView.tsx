"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Lightbulb, AlertTriangle, Info, Trash2 } from "lucide-react";

const variants = {
  tip: {
    icon: Lightbulb,
    label: "Tip",
    bg: "bg-brand-primary/8",
    border: "border-brand-primary/25",
    text: "text-brand-primary-dark",
    iconBg: "bg-brand-primary/15",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    bg: "bg-brand-orange/8",
    border: "border-brand-orange/25",
    text: "text-brand-orange-deep",
    iconBg: "bg-brand-orange/15",
  },
  info: {
    icon: Info,
    label: "Info",
    bg: "bg-brand-info/8",
    border: "border-brand-info/25",
    text: "text-brand-info",
    iconBg: "bg-brand-info/15",
  },
} as const;

type Variant = keyof typeof variants;

export default function CalloutNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const variant = (node.attrs.variant ?? "tip") as Variant;
  const style = variants[variant];
  const Icon = style.icon;

  return (
    <NodeViewWrapper
      className={`my-2 rounded-[18px] border p-4 transition-shadow ${style.border} ${style.bg} ${
        selected ? "ring-2 ring-brand-primary/40" : ""
      }`}
      data-drag-handle
    >
      <div className="flex items-start gap-3">
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.text}`}>
          <Icon className="size-4" />
        </span>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.keys(variants) as Variant[]).map((key) => (
              <button
                key={key}
                type="button"
                contentEditable={false}
                onClick={() => updateAttributes({ variant: key })}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  variant === key ? `${variants[key].iconBg} ${variants[key].text}` : "bg-white text-brand-light"
                }`}
              >
                {variants[key].label}
              </button>
            ))}
            <button
              type="button"
              contentEditable={false}
              onClick={() => deleteNode()}
              className="ml-auto flex size-7 items-center justify-center rounded-full text-brand-light transition-colors hover:bg-white hover:text-brand-error"
              aria-label="Remove callout"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={(node.attrs.title as string) ?? ""}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            placeholder="Optional title…"
            className={`w-full bg-transparent text-sm font-semibold ${style.text} placeholder:text-brand-light/70 focus:outline-none`}
          />
          <textarea
            value={(node.attrs.text as string) ?? ""}
            onChange={(e) => updateAttributes({ text: e.target.value })}
            placeholder="Callout text…"
            rows={2}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-brand-body placeholder:text-brand-light focus:outline-none"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
