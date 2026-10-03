import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getCurrentProfile } from "@/lib/auth/session";
import { recipeRowToRecipe, toLiveCardRecipe, type RecipeRow } from "@/lib/recipes/mappers";
import type { Recipe, RecipePage, RecipeSection, RecipeComment } from "@/lib/recipes/types";
import type { CategorySection as StaticCategorySection } from "@/data/site";

const RECIPE_SELECT = `
  id, slug, title, description, hero_image_url, hero_image_alt,
  page_id, section_ids, prep_time_minutes, cook_time_minutes, total_time_minutes,
  servings, servings_label, content,
  calories, protein_grams, carbs_grams, fat_grams, tag, rating, rating_count, status,
  seo_title, seo_description, seo_og_image_url, canonical_url, focus_keyword,
  seo_noindex, seo_nofollow, created_at, updated_at, show_ai_share,
  recipe_pages ( id, name, slug, route )
`;

/** Public: pages registry (Home/Vegan/Keto today, more can be added later). */
export async function getRecipePages(): Promise<RecipePage[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipe_pages")
    .select("id, name, slug, route, description, cover_image_url, recipes(count)")
    .order("sort_order");

  if (error || !data) return [];
  type PageRow = { id: string; name: string; slug: string; route: string; description: string | null; cover_image_url: string | null; recipes: { count: number }[] };
  return (data as unknown as PageRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    route: row.route,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    recipeCount: row.recipes?.[0]?.count ?? 0,
  }));
}

export async function getRecipePageBySlug(slug: string): Promise<RecipePage | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipe_pages")
    .select("id, name, slug, route, description, cover_image_url")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    route: data.route,
    description: data.description,
    coverImageUrl: data.cover_image_url,
  };
}

export async function getRecipeSections(pageId: string): Promise<RecipeSection[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipe_sections")
    .select("id, page_id, slug, heading, intro")
    .eq("page_id", pageId)
    .order("sort_order");

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    pageId: row.page_id,
    slug: row.slug,
    heading: row.heading,
    intro: (row.intro as string[]) ?? [],
  }));
}

/** Public site: published recipes belonging to a page. */
export async function getPublishedRecipesForPage(pageId: string): Promise<Recipe[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("page_id", pageId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("[getPublishedRecipesForPage]", error?.message);
    return [];
  }
  return (data as unknown as RecipeRow[]).map(recipeRowToRecipe);
}

/**
 * The live site (home/vegan/keto pages) renders recipes through the exact
 * same `CategorySection`/`RecipeCard` components as the original static
 * data files — this just feeds them DB-backed data shaped identically, so
 * nothing about the live cards has to change to go live from the CMS.
 */
export async function getPageWithSections(pageSlug: string): Promise<{
  page: RecipePage;
  sections: StaticCategorySection[];
  totalCount: number;
} | null> {
  const page = await getRecipePageBySlug(pageSlug);
  if (!page) return null;

  const [sections, recipes] = await Promise.all([getRecipeSections(page.id), getPublishedRecipesForPage(page.id)]);

  return {
    page,
    sections: sections.map((section) => ({
      slug: section.slug,
      heading: section.heading,
      intro: section.intro,
      recipes: recipes.filter((r) => r.sectionIds.includes(section.id)).map(toLiveCardRecipe),
    })),
    totalCount: recipes.length,
  };
}

export async function getAllPublishedRecipeSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("recipes").select("slug").eq("status", "published");
  if (error || !data) return [];
  return data.map((r) => r.slug);
}

/** Minimal slug + timestamp list for sitemap.ts — avoids fetching full recipe bodies. */
export async function getSitemapRecipes(): Promise<{ slug: string; updatedAt: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("slug, updated_at")
    .eq("status", "published");
  if (error || !data) return [];
  return data.map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return recipeRowToRecipe(data as unknown as RecipeRow);
}

export async function getRelatedRecipes(recipe: Recipe, count = 3): Promise<Recipe[]> {
  if (!recipe.pageId) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("page_id", recipe.pageId)
    .eq("status", "published")
    .neq("id", recipe.id)
    .overlaps("section_ids", recipe.sectionIds.length ? recipe.sectionIds : ["00000000-0000-0000-0000-000000000000"])
    .limit(count);

  if (error || !data || data.length === 0) {
    // fall back to any other published recipe on the same page
    const fallback = await supabase
      .from("recipes")
      .select(RECIPE_SELECT)
      .eq("page_id", recipe.pageId)
      .eq("status", "published")
      .neq("id", recipe.id)
      .limit(count);
    return ((fallback.data ?? []) as unknown as RecipeRow[]).map(recipeRowToRecipe);
  }
  return (data as unknown as RecipeRow[]).map(recipeRowToRecipe);
}

/** Admin: all recipes for a page — admins see everyone's, editors only their own. */
export async function getRecipesForPageAdmin(pageId: string): Promise<Recipe[]> {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  let query = supabase.from("recipes").select(RECIPE_SELECT).eq("page_id", pageId).order("created_at", { ascending: true });

  if (profile && profile.role !== "admin") {
    query = query.eq("author_id", profile.id);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("[getRecipesForPageAdmin]", error?.message);
    return [];
  }
  return (data as unknown as RecipeRow[]).map(recipeRowToRecipe);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("recipes").select(RECIPE_SELECT).eq("id", id).maybeSingle();
  if (error || !data) return null;
  return recipeRowToRecipe(data as unknown as RecipeRow);
}

/** A signed-in customer's bookmarked recipes, most recently saved first. */
export async function getSavedRecipes(customerId: string): Promise<Recipe[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_recipes")
    .select(`created_at, recipes:recipe_id (${RECIPE_SELECT})`)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("[getSavedRecipes]", error.message);
    return [];
  }

  return (data as unknown as { recipes: RecipeRow | null }[])
    .map((row) => row.recipes)
    .filter((row): row is RecipeRow => row !== null)
    .map(recipeRowToRecipe);
}

/** Slugs of recipes a signed-in customer has saved — for rendering saved state on cards. */
export async function getSavedRecipeSlugs(customerId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_recipes")
    .select("recipes:recipe_id (slug)")
    .eq("customer_id", customerId);

  if (error || !data) return new Set();
  return new Set(
    (data as unknown as { recipes: { slug: string } | null }[])
      .map((row) => row.recipes?.slug)
      .filter((slug): slug is string => Boolean(slug))
  );
}

type CommentRow = {
  id: string;
  recipe_id: string;
  author_name: string;
  rating: number;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  recipes?: { title: string; slug: string } | null;
};

function commentRowToComment(row: CommentRow): RecipeComment {
  return {
    id: row.id,
    recipeId: row.recipe_id,
    recipeTitle: row.recipes?.title,
    recipeSlug: row.recipes?.slug,
    authorName: row.author_name,
    rating: row.rating,
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** Public: approved comments for one recipe, newest first. */
export async function getApprovedComments(recipeId: string): Promise<RecipeComment[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("recipe_comments")
    .select("id, recipe_id, author_name, rating, body, status, created_at")
    .eq("recipe_id", recipeId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as CommentRow[]).map(commentRowToComment);
}

/**
 * Admin: comments awaiting moderation. The `recipe_comments_staff_read` RLS
 * policy already restricts non-admin staff to comments on recipes they
 * authored — no extra filtering needed here.
 */
export async function getCommentsForModeration(): Promise<RecipeComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_comments")
    .select("id, recipe_id, author_name, rating, body, status, created_at, recipes ( title, slug )")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[getCommentsForModeration]", error?.message);
    return [];
  }
  return (data as unknown as CommentRow[]).map(commentRowToComment);
}
