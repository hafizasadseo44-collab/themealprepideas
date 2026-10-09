import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BlockquoteWithAttribution } from "@/lib/tiptap/blockquote-attribution";
import { CalloutNode } from "@/lib/tiptap/callout-node";
import { ImageWithCaption } from "@/lib/tiptap/image-with-caption";

/**
 * Builds a FRESH set of editor extensions for a single editor instance.
 *
 * Tiptap/ProseMirror extensions are stateful — a node extension carries its
 * schema and (for ImageWithCaption) a React node view. Sharing one extension
 * array across more than one editor (or across a React Strict-Mode / client
 * re-mount) corrupts that state: ProseMirror throws "Adding different instances
 * of a keyed plugin", and — the bug this fixes — the image node's `src`/`alt`/
 * `caption` attributes fail to register on the second editor's schema, so
 * inserted images serialize as a bare `{ "type": "image" }` with no `src` and
 * vanish on save/reload. Always call this per editor (memoized on mount) rather
 * than importing a shared array.
 *
 * Scoped exactly to what ArticleContent.tsx (the public renderer) can display —
 * don't add marks/nodes without also teaching the renderer and the
 * Tiptap<->ContentBlock mappers about them.
 */
export function createEditorExtensions() {
  return [
    StarterKit.configure({
      blockquote: false,
      heading: { levels: [2, 3, 4, 5, 6] },
      link: { openOnClick: false, autolink: true },
    }),
    BlockquoteWithAttribution.configure(),
    ImageWithCaption.configure(),
    Table.configure({ resizable: false }),
    TableRow.configure(),
    TableHeader.configure(),
    TableCell.configure(),
    CalloutNode.configure(),
    Placeholder.configure({ placeholder: "Start writing your article…" }),
  ];
}
