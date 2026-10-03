-- Contact form submissions (see /contact). Stored even though we also email
-- info@themealprepideas.com immediately, so nothing is lost if that email
-- ever fails to send or land — staff can always check /admin/messages.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'unread' check (status in ('unread', 'read')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on contact_messages (status);
create index if not exists contact_messages_created_at_idx on contact_messages (created_at desc);

alter table contact_messages enable row level security;

drop policy if exists contact_messages_public_insert on contact_messages;
create policy contact_messages_public_insert on contact_messages
  for insert with check (status = 'unread');

drop policy if exists contact_messages_staff_read on contact_messages;
create policy contact_messages_staff_read on contact_messages
  for select using (is_admin() or is_staff());

drop policy if exists contact_messages_staff_update on contact_messages;
create policy contact_messages_staff_update on contact_messages
  for update using (is_admin() or is_staff());

drop policy if exists contact_messages_staff_delete on contact_messages;
create policy contact_messages_staff_delete on contact_messages
  for delete using (is_admin() or is_staff());
