-- TheMealPrepIdeas.com — Admin CMS schema (Phase 0)
-- Run this once in the Supabase Dashboard: Project -> SQL Editor -> New query -> paste -> Run.

-- ============================================================
-- profiles: 1:1 with auth.users, holds role + display info
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  bio text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user is created (default role: editor)
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- categories
-- ============================================================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- media: index over files stored in the "media" Storage bucket
-- ============================================================
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url text not null,
  alt_text text,
  width int,
  height int,
  size_bytes int,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- posts
-- ============================================================
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image_url text,
  category_id uuid references categories(id),
  author_id uuid references profiles(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  scheduled_for timestamptz,
  minutes int,
  tags text[] not null default '{}',
  trending boolean not null default false,
  featured boolean not null default false,
  content jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  canonical_url text,
  focus_keyword text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only one post can be featured at a time
create unique index if not exists one_featured_post on posts (featured) where featured = true;

-- Keep updated_at current on every write
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table media enable row level security;
alter table posts enable row level security;

-- profiles: everyone can read their own row; admins can read/manage everyone's
create policy profiles_self_read on profiles
  for select using (id = auth.uid());
create policy profiles_admin_all on profiles
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- categories: public read, admin write
create policy categories_public_read on categories
  for select using (true);
create policy categories_admin_write on categories
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- media: staff (admin+editor) manage; not publicly listable via the table (files are public via Storage URL)
create policy media_staff_all on media
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'editor'))
  );

-- posts: public can read published posts; staff can read/write everything
create policy posts_public_read on posts
  for select using (status = 'published' and published_at <= now());
create policy posts_staff_read on posts
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'editor'))
  );
create policy posts_staff_write on posts
  for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'editor'))
  );
create policy posts_staff_update on posts
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'editor'))
  );
create policy posts_staff_delete on posts
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'editor'))
  );

-- ============================================================
-- Seed a couple of starter categories matching the existing blog
-- ============================================================
insert into categories (name, slug) values
  ('Getting Started', 'getting-started'),
  ('Meal Prep Tips', 'meal-prep-tips'),
  ('Storage & Food Safety', 'storage-food-safety'),
  ('Nutrition', 'nutrition'),
  ('Gear & Containers', 'gear-containers'),
  ('Meal Planning', 'meal-planning')
on conflict (name) do nothing;
