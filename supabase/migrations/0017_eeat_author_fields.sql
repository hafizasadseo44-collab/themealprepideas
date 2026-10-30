-- E-E-A-T author profile fields
-- Adds expertise signals for Google's Experience, Expertise, Authoritativeness, Trustworthiness
-- framework to the profiles table.

alter table profiles
  add column if not exists job_title        text,          -- e.g. "Certified Nutritionist & Meal Prep Coach"
  add column if not exists credentials      text,          -- e.g. "RD, MS Nutrition, ACE Certified"
  add column if not exists years_experience integer,       -- e.g. 8
  add column if not exists expertise        text[],        -- e.g. ['High-Protein Cooking', 'Meal Prep Planning']
  add column if not exists website_url      text,
  add column if not exists twitter_url      text,
  add column if not exists instagram_url    text,
  add column if not exists facebook_url     text,
  add column if not exists pinterest_url    text,
  add column if not exists linkedin_url     text,
  add column if not exists youtube_url      text;

comment on column profiles.job_title        is 'Displayed under author name as professional title';
comment on column profiles.credentials      is 'Certifications / degrees shown as E-E-A-T trust signals';
comment on column profiles.years_experience is 'Years in field — shown on public author page';
comment on column profiles.expertise        is 'Array of topic tags author is expert in';
