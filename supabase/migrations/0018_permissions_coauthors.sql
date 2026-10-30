-- Granular editor permissions stored as jsonb on the profile.
-- Admins always have everything; this only applies to the "editor" role.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS permissions jsonb
  DEFAULT '{"can_posts":true,"can_recipes":true,"can_comments":true,"can_media":true,"can_publish":true}'::jsonb;

-- Co-authors for blog posts (primary author remains posts.author_id)
CREATE TABLE IF NOT EXISTS post_co_authors (
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, profile_id)
);

ALTER TABLE post_co_authors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS post_co_authors_staff_all ON post_co_authors;
DROP POLICY IF EXISTS post_co_authors_public_read ON post_co_authors;
CREATE POLICY post_co_authors_staff_all  ON post_co_authors FOR ALL  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY post_co_authors_public_read ON post_co_authors FOR SELECT USING (true);

-- Co-authors for recipes
CREATE TABLE IF NOT EXISTS recipe_co_authors (
  recipe_id  uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (recipe_id, profile_id)
);

ALTER TABLE recipe_co_authors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS recipe_co_authors_staff_all ON recipe_co_authors;
DROP POLICY IF EXISTS recipe_co_authors_public_read ON recipe_co_authors;
CREATE POLICY recipe_co_authors_staff_all  ON recipe_co_authors FOR ALL  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY recipe_co_authors_public_read ON recipe_co_authors FOR SELECT USING (true);
