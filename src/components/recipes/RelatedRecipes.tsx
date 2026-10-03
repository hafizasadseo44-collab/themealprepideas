import Container from "@/components/ui/Container";
import RecipeCard from "@/components/home/RecipeCard";
import { toLiveCardRecipe } from "@/lib/recipes/mappers";
import type { Recipe } from "@/lib/recipes/types";

export default function RelatedRecipes({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) return null;

  return (
    <section className="border-t border-brand-border/60 py-16 md:py-20">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-brand-light">Keep Cooking</p>
        <h2 className="mt-3 text-center font-display text-2xl text-brand-heading md:text-[32px]">You Might Also Like</h2>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6">
          {recipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={toLiveCardRecipe(recipe)} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
