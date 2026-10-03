-- Admin-editable "Browse Categories" mega-menu (groups + items) shown in the
-- site header. Seeded with the groups/links that used to be hard-coded in
-- Header.tsx, so nothing changes visually until an admin edits them from
-- /admin/menu.

create table if not exists header_menu_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  icon text not null default 'LayoutGrid',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists header_menu_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references header_menu_groups(id) on delete cascade,
  label text not null,
  href text not null,
  icon text not null default 'Tag',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (group_id, label)
);

create index if not exists header_menu_items_group_idx on header_menu_items (group_id);

alter table header_menu_groups enable row level security;
alter table header_menu_items enable row level security;

drop policy if exists header_menu_groups_public_read on header_menu_groups;
create policy header_menu_groups_public_read on header_menu_groups for select using (true);

drop policy if exists header_menu_groups_staff_write on header_menu_groups;
create policy header_menu_groups_staff_write on header_menu_groups for all using (is_admin() or is_staff());

drop policy if exists header_menu_items_public_read on header_menu_items;
create policy header_menu_items_public_read on header_menu_items for select using (true);

drop policy if exists header_menu_items_staff_write on header_menu_items;
create policy header_menu_items_staff_write on header_menu_items for all using (is_admin() or is_staff());

-- Seed the groups that used to be hard-coded in Header.tsx.
insert into header_menu_groups (title, icon, sort_order) values
  ('By Meal Type', 'Coffee', 0),
  ('By Diet', 'Leaf', 1),
  ('By Protein', 'Drumstick', 2)
on conflict (title) do nothing;

insert into header_menu_items (group_id, label, href, icon, sort_order)
select g.id, v.label, v.href, v.icon, v.sort_order
from (values
  ('By Meal Type', 'Breakfast', '/#breakfast', 'Coffee', 0),
  ('By Meal Type', 'Lunch', '/#lunch', 'Sandwich', 1),
  ('By Meal Type', 'Dinner', '/#dinner', 'Moon', 2),
  ('By Meal Type', 'Snacks', '/#snacks', 'Cookie', 3),
  ('By Diet', 'Vegan', '/vegan-meal-prep-ideas', 'Leaf', 0),
  ('By Diet', 'Keto', '/keto-meal-prep-ideas', 'Flame', 1),
  ('By Diet', 'Low Carb', '/categories#diets', 'Sprout', 2),
  ('By Diet', 'Mediterranean', '/categories#diets', 'Fish', 3),
  ('By Protein', 'Chicken', '/keto-meal-prep-ideas#keto-chicken', 'Drumstick', 0),
  ('By Protein', 'Beef', '/keto-meal-prep-ideas#keto-beef', 'Beef', 1),
  ('By Protein', 'Salmon', '/keto-meal-prep-ideas#keto-fish-seafood', 'Fish', 2),
  ('By Protein', 'Tofu', '/vegan-meal-prep-ideas#tofu-tempeh', 'Sprout', 3)
) as v(group_title, label, href, icon, sort_order)
join header_menu_groups g on g.title = v.group_title
on conflict (group_id, label) do nothing;
