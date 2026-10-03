import { stripMarkdown } from "@/lib/posts/types";
import type { ContentBlock } from "@/lib/recipes/types";

const HEADING_TYPES = new Set(["h2", "h3", "h4", "h5", "h6"]);

const SECTION_PATTERNS: { key: string; re: RegExp }[] = [
  { key: "ingredients", re: /ingredient/i },
  { key: "instructions", re: /how to (prepare|make)|instructions|directions/i },
  { key: "notes", re: /notes|variation|storage|tip/i },
  { key: "nutrition", re: /nutrition/i },
  { key: "time", re: /^time$/i },
  { key: "dietary", re: /dietary/i },
  { key: "faq", re: /faq|frequently asked/i },
];

/**
 * Classifies a heading as one of the recipe's known top-level sections.
 * Recipes are written as one flowing document, and heading *level* (H2 vs
 * H3) isn't a reliable signal of section vs. sub-item — so section
 * boundaries are matched by what the heading actually says instead. Used
 * both to extract structured data below and to drive the section-pill nav.
 */
export function classifySection(text: string): string | null {
  for (const { key, re } of SECTION_PATTERNS) {
    if (re.test(text.trim())) return key;
  }
  return null;
}

export type RecipeFact = { label: string; value: string };

/** Splits a "Prep Time: 15 minutes" style bullet into a label/value pair. Falls back to the whole line as the label when there's no colon. */
function toFact(line: string): RecipeFact {
  const clean = stripMarkdown(line);
  const colon = clean.indexOf(":");
  return colon > 0 ? { label: clean.slice(0, colon).trim(), value: clean.slice(colon + 1).trim() } : { label: clean.trim(), value: "" };
}

/**
 * Recipes are written as one flowing rich-text document (like a blog post),
 * so there's no dedicated "ingredients" or "instructions" field to read for
 * schema.org rich snippets or the print recipe card. Instead, walk the
 * headings: a heading that names a known section (Ingredients, How to
 * Prepare X, Notes, Nutrition, Time, Dietary, ...) opens that section, and
 * anything under it — a following list, sub-headings, paragraphs — is read
 * as that section's content until the next recognized section heading.
 */
export function extractRecipeStructuredData(content: ContentBlock[]): {
  ingredients: string[];
  instructions: string[];
  dietary: string[];
  notes: string[];
  time: RecipeFact[];
  nutrition: RecipeFact[];
} {
  let ingredients: string[] = [];
  let instructions: string[] = [];
  const dietary: string[] = [];
  let notes: string[] = [];
  let time: RecipeFact[] = [];
  let nutrition: RecipeFact[] = [];

  let currentSection: string | null = null;

  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    const isHeading = HEADING_TYPES.has(block.type) && "text" in block;

    if (isHeading) {
      const text = (block as Extract<ContentBlock, { type: "h2" }>).text;
      const section = classifySection(text);

      if (section) {
        currentSection = section;
        const next = content[i + 1];
        if (next && (next.type === "ul" || next.type === "ol")) {
          if (section === "ingredients" && ingredients.length === 0) ingredients = next.items.map(stripMarkdown);
          else if (section === "instructions" && instructions.length === 0) instructions = next.items.map(stripMarkdown);
          else if (section === "notes" && notes.length === 0) notes = next.items.map(stripMarkdown);
          else if (section === "time" && time.length === 0) time = next.items.map(toFact);
          else if (section === "nutrition" && nutrition.length === 0) nutrition = next.items.map(toFact);
          else if (section === "dietary" && dietary.length === 0) {
            // Dietary is sometimes one list ("High-Protein: use turkey...")
            // rather than a sub-heading per item — take the label before the
            // first colon, or the whole line if there isn't one.
            for (const item of next.items) {
              const clean = stripMarkdown(item);
              const colon = clean.indexOf(":");
              dietary.push(colon > 0 ? clean.slice(0, colon).trim() : clean.trim());
            }
          }
        }
        continue;
      }

      if (currentSection === "dietary") {
        dietary.push(stripMarkdown(text));
      }
      continue;
    }

    // Paragraph-style Notes (legacy content, or extra context after a Notes
    // list) — appended in document order alongside any list items above.
    if (currentSection === "notes" && block.type === "p") {
      notes.push(stripMarkdown(block.text));
    }
  }

  return { ingredients, instructions, dietary, notes, time, nutrition };
}
