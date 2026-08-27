import type { Metadata } from "next";
import KetoHero from "@/components/keto/KetoHero";
import KetoAbout from "@/components/keto/KetoAbout";
import WeeklyPlanner from "@/components/keto/WeeklyPlanner";
import StorageGuide from "@/components/vegan/StorageGuide";
import CategorySection from "@/components/home/CategorySection";
import Tips from "@/components/home/Tips";
import Faq from "@/components/home/Faq";
import RelatedGuides from "@/components/home/RelatedGuides";
import Newsletter from "@/components/home/Newsletter";
import { ketoTips, ketoSections, ketoStorage, ketoFaqs, ketoRecipeCount } from "@/data/keto";

export const metadata: Metadata = {
  title: `Keto Meal Prep Ideas: ${ketoRecipeCount}+ Low-Carb Recipes | The Meal Prep Ideas`,
  description:
    "78+ keto meal prep ideas for breakfast, lunch, dinner, and snacks — chicken, beef, salmon, and vegetarian options included. Low-carb recipes you can batch-cook and prep ahead for the week.",
  openGraph: {
    title: `Keto Meal Prep Ideas: ${ketoRecipeCount}+ Low-Carb Recipes`,
    description:
      "78+ keto meal prep ideas for every meal — chicken, beef, salmon, and vegetarian options included. All low-carb, all make-ahead.",
    type: "website",
    siteName: "The Meal Prep Ideas",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ketoFaqs.map((faq) => ({
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
  itemListElement: ketoSections.flatMap((section) =>
    section.recipes.map((recipe, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Recipe",
        name: recipe.title,
        description: recipe.description,
        image: recipe.image,
        recipeCategory: section.heading,
        suitableForDiet: "https://schema.org/LowCalorieDiet",
        url: `https://themealprepideas.com/keto-meal-prep-ideas#${recipe.slug}`,
      },
    }))
  ),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://themealprepideas.com" },
    { "@type": "ListItem", position: 2, name: "Keto Meal Prep Ideas", item: "https://themealprepideas.com/keto-meal-prep-ideas" },
  ],
};

export default function KetoMealPrepPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <KetoHero />

      <KetoAbout />

      <Tips
        id="keto-tips"
        eyebrow="Keto Meal Prep Tips"
        title="Keto Meal Prep Tips for Beginners"
        image="https://images.unsplash.com/photo-1690573313202-4493a7d02e9c?auto=format&fit=crop&w=1000&q=80"
        imageAlt="Meal prep containers with grilled chicken, greens, and low-carb vegetables"
        tips={ketoTips}
      />

      {ketoSections.map((section) => (
        <CategorySection key={section.slug} section={section} />
      ))}

      <WeeklyPlanner />

      <StorageGuide
        id="keto-storage"
        eyebrow="Keep It Fresh"
        title="How to Store Keto Meal Prep Meals"
        description="Proper storage helps your prepared meals stay fresh, safe, and enjoyable throughout the week. Let cooked food cool before storing, use clean airtight containers, and keep your fridge and freezer at safe temperatures."
        items={ketoStorage}
        icons={["clock", "snowflake", "flame", "salad"]}
      />

      <Faq id="keto-faq" title="Keto Meal Prep FAQs" faqs={ketoFaqs} />

      <RelatedGuides current="keto" />

      <Newsletter />
    </>
  );
}
