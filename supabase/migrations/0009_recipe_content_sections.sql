-- Recipes are written as one flowing rich-text article, exactly like blog
-- posts — Ingredients, Instructions, Storage Tips, Notes & Variations,
-- Nutrition Information, Dietary, and FAQs are just headings/lists/
-- paragraphs the author types into one Tiptap editor, not separate rigid
-- option boxes. Replace the earlier structured-field attempt with a single
-- `content` column (same jsonb Tiptap-doc shape as posts.content).

alter table recipes
  add column if not exists content jsonb not null default '{"type":"doc","content":[]}'::jsonb;

alter table recipes
  drop column if exists ingredients,
  drop column if exists instructions,
  drop column if exists storage_tips,
  drop column if exists notes_variations,
  drop column if exists nutrition_note,
  drop column if exists dietary_notes,
  drop column if exists faqs;
