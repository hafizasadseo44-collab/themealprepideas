-- Public visitors (anonymous, no session) could not read `profiles` at all,
-- so every article's "Written by" byline fell back to "Unknown" for real
-- readers — author name/avatar/bio are meant to be public-facing (like any
-- blog byline), so allow anyone to read profiles. Writes stay restricted to
-- the row's own owner or an admin via the existing policies.

drop policy if exists profiles_public_read on profiles;
create policy profiles_public_read on profiles
  for select using (true);
