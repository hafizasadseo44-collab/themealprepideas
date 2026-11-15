-- Migration 0019: Nested comment replies, admin reply badges, and optional ratings for replies.

-- 1. Add parent_id for threaded/nested replies
ALTER TABLE recipe_comments
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES recipe_comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS recipe_comments_parent_id_idx ON recipe_comments(parent_id);

-- 2. Add admin/staff attribution columns
ALTER TABLE recipe_comments
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

ALTER TABLE recipe_comments
  ADD COLUMN IF NOT EXISTS author_role text NOT NULL DEFAULT 'user';

ALTER TABLE recipe_comments
  ADD COLUMN IF NOT EXISTS author_email text;

ALTER TABLE recipe_comments
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Make rating nullable (replies do not require a star rating; only top-level reviews do)
ALTER TABLE recipe_comments ALTER COLUMN rating DROP NOT NULL;

-- Update constraint to allow null rating on replies or comments
DO $$
BEGIN
  ALTER TABLE recipe_comments DROP CONSTRAINT IF EXISTS recipe_comments_rating_check;
  ALTER TABLE recipe_comments ADD CONSTRAINT recipe_comments_rating_check
    CHECK (
      (rating IS NULL) OR (rating >= 1 AND rating <= 5)
    );
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 4. Update trigger function: only approved top-level ratings count toward recipe rating and rating_count
CREATE OR REPLACE FUNCTION recalc_recipe_rating_from_comments() RETURNS trigger AS $$
DECLARE
  target_id uuid := COALESCE(new.recipe_id, old.recipe_id);
BEGIN
  UPDATE recipes SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM recipe_comments
      WHERE recipe_id = target_id
        AND status = 'approved'
        AND parent_id IS NULL
        AND rating IS NOT NULL
        AND rating > 0
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM recipe_comments
      WHERE recipe_id = target_id
        AND status = 'approved'
        AND parent_id IS NULL
        AND rating IS NOT NULL
        AND rating > 0
    )
  WHERE id = target_id;
  RETURN COALESCE(new, old);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Staff insert policy so staff can submit admin replies directly
DROP POLICY IF EXISTS recipe_comments_staff_insert ON recipe_comments;
CREATE POLICY recipe_comments_staff_insert ON recipe_comments
  FOR INSERT TO authenticated
  WITH CHECK (
    is_admin() OR (is_staff() AND EXISTS (
      SELECT 1 FROM recipes r WHERE r.id = recipe_comments.recipe_id AND r.author_id = auth.uid()
    ))
  );
