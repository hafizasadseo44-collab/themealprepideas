export type TiptapMark = { type: string; attrs?: Record<string, unknown> };
export type TiptapNode = {
  type: string;
  text?: string;
  marks?: TiptapMark[];
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
};

/**
 * Converts a run of Tiptap text nodes (with bold/italic marks) into the
 * lightweight **bold** / *italic* / ***both*** markdown already understood
 * by ArticleContent.tsx's renderInline(). Keeps the public renderer untouched.
 */
export function textRunsToMarkdown(nodes: TiptapNode[] | undefined): string {
  if (!nodes) return "";
  return nodes
    .map((node) => {
      if (node.type !== "text") return "";
      const text = node.text ?? "";
      const hasBold = node.marks?.some((m) => m.type === "bold");
      const hasItalic = node.marks?.some((m) => m.type === "italic");
      if (hasBold && hasItalic) return `***${text}***`;
      if (hasBold) return `**${text}**`;
      if (hasItalic) return `*${text}*`;
      return text;
    })
    .join("");
}

/** The reverse of textRunsToMarkdown() — used when seeding/importing content into Tiptap JSON. */
export function markdownToTextRuns(text: string): TiptapNode[] {
  const parts = text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part) => {
    if (part.startsWith("***") && part.endsWith("***")) {
      return { type: "text", text: part.slice(3, -3), marks: [{ type: "bold" }, { type: "italic" }] };
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return { type: "text", text: part.slice(2, -2), marks: [{ type: "bold" }] };
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return { type: "text", text: part.slice(1, -1), marks: [{ type: "italic" }] };
    }
    return { type: "text", text: part };
  });
}

/** 
 * Recursively sanitizes Tiptap JSON to remove any broken/temporary image nodes 
 * (like blob: or data: URLs) that shouldn't be loaded into the editor or saved to DB.
 */
export function sanitizeTiptapJson(node: TiptapNode): TiptapNode {
  if (!node.content) return node;
  
  const cleanedContent = node.content
    .filter((child) => {
      if (child.type === "image") {
        const src = child.attrs?.src as string | undefined;
        if (!src || src.startsWith("blob:") || src.startsWith("data:")) {
          return false;
        }
      }
      return true;
    })
    .map(sanitizeTiptapJson);

  return { ...node, content: cleanedContent };
}
