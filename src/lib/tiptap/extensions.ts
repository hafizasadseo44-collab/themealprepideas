import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BlockquoteWithAttribution } from "@/lib/tiptap/blockquote-attribution";
import { CalloutNode } from "@/lib/tiptap/callout-node";
import { ImageWithCaption } from "@/lib/tiptap/image-with-caption";

/** Extensions are scoped exactly to what ArticleContent.tsx (the public
 * renderer) knows how to display — don't add marks/nodes here without also
 * teaching the renderer (and the Tiptap<->ContentBlock mappers) about them. */
export const editorExtensions = [
  StarterKit.configure({
    blockquote: false,
    heading: { levels: [2, 3, 4, 5, 6] },
    link: { openOnClick: false, autolink: true },
  }),
  BlockquoteWithAttribution,
  ImageWithCaption,
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  CalloutNode,
  Placeholder.configure({ placeholder: "Start writing your article…" }),
];
