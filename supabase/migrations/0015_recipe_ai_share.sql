-- Per-recipe toggle for the "Summarize with AI" section (see
-- src/components/recipes/AiShareSection.tsx). Defaults to true so it shows
-- automatically on every recipe; editors can turn it off per recipe from
-- the admin editor's "AI Discovery" panel.

alter table recipes
  add column if not exists show_ai_share boolean not null default true;
