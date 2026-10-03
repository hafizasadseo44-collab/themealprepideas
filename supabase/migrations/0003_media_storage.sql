-- Creates the "media" Storage bucket used by the post editor's image upload
-- and (later) the Media Library page. Run after 0001 and 0002.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_bucket_public_read on storage.objects;
create policy media_bucket_public_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_bucket_staff_insert on storage.objects;
create policy media_bucket_staff_insert on storage.objects
  for insert with check (bucket_id = 'media' and is_staff());

drop policy if exists media_bucket_staff_delete on storage.objects;
create policy media_bucket_staff_delete on storage.objects
  for delete using (bucket_id = 'media' and is_staff());
