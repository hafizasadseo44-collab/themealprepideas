-- Adds robots meta (noindex/nofollow) controls to posts, matching the
-- Rank Math-style SEO panel in the admin editor.

alter table posts add column if not exists seo_noindex boolean not null default false;
alter table posts add column if not exists seo_nofollow boolean not null default false;
