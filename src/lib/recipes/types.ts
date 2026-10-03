import { slugify } from "@/lib/posts/types";
import type { ContentBlock } from "@/lib/posts/types";

export type RecipeStatus = "draft" | "published";
export type CommentStatus = "pending" | "approved" | "rejected";

export type RecipeComment = {
  id: string;
  recipeId: string;
  recipeTitle?: string;
  recipeSlug?: string;
  authorName: string;
  rating: number;
  body: string;
  status: CommentStatus;
  createdAt: string;
};

export type RecipePage = {
  id: string;
  name: string;
  slug: string;
  route: string;
  description: string | null;
  coverImageUrl: string | null;
  recipeCount?: number;
};

export type RecipeSection = {
  id: string;
  pageId: string;
  slug: string;
  heading: string;
  intro: string[];
  recipeCount?: number;
};

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;

  pageId: string | null;
  pageName?: string;
  pageSlug?: string;
  pageRoute?: string;
  sectionIds: string[];

  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  totalTimeMinutes: number | null;
  servings: number | null;
  servingsLabel: string | null;

  content: ContentBlock[];
  contentJson: unknown;

  calories: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;

  tag: string | null;
  rating: number | null;
  ratingCount: number;

  status: RecipeStatus;
  createdAt: string;
  updatedAt: string;
  showAiShare: boolean;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: string | null;
    canonical: string | null;
    focusKeyword: string | null;
    noindex: boolean;
    nofollow: boolean;
  };

  // Convenience formatted fields matching the legacy static Recipe shape
  // (src/data/site.ts) so RecipeCard.tsx keeps working unchanged.
  prepTime?: string;
  protein?: string;
};

export function formatMinutes(minutes: number | null): string | undefined {
  if (!minutes) return undefined;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

export function isRecipeComplete(recipe: Pick<Recipe, "content">) {
  return recipe.content.length > 0;
}

export { slugify };
export type { ContentBlock };
