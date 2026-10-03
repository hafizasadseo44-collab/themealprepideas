-- Editors (non-admins) should only be able to see/edit/delete their OWN
-- posts — admins keep full access to everyone's posts. Anyone on staff can
-- still create a new post (they simply become its author).

drop policy if exists posts_staff_read on posts;
create policy posts_staff_read on posts
  for select using (is_admin() or (is_staff() and author_id = auth.uid()));

drop policy if exists posts_staff_update on posts;
create policy posts_staff_update on posts
  for update using (is_admin() or (is_staff() and author_id = auth.uid()));

drop policy if exists posts_staff_delete on posts;
create policy posts_staff_delete on posts
  for delete using (is_admin() or (is_staff() and author_id = auth.uid()));

-- Let every signed-in staff member update their own profile fields
-- (full_name, avatar_url, bio). RLS is row-level only, so a trigger below
-- stops a non-admin from smuggling a role change through this same policy.
drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles
  for update using (id = auth.uid());

create or replace function prevent_role_self_escalation()
returns trigger as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists profiles_prevent_role_escalation on profiles;
create trigger profiles_prevent_role_escalation
  before update on profiles
  for each row execute function prevent_role_self_escalation();
