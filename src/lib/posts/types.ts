export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "h5"; text: string }
  | { type: "h6"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; variant: "tip" | "warning" | "info"; title?: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; title?: string; caption?: string };

const HEADING_TYPES = ["h2", "h3", "h4", "h5", "h6"] as const;
type HeadingBlockType = (typeof HEADING_TYPES)[number];

const headingLevelOf: Record<HeadingBlockType, HeadingLevel> = { h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };

export type PostStatus = "draft" | "published" | "scheduled";

export type SeoInfo = {
  title: string | null;
  description: string | null;
  ogImage: string | null;
  canonical: string | null;
  focusKeyword: string | null;
  noindex: boolean;
  nofollow: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  categoryId: string | null;
  readTime: string;
  minutes: number;
  date: string;
  author: { name: string; avatar: string; bio?: string };
  tags: string[];
  trending?: boolean;
  featured?: boolean;
  content: ContentBlock[];
  /** Raw Tiptap document as stored in the DB — used by the admin editor for
   * lossless re-editing (the ContentBlock[] above is a simplified render-only
   * projection and can't round-trip things like link hrefs). */
  contentJson: unknown;
  status: PostStatus;
  seo: SeoInfo;
};

export type Category = { id: string; name: string; slug: string; postCount?: number };

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export type Heading = { id: string; text: string; level: HeadingLevel };

function isHeadingBlock(b: ContentBlock): b is Extract<ContentBlock, { type: HeadingBlockType }> {
  return (HEADING_TYPES as readonly string[]).includes(b.type);
}

/** Strips inline bold/italic markdown syntax for contexts (TOC labels,
 * extracted structured data) that show plain text rather than rendering it. */
export function stripMarkdown(text: string): string {
  return text.replace(/\*\*\*([^*]+)\*\*\*/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

export function getHeadings(content: ContentBlock[]): Heading[] {
  return content
    .filter(isHeadingBlock)
    .map((b) => ({ id: slugifyHeading(b.text), text: stripMarkdown(b.text), level: headingLevelOf[b.type] }));
}

export function formatReadTime(minutes: number | null | undefined) {
  const m = minutes && minutes > 0 ? minutes : 3;
  return `${m} min read`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
