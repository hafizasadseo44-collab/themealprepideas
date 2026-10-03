-- Real visitor ratings for the print recipe card — anyone can leave a
-- 1-5 star rating (no login required, same as most recipe sites). Each
-- vote is logged as its own row, and a trigger keeps recipes.rating /
-- recipes.rating_count as a live aggregate so the star display is always
-- a real computed average, never a hand-typed number.

create table if not exists recipe_ratings (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists recipe_ratings_recipe_id_idx on recipe_ratings (recipe_id);

alter table recipes add column if not exists rating_count int not null default 0;

alter table recipe_ratings enable row level security;

drop policy if exists recipe_ratings_public_read on recipe_ratings;
create policy recipe_ratings_public_read on recipe_ratings for select using (true);

drop policy if exists recipe_ratings_public_insert on recipe_ratings;
create policy recipe_ratings_public_insert on recipe_ratings for insert with check (true);

create or replace function recalc_recipe_rating() returns trigger as $$
begin
  update recipes set
    rating = (select round(avg(rating)::numeric, 1) from recipe_ratings where recipe_id = new.recipe_id),
    rating_count = (select count(*) from recipe_ratings where recipe_id = new.recipe_id)
  where id = new.recipe_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists recipe_ratings_recalc on recipe_ratings;
create trigger recipe_ratings_recalc
  after insert on recipe_ratings
  for each row execute function recalc_recipe_rating();
