-- Per-customer email notification preferences, used when a new recipe,
-- blog post, or category is published (see src/lib/email/notify.ts).
-- Defaulting both to true means existing customers are opted in; each has
-- its own toggle in /account so they can turn either off independently.

alter table customers
  add column if not exists notify_new_recipes boolean not null default true,
  add column if not exists notify_new_posts boolean not null default true;
