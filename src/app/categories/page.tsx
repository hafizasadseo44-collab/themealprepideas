import type { Metadata } from "next";
import CategoriesHero from "@/components/categories/CategoriesHero";
import MealTypeShowcase from "@/components/categories/MealTypeShowcase";
import DietShowcase from "@/components/categories/DietShowcase";
import CollectionsShowcase from "@/components/categories/CollectionsShowcase";
import TaxonomyExplorer from "@/components/categories/TaxonomyExplorer";
import Newsletter from "@/components/home/Newsletter";
import { collections } from "@/data/site";
import { getRecipePages, getPageWithSections } from "@/lib/recipes/queries";

export const metadata: Metadata = {
  title: "Browse All Meal Prep Categories | The Meal Prep Ideas",
  description:
    "Every meal prep category in one place — breakfast, lunch, dinner, family meals, vegan, keto, and curated collections by goal, protein, and cuisine.",
  openGraph: {
    title: "Browse All Meal Prep Categories | The Meal Prep Ideas",
    description:
      "Every meal prep category in one place — breakfast, lunch, dinner, family meals, vegan, keto, and curated collections by goal, protein, and cuisine.",
    type: "website",
    siteName: "The Meal Prep Ideas",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://themealprepideas.com" },
    { "@type": "ListItem", position: 2, name: "Categories", item: "https://themealprepideas.com/categories" },
  ],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: collections.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.title,
    url: `https://themealprepideas.com/categories/${c.slug}`,
  })),
};

export default async function CategoriesPage() {
  const [pages, home] = await Promise.all([getRecipePages(), getPageWithSections("home")]);

  const veganCount = pages.find((p) => p.slug === "vegan")?.recipeCount ?? 0;
  const ketoCount = pages.find((p) => p.slug === "keto")?.recipeCount ?? 0;
  const totalRecipes = pages.reduce((sum, p) => sum + (p.recipeCount ?? 0), 0);

  const sections = (home?.sections ?? []).map((section) => ({
    slug: section.slug,
    heading: section.heading,
    intro: section.intro,
    recipeCount: section.recipes.length,
  }));
  const totalCategories = collections.length + sections.length;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <CategoriesHero totalRecipes={totalRecipes} totalCategories={totalCategories} />
      <MealTypeShowcase sections={sections} />
      <DietShowcase veganCount={veganCount} ketoCount={ketoCount} />
      <CollectionsShowcase />
      <TaxonomyExplorer />
      <Newsletter />
    </>
  );
}
