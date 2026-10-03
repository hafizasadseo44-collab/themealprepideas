import type { ContentBlock } from "@/lib/posts/types";
import { markdownToTextRuns, type TiptapNode } from "@/lib/tiptap/inline-text";

function paragraph(text: string): TiptapNode {
  return { type: "paragraph", content: text ? markdownToTextRuns(text) : [] };
}

/** The reverse of tiptapJsonToBlocks() — used by the one-time seed script to
 * import the existing hardcoded blog.ts posts into the database as real
 * Tiptap documents. */
export function blocksToTiptapJson(blocks: ContentBlock[]): TiptapNode {
  const content: TiptapNode[] = blocks.map((block): TiptapNode => {
    switch (block.type) {
      case "p":
        return paragraph(block.text);
      case "h2":
        return { type: "heading", attrs: { level: 2 }, content: markdownToTextRuns(block.text) };
      case "h3":
        return { type: "heading", attrs: { level: 3 }, content: markdownToTextRuns(block.text) };
      case "h4":
        return { type: "heading", attrs: { level: 4 }, content: markdownToTextRuns(block.text) };
      case "h5":
        return { type: "heading", attrs: { level: 5 }, content: markdownToTextRuns(block.text) };
      case "h6":
        return { type: "heading", attrs: { level: 6 }, content: markdownToTextRuns(block.text) };
      case "ul":
        return {
          type: "bulletList",
          content: block.items.map((item) => ({ type: "listItem", content: [paragraph(item)] })),
        };
      case "ol":
        return {
          type: "orderedList",
          content: block.items.map((item) => ({ type: "listItem", content: [paragraph(item)] })),
        };
      case "quote":
        return {
          type: "blockquote",
          attrs: { attribution: block.attribution ?? null },
          content: [paragraph(block.text)],
        };
      case "callout":
        return {
          type: "calloutNode",
          attrs: { variant: block.variant, title: block.title ?? null, text: block.text },
        };
      case "table": {
        const headerRow: TiptapNode = {
          type: "tableRow",
          content: block.headers.map((h) => ({ type: "tableHeader", content: [paragraph(h)] })),
        };
        const bodyRows: TiptapNode[] = block.rows.map((row) => ({
          type: "tableRow",
          content: row.map((cell) => ({ type: "tableCell", content: [paragraph(cell)] })),
        }));
        return { type: "table", content: [headerRow, ...bodyRows] };
      }
      case "image":
        return {
          type: "image",
          attrs: { src: block.src, alt: block.alt, title: block.title ?? null, caption: block.caption ?? null },
        };
      default:
        return paragraph("");
    }
  });

  return { type: "doc", content };
}
