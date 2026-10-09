"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  TableIcon,
  ImageIcon,
  Link2,
  Undo2,
  Redo2,
  Lightbulb,
  AlertTriangle,
  Info,
  ChevronDown,
} from "lucide-react";
import LinkPopover from "@/components/admin/posts/editor/LinkPopover";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaItem } from "@/lib/media/upload";

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex size-9 items-center justify-center rounded-[10px] transition-colors duration-150 disabled:opacity-30 ${
        active ? "bg-brand-primary/12 text-brand-primary-dark" : "text-brand-body hover:bg-brand-gray"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-brand-border/70" />;
}

const headingOptions = [
  { value: "p", label: "Paragraph" },
  { value: "2", label: "Heading 2" },
  { value: "3", label: "Heading 3" },
  { value: "4", label: "Heading 4" },
  { value: "5", label: "Heading 5" },
  { value: "6", label: "Heading 6" },
];

function HeadingSelect({ editor }: { editor: Editor }) {
  const levels = [2, 3, 4, 5, 6] as const;
  const active = levels.find((l) => editor.isActive("heading", { level: l }));
  const value = active ? String(active) : "p";

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: Number(v) as 2 | 3 | 4 | 5 | 6 }).run();
        }}
        className="h-9 appearance-none rounded-[10px] border border-brand-border/70 bg-white py-1 pl-3 pr-7 text-sm text-brand-body focus:border-brand-primary focus:outline-none"
      >
        {headingOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-brand-light" />
    </div>
  );
}

export default function Toolbar({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  const handleTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleImageSelect = (item: MediaItem) => {
    editor.chain().focus().setImage({ src: item.url, alt: item.altText ?? "" }).run();
  };

  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-[16px] border border-b-0 border-brand-border/60 bg-white p-2">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="size-4" />
      </ToolbarButton>

      <Divider />

      <HeadingSelect editor={editor} />

      <Divider />

      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="Insert table" onClick={handleTable}>
        <TableIcon className="size-4" />
      </ToolbarButton>

      <div className="relative">
        <ToolbarButton label="Insert link" active={editor.isActive("link")} onClick={() => setLinkOpen((v) => !v)}>
          <Link2 className="size-4" />
        </ToolbarButton>
        {linkOpen && <LinkPopover editor={editor} onClose={() => setLinkOpen(false)} />}
      </div>

      <ToolbarButton label="Insert image" onClick={() => setMediaOpen(true)}>
        <ImageIcon className="size-4" />
      </ToolbarButton>
      <MediaPicker open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={handleImageSelect} />

      <Divider />

      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-brand-light">Callout:</span>
      <ToolbarButton label="Tip callout" onClick={() => editor.chain().focus().insertCallout({ variant: "tip" }).run()}>
        <Lightbulb className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Warning callout" onClick={() => editor.chain().focus().insertCallout({ variant: "warning" }).run()}>
        <AlertTriangle className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Info callout" onClick={() => editor.chain().focus().insertCallout({ variant: "info" }).run()}>
        <Info className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 className="size-4" />
      </ToolbarButton>
    </div>
  );
}
