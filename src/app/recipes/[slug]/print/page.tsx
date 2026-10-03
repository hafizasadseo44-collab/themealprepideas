import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecipeBySlug } from "@/lib/recipes/queries";
import { extractRecipeStructuredData } from "@/lib/recipes/extract";
import PrintStudio from "@/components/recipes/print/PrintStudio";

export const metadata: Metadata = {
  title: "Print Recipe | The Meal Prep Ideas",
  robots: { index: false, follow: false },
};

export default async function RecipePrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const { ingredients, instructions, dietary, notes, time, nutrition } = extractRecipeStructuredData(recipe.content);

  if (ingredients.length === 0 && instructions.length === 0) notFound();

  return (
    <PrintStudio
      recipe={recipe}
      ingredients={ingredients}
      instructions={instructions}
      dietary={dietary}
      notes={notes}
      time={time}
      nutrition={nutrition}
    />
  );
}
