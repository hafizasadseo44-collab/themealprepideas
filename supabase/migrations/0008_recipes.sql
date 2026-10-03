-- Recipe CMS: pages -> sections -> recipes
--
-- "recipe_pages" is a small registry of the site pages that showcase
-- recipes (Home, Vegan, Keto today; more can be added later just by
-- inserting a row here — no schema change needed). "recipe_sections" are
-- the sub-groupings within a page (Breakfast, Lunch, Keto Chicken, Vegan
-- Bowls, ...). A recipe belongs to exactly one page but can appear in
-- multiple sections of that page (fixes the old duplicated-recipe problem
-- where the same recipe with diverging text lived in two places).

create table if not exists recipe_pages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  route text not null,            -- "/", "/vegan-meal-prep-ideas", "/keto-meal-prep-ideas"
  description text,
  cover_image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists recipe_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references recipe_pages(id) on delete cascade,
  slug text not null,
  heading text not null,
  intro jsonb not null default '[]'::jsonb,   -- string[] paragraphs
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (page_id, slug)
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  hero_image_url text,
  hero_image_alt text,

  page_id uuid references recipe_pages(id),
  section_ids uuid[] not null default '{}',

  prep_time_minutes int,
  cook_time_minutes int,
  total_time_minutes int,
  servings int,
  servings_label text,

  ingredients jsonb not null default '[]'::jsonb,   -- [{ "text": "2 cups rice" }]
  instructions jsonb not null default '[]'::jsonb,  -- [{ "text": "Preheat oven to 400°F." }]

  calories int,
  protein_grams numeric,
  carbs_grams numeric,
  fat_grams numeric,

  tag text,
  rating numeric,

  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references profiles(id),

  seo_title text,
  seo_description text,
  seo_og_image_url text,
  canonical_url text,
  focus_keyword text,
  seo_noindex boolean not null default false,
  seo_nofollow boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_section_ids_gin on recipes using gin (section_ids);
create index if not exists recipes_page_id_idx on recipes (page_id);

drop trigger if exists recipes_set_updated_at on recipes;
create trigger recipes_set_updated_at
  before update on recipes
  for each row execute function set_updated_at(); -- reused from 0001_init.sql

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table recipe_pages enable row level security;
alter table recipe_sections enable row level security;
alter table recipes enable row level security;

drop policy if exists recipe_pages_public_read on recipe_pages;
create policy recipe_pages_public_read on recipe_pages for select using (true);
drop policy if exists recipe_pages_admin_write on recipe_pages;
create policy recipe_pages_admin_write on recipe_pages for all using (is_admin());

drop policy if exists recipe_sections_public_read on recipe_sections;
create policy recipe_sections_public_read on recipe_sections for select using (true);
drop policy if exists recipe_sections_admin_write on recipe_sections;
create policy recipe_sections_admin_write on recipe_sections for all using (is_admin());

drop policy if exists recipes_public_read on recipes;
create policy recipes_public_read on recipes
  for select using (status = 'published');
drop policy if exists recipes_staff_read on recipes;
create policy recipes_staff_read on recipes
  for select using (is_admin() or (is_staff() and author_id = auth.uid()));
drop policy if exists recipes_staff_write on recipes;
create policy recipes_staff_write on recipes
  for insert with check (is_staff());
drop policy if exists recipes_staff_update on recipes;
create policy recipes_staff_update on recipes
  for update using (is_admin() or (is_staff() and author_id = auth.uid()));
drop policy if exists recipes_staff_delete on recipes;
create policy recipes_staff_delete on recipes
  for delete using (is_admin() or (is_staff() and author_id = auth.uid()));
