import type { Metadata } from "next";
import { getRecipePages } from "@/lib/recipes/queries";
import { getPublishedPosts } from "@/lib/posts/queries";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutProcess from "@/components/about/AboutProcess";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us | The Meal Prep Ideas",
  description:
    "The Meal Prep Ideas is a library of tested, real-photo meal prep recipes built for busy weeks — no fluff, just food that actually works on a weeknight.",
};

export default async function AboutPage() {
  const [pages, posts] = await Promise.all([getRecipePages(), getPublishedPosts()]);
  const totalRecipes = pages.reduce((sum, p) => sum + (p.recipeCount ?? 0), 0);

  return (
    <>
      <AboutHero totalRecipes={totalRecipes} totalArticles={posts.length} />
      <AboutStory />
      <AboutValues />
      <AboutProcess />
      <AboutCTA />
    </>
  );
}
