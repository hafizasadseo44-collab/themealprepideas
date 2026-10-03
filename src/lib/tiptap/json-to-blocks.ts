import type { ContentBlock } from "@/lib/posts/types";
import { textRunsToMarkdown, type TiptapNode } from "@/lib/tiptap/inline-text";

function paragraphText(node: TiptapNode): string {
  return textRunsToMarkdown(node.content);
}

function listItemsText(listNode: TiptapNode): string[] {
  return (listNode.content ?? []).map((item) => {
    const para = item.content?.find((n) => n.type === "paragraph");
    return para ? paragraphText(para) : "";
  });
}

function cellText(cell: TiptapNode): string {
  const para = cell.content?.find((n) => n.type === "paragraph");
  return para ? paragraphText(para) : "";
}

/** Converts a Tiptap ProseMirror document (as stored in posts.content) into the
 * ContentBlock[] shape ArticleContent.tsx already knows how to render. */
export function tiptapJsonToBlocks(doc: TiptapNode | null | undefined): ContentBlock[] {
  if (!doc?.content) return [];
  const blocks: ContentBlock[] = [];

  for (const node of doc.content) {
    switch (node.type) {
      case "paragraph": {
        const text = paragraphText(node);
        if (text.trim()) blocks.push({ type: "p", text });
        break;
      }
      case "heading": {
        const level = (node.attrs?.level as number) ?? 2;
        const type = level >= 6 ? "h6" : level === 5 ? "h5" : level === 4 ? "h4" : level === 3 ? "h3" : "h2";
        blocks.push({ type, text: paragraphText(node) });
        break;
      }
      case "bulletList":
        blocks.push({ type: "ul", items: listItemsText(node) });
        break;
      case "orderedList":
        blocks.push({ type: "ol", items: listItemsText(node) });
        break;
      case "blockquote": {
        const para = node.content?.find((n) => n.type === "paragraph");
        const attribution = node.attrs?.attribution as string | undefined;
        blocks.push({ type: "quote", text: para ? paragraphText(para) : "", attribution: attribution || undefined });
        break;
      }
      case "calloutNode": {
        const variant = ((node.attrs?.variant as string) ?? "tip") as "tip" | "warning" | "info";
        const title = node.attrs?.title as string | undefined;
        blocks.push({ type: "callout", variant, title: title || undefined, text: (node.attrs?.text as string) ?? "" });
        break;
      }
      case "table": {
        const rows = node.content ?? [];
        if (rows.length === 0) break;
        const [headerRow, ...bodyRows] = rows;
        blocks.push({
          type: "table",
          headers: (headerRow.content ?? []).map(cellText),
          rows: bodyRows.map((row) => (row.content ?? []).map(cellText)),
        });
        break;
      }
      case "image": {
        const src = (node.attrs?.src as string) ?? "";
        const alt = (node.attrs?.alt as string) ?? "";
        const title = node.attrs?.title as string | undefined;
        const caption = node.attrs?.caption as string | undefined;
        if (src) blocks.push({ type: "image", src, alt, title: title || undefined, caption: caption || undefined });
        break;
      }
      default:
        break;
    }
  }

  return blocks;
}
