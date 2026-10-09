"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { notifyNewRecipe } from "@/lib/email/notify";
import type { RecipeStatus } from "@/lib/recipes/types";
import type { TiptapNode } from "@/lib/tiptap/inline-text";

export type RecipeInput = {
  title: string;
  slug: string;
  description: string;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  pageId: string | null;
  sectionIds: string[];
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  totalTimeMinutes: number | null;
  servings: number | null;
  servingsLabel: string | null;
  content: TiptapNode;
  calories: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
  tag: string | null;
  rating: number | null;
  status: RecipeStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  seoOgImageUrl: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  seoNoindex: boolean;
  seoNofollow: boolean;
  showAiShare: boolean;
};

export type ActionResult = { ok: true; id: string } | { ok: false; error: string };

function toRow(input: RecipeInput, authorId?: string) {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    hero_image_url: input.heroImageUrl,
    hero_image_alt: input.heroImageAlt,
    page_id: input.pageId,
    section_ids: input.sectionIds,
    prep_time_minutes: input.prepTimeMinutes,
    cook_time_minutes: input.cookTimeMinutes,
    total_time_minutes: input.totalTimeMinutes,
    servings: input.servings,
    servings_label: input.servingsLabel,
    content: input.content,
    calories: input.calories,
    protein_grams: input.proteinGrams,
    carbs_grams: input.carbsGrams,
    fat_grams: input.fatGrams,
    tag: input.tag,
    rating: input.rating,
    status: input.status,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
    seo_og_image_url: input.seoOgImageUrl,
    canonical_url: input.canonicalUrl,
    focus_keyword: input.focusKeyword,
    seo_noindex: input.seoNoindex,
    seo_nofollow: input.seoNofollow,
    show_ai_share: input.showAiShare,
    ...(authorId ? { author_id: authorId } : {}),
  };
}

async function revalidateForRecipe(slug: string, pageId: string | null) {
  revalidatePath(`/recipes/${slug}`);
  revalidatePath("/admin/recipes");
  // Refresh the sitemap so newly published/updated recipes are discoverable by
  // search engines right away, not only on the next full redeploy.
  revalidatePath("/sitemap.xml");
  if (pageId) {
    const supabase = await createClient();
    const { data } = await supabase.from("recipe_pages").select("route, slug").eq("id", pageId).maybeSingle();
    if (data) {
      revalidatePath(data.route);
      revalidatePath(`/admin/recipes/${data.slug}`);
    }
  }
}

export async function createRecipe(input: RecipeInput): Promise<ActionResult> {
  const profile = await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .insert(toRow(input, profile.id))
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Could not create recipe." };

  await revalidateForRecipe(input.slug, input.pageId);

  if (input.status === "published") {
    notifyNewRecipe({
      title: input.title,
      slug: input.slug,
      description: input.description,
      imageUrl: input.heroImageUrl,
      tag: input.tag,
    }).catch((err) => console.error("[email] notifyNewRecipe failed:", err));
  }

  return { ok: true, id: data.id };
}

export async function updateRecipe(id: string, input: RecipeInput): Promise<ActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { data: existing } = await supabase.from("recipes").select("status").eq("id", id).maybeSingle();
  const wasPublished = existing?.status === "published";

  const { error } = await supabase.from("recipes").update(toRow(input)).eq("id", id);
  if (error) return { ok: false, error: error.message };

  await revalidateForRecipe(input.slug, input.pageId);

  if (!wasPublished && input.status === "published") {
    notifyNewRecipe({
      title: input.title,
      slug: input.slug,
      description: input.description,
      imageUrl: input.heroImageUrl,
      tag: input.tag,
    }).catch((err) => console.error("[email] notifyNewRecipe failed:", err));
  }

  return { ok: true, id };
}

export async function deleteRecipe(id: string, slug: string, pageId: string | null): Promise<ActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await revalidateForRecipe(slug, pageId);
  return { ok: true, id };
}

// ============================================================
// Pages registry (admin-only)
// ============================================================

export type PageInput = {
  name: string;
  slug: string;
  route: string;
  description: string | null;
  coverImageUrl: string | null;
};

export async function createRecipePage(input: PageInput): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_pages")
    .insert({ name: input.name, slug: input.slug, route: input.route, description: input.description, cover_image_url: input.coverImageUrl })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Could not create page." };
  revalidatePath("/admin/recipes");
  return { ok: true, id: data.id };
}

export async function updateRecipePage(id: string, input: PageInput): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipe_pages")
    .update({ name: input.name, slug: input.slug, route: input.route, description: input.description, cover_image_url: input.coverImageUrl })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/recipes");
  revalidatePath(`/admin/recipes/${input.slug}`);
  return { ok: true, id };
}

export async function deleteRecipePage(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const { count } = await supabase.from("recipes").select("id", { count: "exact", head: true }).eq("page_id", id);
  if (count && count > 0) {
    return { ok: false, error: `This page still has ${count} recipe(s) attached to it. Move or delete them first.` };
  }

  const { error } = await supabase.from("recipe_pages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/recipes");
  return { ok: true, id };
}

// ============================================================
// Sections (admin-only)
// ============================================================

export type SectionInput = {
  pageId: string;
  slug: string;
  heading: string;
  intro: string[];
};

export async function createRecipeSection(input: SectionInput): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_sections")
    .insert({ page_id: input.pageId, slug: input.slug, heading: input.heading, intro: input.intro })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Could not create section." };
  revalidatePath("/admin/recipes");
  return { ok: true, id: data.id };
}

export async function updateRecipeSection(id: string, input: SectionInput): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipe_sections")
    .update({ heading: input.heading, slug: input.slug, intro: input.intro })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/recipes");
  return { ok: true, id };
}

export async function deleteRecipeSection(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const { data: usingRecipes } = await supabase.from("recipes").select("id").contains("section_ids", [id]).limit(1);
  if (usingRecipes && usingRecipes.length > 0) {
    return { ok: false, error: "This section still has recipes in it. Remove them from the section first." };
  }

  const { error } = await supabase.from("recipe_sections").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/recipes");
  return { ok: true, id };
}
