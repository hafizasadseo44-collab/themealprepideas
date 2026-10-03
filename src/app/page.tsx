import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Comparison from "@/components/home/Comparison";
import CategorySection from "@/components/home/CategorySection";
import BrowseSections from "@/components/home/BrowseSections";
import RelatedGuides from "@/components/home/RelatedGuides";
import Tips from "@/components/home/Tips";
import Containers from "@/components/home/Containers";
import Guides from "@/components/home/Guides";
import Faq from "@/components/home/Faq";
import Newsletter from "@/components/home/Newsletter";
import { faqs } from "@/data/site";
import { getPageWithSections } from "@/lib/recipes/queries";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default async function Home() {
  const home = await getPageWithSections("home");
  const sections = home?.sections ?? [];

  const recipeListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sections.flatMap((section) =>
      section.recipes.map((recipe, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Recipe",
          name: recipe.title,
          description: recipe.description,
          image: recipe.image,
          recipeCategory: section.heading,
          url: `https://themealprepideas.com/recipes/${recipe.slug}`,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeListSchema) }}
      />
      <Hero />
      <Intro />
      <Comparison />
      {sections.map((section) => (
        <CategorySection key={section.slug} section={section} />
      ))}
      <BrowseSections />
      <RelatedGuides current="home" />
      <Tips />
      <Containers />
      <Guides />
      <Faq />
      <Newsletter />
    </>
  );
}
