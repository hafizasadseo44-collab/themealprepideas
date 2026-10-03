-- Public site accounts (separate from CMS staff `profiles`) + saved recipes.
--
-- IMPORTANT: `handle_new_user()` (0001_init.sql) auto-created a `profiles` row
-- (default role 'editor') for EVERY new auth.users row. That's fine when the
-- only way to sign up is a staff invite, but it becomes a privilege-escalation
-- bug the moment public visitors can create their own accounts — anyone who
-- signs up would silently get CMS editor access. This migration re-points the
-- trigger: staff invites (which now pass `is_staff_invite: true` in the
-- invited user's metadata) still create a `profiles` row; every other signup
-- creates a `customers` row instead, which has zero CMS/RLS privileges.

create table if not exists customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table customers enable row level security;

drop policy if exists customers_self_all on customers;
create policy customers_self_all on customers
  for all using (id = auth.uid()) with check (id = auth.uid());

create or replace function handle_new_user()
returns trigger as $$
begin
  if coalesce(new.raw_user_meta_data->>'is_staff_invite', 'false') = 'true' then
    insert into public.profiles (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  else
    insert into public.customers (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name')
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- ============================================================
-- saved_recipes: a customer's bookmarked recipes
-- ============================================================
create table if not exists saved_recipes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  recipe_id uuid not null references recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, recipe_id)
);

create index if not exists saved_recipes_customer_idx on saved_recipes (customer_id);
create index if not exists saved_recipes_recipe_idx on saved_recipes (recipe_id);

alter table saved_recipes enable row level security;

drop policy if exists saved_recipes_owner_all on saved_recipes;
create policy saved_recipes_owner_all on saved_recipes
  for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());
