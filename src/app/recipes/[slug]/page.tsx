import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Newsletter from "@/components/home/Newsletter";
import ArticleContent from "@/components/blog/ArticleContent";
import RecipeHero from "@/components/recipes/RecipeHero";
import RecipeMetaBar from "@/components/recipes/RecipeMetaBar";
import RecipeSidebar from "@/components/recipes/RecipeSidebar";
import RecipeEmptyState from "@/components/recipes/RecipeEmptyState";
import RecipePrintCard from "@/components/recipes/RecipePrintCard";
import AiShareSection from "@/components/recipes/AiShareSection";
import RecipeComments from "@/components/recipes/RecipeComments";
import RelatedRecipes from "@/components/recipes/RelatedRecipes";
import { getRecipeBySlug, getRelatedRecipes, getAllPublishedRecipeSlugs, getApprovedComments } from "@/lib/recipes/queries";
import { extractRecipeStructuredData, classifySection } from "@/lib/recipes/extract";
import { getHeadings } from "@/lib/posts/types";

const SITE_URL = "https://themealprepideas.com";

// Allow slugs not present at build time (newly published recipes) to be
// rendered on-demand instead of returning 404.
export const dynamicParams = true;
// Re-validate ISR pages at most every 60 s so content updates (images,
// edits) appear quickly even if revalidatePath() hasn't fired yet.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPublishedRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe Not Found | The Meal Prep Ideas" };

  const canonicalUrl = recipe.seo.canonical || `${SITE_URL}/recipes/${recipe.slug}`;
  const title = recipe.seo.title || `${recipe.title} | The Meal Prep Ideas`;
  const description = recipe.seo.description || recipe.description;
  const ogImage = recipe.seo.ogImage || recipe.image || undefined;
  const keywords = [recipe.seo.focusKeyword, recipe.tag, recipe.pageName].filter(
    (v): v is string => Boolean(v)
  );

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: { canonical: canonicalUrl },
    robots: recipe.seo.noindex || recipe.seo.nofollow ? { index: !recipe.seo.noindex, follow: !recipe.seo.nofollow } : undefined,
    openGraph: {
      title: recipe.title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "The Meal Prep Ideas",
      publishedTime: recipe.createdAt,
      modifiedTime: recipe.updatedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: recipe.imageAlt || recipe.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function toIsoDuration(minutes: number | null): string | undefined {
  return minutes && minutes > 0 ? `PT${minutes}M` : undefined;
}

/** Content-authored Time/Nutrition facts (e.g. "Calories: 350") back-filling the schema when the dedicated numeric fields weren't set. */
function findFact(facts: { label: string; value: string }[], re: RegExp): string | undefined {
  return facts.find((f) => re.test(f.label))?.value || undefined;
}

/** Pulls the leading number out of a free-text time fact ("15 minutes" → 15). */
function parseMinutesFromFact(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const hasContent = recipe.content.length > 0;
  const { ingredients, instructions, dietary, notes, time: timeFacts, nutrition: nutritionFacts } = extractRecipeStructuredData(recipe.content);
  const headings = getHeadings(recipe.content).filter((h) => classifySection(h.text) !== null);
  const [related, comments] = await Promise.all([getRelatedRecipes(recipe, 3), getApprovedComments(recipe.id)]);
  const headingsWithReviews = [...headings, { id: "reviews", text: "Reviews & Comments", level: 2 as const }];

  const canonicalUrl = recipe.seo.canonical || `${SITE_URL}/recipes/${recipe.slug}`;

  const caloriesValue = recipe.calories ? `${recipe.calories} calories` : findFact(nutritionFacts, /calor/i);
  const proteinValue = recipe.proteinGrams ? `${recipe.proteinGrams}g` : findFact(nutritionFacts, /protein/i);
  const carbsValue = recipe.carbsGrams ? `${recipe.carbsGrams}g` : findFact(nutritionFacts, /carb/i);
  const fatValue = recipe.fatGrams ? `${recipe.fatGrams}g` : findFact(nutritionFacts, /^fat$/i);
  const fiberValue = findFact(nutritionFacts, /fiber|fibre/i);
  const sugarValue = findFact(nutritionFacts, /sugar/i);
  const sodiumValue = findFact(nutritionFacts, /sodium/i);

  const nutrition: Record<string, unknown> = {
    "@type": "NutritionInformation",
    ...(caloriesValue ? { calories: caloriesValue } : {}),
    ...(proteinValue ? { proteinContent: proteinValue } : {}),
    ...(carbsValue ? { carbohydrateContent: carbsValue } : {}),
    ...(fatValue ? { fatContent: fatValue } : {}),
    ...(fiberValue ? { fiberContent: fiberValue } : {}),
    ...(sugarValue ? { sugarContent: sugarValue } : {}),
    ...(sodiumValue ? { sodiumContent: sodiumValue } : {}),
  };
  const hasNutrition = Object.keys(nutrition).length > 1;

  const prepMinutes = recipe.prepTimeMinutes ?? parseMinutesFromFact(findFact(timeFacts, /^prep/i));
  const cookMinutes = recipe.cookTimeMinutes ?? parseMinutesFromFact(findFact(timeFacts, /^cook/i));
  const totalMinutes = recipe.totalTimeMinutes ?? parseMinutesFromFact(findFact(timeFacts, /^total/i));

  const recipeSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    datePublished: recipe.createdAt,
    dateModified: recipe.updatedAt,
    author: { "@type": "Organization", name: "The Meal Prep Ideas", url: SITE_URL },
    ...(recipe.image ? { image: [recipe.image] } : {}),
    ...(recipe.tag ? { recipeCategory: recipe.tag } : {}),
    ...(recipe.tag || recipe.pageName ? { keywords: [recipe.tag, recipe.pageName].filter(Boolean).join(", ") } : {}),
    ...(prepMinutes ? { prepTime: toIsoDuration(prepMinutes) } : {}),
    ...(cookMinutes ? { cookTime: toIsoDuration(cookMinutes) } : {}),
    ...(totalMinutes ? { totalTime: toIsoDuration(totalMinutes) } : {}),
    ...(recipe.servingsLabel || recipe.servings ? { recipeYield: recipe.servingsLabel ?? `${recipe.servings}` } : {}),
    ...(ingredients.length > 0 ? { recipeIngredient: ingredients } : {}),
    ...(instructions.length > 0
      ? { recipeInstructions: instructions.map((text) => ({ "@type": "HowToStep", text })) }
      : {}),
    ...(hasNutrition ? { nutrition } : {}),
    ...(recipe.rating != null && recipe.ratingCount > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: recipe.rating, ratingCount: recipe.ratingCount } }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...(recipe.pageName && recipe.pageRoute
        ? [{ "@type": "ListItem", position: 2, name: recipe.pageName, item: `${SITE_URL}${recipe.pageRoute}` }]
        : []),
      {
        "@type": "ListItem",
        position: recipe.pageName ? 3 : 2,
        name: recipe.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <RecipeHero recipe={recipe} />
      <RecipeMetaBar recipe={recipe} hasContent={hasContent} headings={headingsWithReviews} />

      <section className="pb-16 pt-10 md:pb-20">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-12">
            <div id="recipe-content" className="mx-auto w-full max-w-[720px] scroll-mt-28 space-y-8 lg:mx-0">
              {recipe.showAiShare && <AiShareSection recipeTitle={recipe.title} recipeUrl={canonicalUrl} />}
              {hasContent ? <ArticleContent content={recipe.content} /> : <RecipeEmptyState />}
              <RecipePrintCard
                recipe={recipe}
                ingredients={ingredients}
                instructions={instructions}
                dietary={dietary}
                notes={notes}
                time={timeFacts}
                nutrition={nutritionFacts}
              />
              <RecipeComments recipe={recipe} comments={comments} />
            </div>

            <RecipeSidebar recipe={recipe} />
          </div>
        </Container>
      </section>

      <RelatedRecipes recipes={related} />
      <Newsletter />
    </>
  );
}
