-- Adds a dedicated alt-text field for the featured/cover image, matching
-- the inline image alt/title/caption fields already supported in the
-- article body (stored in the Tiptap JSON content column).

alter table posts add column if not exists cover_image_alt text;
