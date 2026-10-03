import { formatMinutes, type Recipe, type RecipeStatus } from "@/lib/recipes/types";
import { tiptapJsonToBlocks } from "@/lib/tiptap/json-to-blocks";
import type { TiptapNode } from "@/lib/tiptap/inline-text";
import type { Recipe as StaticRecipe } from "@/data/site";

export type RecipeRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  page_id: string | null;
  section_ids: string[];
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  total_time_minutes: number | null;
  servings: number | null;
  servings_label: string | null;
  content: TiptapNode | null;
  calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fat_grams: number | null;
  tag: string | null;
  rating: number | null;
  rating_count: number;
  status: RecipeStatus;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image_url: string | null;
  canonical_url: string | null;
  focus_keyword: string | null;
  seo_noindex: boolean;
  seo_nofollow: boolean;
  created_at: string;
  updated_at: string;
  show_ai_share: boolean;
  recipe_pages?: { id: string; name: string; slug: string; route: string } | null;
};

export function recipeRowToRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.hero_image_url ?? "",
    imageAlt: row.hero_image_alt || row.title,

    pageId: row.page_id,
    pageName: row.recipe_pages?.name,
    pageSlug: row.recipe_pages?.slug,
    pageRoute: row.recipe_pages?.route,
    sectionIds: row.section_ids ?? [],

    prepTimeMinutes: row.prep_time_minutes,
    cookTimeMinutes: row.cook_time_minutes,
    totalTimeMinutes: row.total_time_minutes,
    servings: row.servings,
    servingsLabel: row.servings_label,

    content: tiptapJsonToBlocks(row.content),
    contentJson: row.content ?? { type: "doc", content: [] },

    calories: row.calories,
    proteinGrams: row.protein_grams,
    carbsGrams: row.carbs_grams,
    fatGrams: row.fat_grams,

    tag: row.tag,
    rating: row.rating,
    ratingCount: row.rating_count ?? 0,

    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    showAiShare: row.show_ai_share,
    seo: {
      title: row.seo_title,
      description: row.seo_description,
      ogImage: row.seo_og_image_url,
      canonical: row.canonical_url,
      focusKeyword: row.focus_keyword,
      noindex: row.seo_noindex,
      nofollow: row.seo_nofollow,
    },

    // Legacy-shaped convenience fields so the existing RecipeCard.tsx (which
    // expects site.ts's plain Recipe type) keeps rendering unchanged.
    prepTime: formatMinutes(row.prep_time_minutes),
    protein: row.protein_grams ? `${row.protein_grams}g` : undefined,
  };
}

/**
 * Adapts a DB-backed Recipe to the exact static shape RecipeCard.tsx (the
 * live homepage/vegan/keto card, which must render pixel-identical whether
 * fed static or DB data) already expects.
 */
export function toLiveCardRecipe(recipe: Recipe): StaticRecipe {
  return {
    slug: recipe.slug,
    title: recipe.title,
    image: recipe.image,
    description: recipe.description,
    tag: recipe.tag ?? undefined,
    prepTime: recipe.prepTime,
    calories: recipe.calories != null ? String(recipe.calories) : undefined,
    protein: recipe.protein,
    rating: recipe.rating ?? undefined,
  };
}
