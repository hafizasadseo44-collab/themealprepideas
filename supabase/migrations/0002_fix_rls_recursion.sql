-- Fix: policies that check "is the current user an admin/staff" by querying
-- `profiles` from WITHIN a policy defined ON `profiles` can trigger
-- "infinite recursion detected in policy for relation profiles" in Postgres.
-- The fix is the standard Supabase pattern: move the role check into a
-- SECURITY DEFINER function, which bypasses RLS for that one internal lookup.
--
-- Run this once in the Supabase SQL Editor, same as 0001_init.sql.

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- profiles
drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles
  for all using (is_admin());

-- categories
drop policy if exists categories_admin_write on categories;
create policy categories_admin_write on categories
  for all using (is_admin());

-- media
drop policy if exists media_staff_all on media;
create policy media_staff_all on media
  for all using (is_staff());

-- posts
drop policy if exists posts_staff_read on posts;
create policy posts_staff_read on posts
  for select using (is_staff());

drop policy if exists posts_staff_write on posts;
create policy posts_staff_write on posts
  for insert with check (is_staff());

drop policy if exists posts_staff_update on posts;
create policy posts_staff_update on posts
  for update using (is_staff());

drop policy if exists posts_staff_delete on posts;
create policy posts_staff_delete on posts
  for delete using (is_staff());
