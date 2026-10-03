-- Real comments + reviews for recipes. Every comment carries a star rating,
-- so "reviews" and "comments" are the same thing here (like most recipe
-- sites) — one moderated system instead of two disconnected rating paths.
--
-- Security model:
--   - Anyone can submit a comment, but it always lands as 'pending' — the
--     insert policy's WITH CHECK enforces this even if a client tries to
--     send a different status directly.
--   - The public can only ever SELECT 'approved' comments.
--   - Staff can moderate comments on recipes they own; admins moderate all
--     (same ownership pattern already used for posts/recipes).
--   - The recipe's aggregate rating/count is recalculated from APPROVED
--     comments only, via trigger — never hand-edited.

create table if not exists recipe_comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references profiles(id)
);

create index if not exists recipe_comments_recipe_id_idx on recipe_comments (recipe_id);
create index if not exists recipe_comments_status_idx on recipe_comments (status);

alter table recipe_comments enable row level security;

drop policy if exists recipe_comments_public_read on recipe_comments;
create policy recipe_comments_public_read on recipe_comments
  for select using (status = 'approved');

drop policy if exists recipe_comments_public_insert on recipe_comments;
create policy recipe_comments_public_insert on recipe_comments
  for insert with check (status = 'pending');

drop policy if exists recipe_comments_staff_read on recipe_comments;
create policy recipe_comments_staff_read on recipe_comments
  for select using (
    is_admin() or (is_staff() and exists (
      select 1 from recipes r where r.id = recipe_comments.recipe_id and r.author_id = auth.uid()
    ))
  );

drop policy if exists recipe_comments_staff_update on recipe_comments;
create policy recipe_comments_staff_update on recipe_comments
  for update using (
    is_admin() or (is_staff() and exists (
      select 1 from recipes r where r.id = recipe_comments.recipe_id and r.author_id = auth.uid()
    ))
  );

drop policy if exists recipe_comments_staff_delete on recipe_comments;
create policy recipe_comments_staff_delete on recipe_comments
  for delete using (
    is_admin() or (is_staff() and exists (
      select 1 from recipes r where r.id = recipe_comments.recipe_id and r.author_id = auth.uid()
    ))
  );

create or replace function recalc_recipe_rating_from_comments() returns trigger as $$
declare
  target_id uuid := coalesce(new.recipe_id, old.recipe_id);
begin
  update recipes set
    rating = (select round(avg(rating)::numeric, 1) from recipe_comments where recipe_id = target_id and status = 'approved'),
    rating_count = (select count(*) from recipe_comments where recipe_id = target_id and status = 'approved')
  where id = target_id;
  return coalesce(new, old);
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists recipe_comments_recalc on recipe_comments;
create trigger recipe_comments_recalc
  after insert or update or delete on recipe_comments
  for each row execute function recalc_recipe_rating_from_comments();
