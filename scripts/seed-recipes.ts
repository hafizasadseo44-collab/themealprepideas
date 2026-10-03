/**
 * One-time migration: copies the 305 hardcoded recipes from
 * src/data/site.ts / vegan.ts / keto.ts into the Supabase recipe_pages /
 * recipe_sections / recipes tables.
 *
 * Run once with: npx tsx scripts/seed-recipes.ts
 *
 * Requires an admin account to already exist (sign in at /admin once and
 * promote your profile's role to 'admin' in SQL Editor) — seeded recipes are
 * attributed to that admin account. All recipes are seeded as "published"
 * since their cards are already live on the site today.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import { categorySections } from "../src/data/site";
import { veganSections } from "../src/data/vegan";
import { ketoSections } from "../src/data/keto";
import type { CategorySection, Recipe as StaticRecipe } from "../src/data/site";

function loadEnvLocal() {
  try {
    const content = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch {
    // .env.local not found — assume env vars are already set another way
  }
}

function parseMinutes(prepTime?: string): number | null {
  if (!prepTime) return null;
  const hrMatch = prepTime.match(/(\d+(?:\.\d+)?)\s*hr/i);
  const minMatch = prepTime.match(/(\d+(?:\.\d+)?)\s*min/i);
  const hours = hrMatch ? parseFloat(hrMatch[1]) : 0;
  const minutes = minMatch ? parseFloat(minMatch[1]) : 0;
  if (!hrMatch && !minMatch) {
    const bare = prepTime.match(/(\d+(?:\.\d+)?)/);
    return bare ? Math.round(parseFloat(bare[1])) : null;
  }
  return Math.round(hours * 60 + minutes);
}

function parseNumber(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

type PageConfig = {
  name: string;
  slug: string;
  route: string;
  description: string;
  sections: CategorySection[];
};

async function main() {
  loadEnvLocal();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: adminProfile, error: adminError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();

  if (adminError || !adminProfile) {
    console.error("No admin profile found. Sign in at /admin once and set your role to 'admin' first.");
    process.exit(1);
  }

  const pages: PageConfig[] = [
    { name: "Home Page", slug: "home", route: "/", description: "Recipes shown on the homepage.", sections: categorySections },
    { name: "Vegan Page", slug: "vegan", route: "/vegan-meal-prep-ideas", description: "Recipes shown on the vegan meal prep page.", sections: veganSections },
    { name: "Keto Page", slug: "keto", route: "/keto-meal-prep-ideas", description: "Recipes shown on the keto meal prep page.", sections: ketoSections },
  ];

  let totalRecipes = 0;

  for (const page of pages) {
    const { data: pageRow, error: pageError } = await supabase
      .from("recipe_pages")
      .upsert({ name: page.name, slug: page.slug, route: page.route, description: page.description }, { onConflict: "slug" })
      .select("id")
      .single();

    if (pageError || !pageRow) {
      console.error(`✗ page ${page.slug}: ${pageError?.message}`);
      continue;
    }
    console.log(`\n== ${page.name} ==`);

    const sectionIdBySlug = new Map<string, string>();
    for (let i = 0; i < page.sections.length; i++) {
      const section = page.sections[i];
      const { data: sectionRow, error: sectionError } = await supabase
        .from("recipe_sections")
        .upsert(
          { page_id: pageRow.id, slug: section.slug, heading: section.heading, intro: section.intro, sort_order: i },
          { onConflict: "page_id,slug" }
        )
        .select("id")
        .single();

      if (sectionError || !sectionRow) {
        console.error(`  ✗ section ${section.slug}: ${sectionError?.message}`);
        continue;
      }
      sectionIdBySlug.set(section.slug, sectionRow.id);
    }

    // De-dupe recipes that appear in more than one section of the same page
    // (e.g. thai-peanut-chicken-bowls / teriyaki-salmon-bowls in site.ts)
    // into a single row with multiple section memberships.
    const recipesBySlug = new Map<string, { recipe: StaticRecipe; sectionIds: Set<string> }>();
    for (const section of page.sections) {
      const sectionId = sectionIdBySlug.get(section.slug);
      if (!sectionId) continue;
      for (const recipe of section.recipes) {
        const existing = recipesBySlug.get(recipe.slug);
        if (existing) {
          existing.sectionIds.add(sectionId);
        } else {
          recipesBySlug.set(recipe.slug, { recipe, sectionIds: new Set([sectionId]) });
        }
      }
    }

    for (const { recipe, sectionIds } of recipesBySlug.values()) {
      const { error } = await supabase.from("recipes").upsert(
        {
          slug: recipe.slug,
          title: recipe.title,
          description: recipe.description,
          hero_image_url: recipe.image,
          hero_image_alt: recipe.title,
          page_id: pageRow.id,
          section_ids: Array.from(sectionIds),
          prep_time_minutes: parseMinutes(recipe.prepTime),
          calories: parseNumber(recipe.calories) ? Math.round(parseNumber(recipe.calories)!) : null,
          protein_grams: parseNumber(recipe.protein),
          tag: recipe.tag ?? null,
          rating: recipe.rating ?? null,
          status: "published",
          author_id: adminProfile.id,
        },
        { onConflict: "slug" }
      );

      if (error) {
        console.error(`  ✗ ${recipe.slug}: ${error.message}`);
      } else {
        console.log(`  ✓ ${recipe.slug}`);
        totalRecipes += 1;
      }
    }
  }

  console.log(`\nDone. Seeded ${totalRecipes} recipes across ${pages.length} pages, all attributed to your admin account and published.`);
}

main();
