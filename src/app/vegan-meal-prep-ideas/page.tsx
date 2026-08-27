import type { Metadata } from "next";
import VeganHero from "@/components/vegan/VeganHero";
import VeganAbout from "@/components/vegan/VeganAbout";
import StorageGuide from "@/components/vegan/StorageGuide";
import CategorySection from "@/components/home/CategorySection";
import Tips from "@/components/home/Tips";
import Faq from "@/components/home/Faq";
import RelatedGuides from "@/components/home/RelatedGuides";
import Newsletter from "@/components/home/Newsletter";
import { veganTips, veganSections, veganFaqs, veganRecipeCount } from "@/data/vegan";

export const metadata: Metadata = {
  title: `Vegan Meal Prep Ideas: ${veganRecipeCount}+ Plant-Based Recipes | The Meal Prep Ideas`,
  description:
    "115+ vegan meal prep ideas for every meal — tofu, tempeh, bowls, pasta, high-protein, and snacks. Plant-based recipes you can batch-cook and prep ahead, no meat or dairy required.",
  openGraph: {
    title: `Vegan Meal Prep Ideas: ${veganRecipeCount}+ Plant-Based Recipes`,
    description:
      "115+ vegan meal prep ideas for every meal — tofu, tempeh, bowls, pasta, high-protein, and snacks. All plant-based, all make-ahead.",
    type: "website",
    siteName: "The Meal Prep Ideas",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: veganFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const recipeListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: veganSections.flatMap((section) =>
    section.recipes.map((recipe, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Recipe",
        name: recipe.title,
        description: recipe.description,
        image: recipe.image,
        recipeCategory: section.heading,
        suitableForDiet: "https://schema.org/VeganDiet",
        url: `https://themealprepideas.com/vegan-meal-prep-ideas#${recipe.slug}`,
      },
    }))
  ),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://themealprepideas.com" },
    { "@type": "ListItem", position: 2, name: "Vegan Meal Prep Ideas", item: "https://themealprepideas.com/vegan-meal-prep-ideas" },
  ],
};

export default function VeganMealPrepPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <VeganHero />

      <VeganAbout />

      <Tips
        id="vegan-tips"
        eyebrow="Vegan Meal Prep Tips"
        title="A little planning goes a long way"
        image="https://images.unsplash.com/photo-1724441980123-aca7911329d0?auto=format&fit=crop&w=1000&q=80"
        imageAlt="Jar of granola and batch-prepped ingredients ready for the week"
        tips={veganTips}
      />

      {veganSections.map((section) => (
        <CategorySection key={section.slug} section={section} />
      ))}

      <StorageGuide />

      <Faq id="vegan-faq" title="Vegan Meal Prep FAQs" faqs={veganFaqs} />

      <RelatedGuides current="vegan" />

      <Newsletter />
    </>
  );
}
