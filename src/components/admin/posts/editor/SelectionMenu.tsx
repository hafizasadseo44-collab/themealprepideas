"use client";

import { useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import { Bold, Italic, Link2, Heading2, Heading3 } from "lucide-react";
import LinkPopover from "@/components/admin/posts/editor/LinkPopover";

function MiniButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex size-8 items-center justify-center rounded-[8px] transition-colors ${
        active ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function SelectionMenu({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false);

  return (
    <BubbleMenu editor={editor} options={{ placement: "top" }}>
      <div className="relative flex items-center gap-0.5 rounded-[12px] bg-brand-heading px-1.5 py-1.5 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.4)]">
        <MiniButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-4" />
        </MiniButton>
        <MiniButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-4" />
        </MiniButton>
        <MiniButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" />
        </MiniButton>
        <MiniButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="size-4" />
        </MiniButton>
        <MiniButton label="Link" active={editor.isActive("link")} onClick={() => setLinkOpen((v) => !v)}>
          <Link2 className="size-4" />
        </MiniButton>

        {linkOpen && (
          <div className="absolute left-0 top-full mt-2 text-left">
            <LinkPopover editor={editor} onClose={() => setLinkOpen(false)} />
          </div>
        )}
      </div>
    </BubbleMenu>
  );
}
