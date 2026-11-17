import type { Metadata } from "next";
import MacroCalculator from "@/components/tools/MacroCalculator";
import { FAQ_ITEMS } from "@/components/tools/macroCalculatorData";

const SITE_URL = "https://themealprepideas.com";
const PAGE_URL = `${SITE_URL}/macro-calculator`;

export const metadata: Metadata = {
  title: "Free Macro Calculator: Calculate Protein, Carbs & Fat | The Meal Prep Ideas",
  description:
    "Use our free Macro Calculator to estimate your daily calories, protein, carbohydrates, and fat based on your measurements and activity level. Choose your fitness goal, explore 6 diet styles, and customize your macro split.",
  alternates: { canonical: PAGE_URL },
  keywords: [
    "Macro Calculator",
    "Free Macro Calculator",
    "Calculate Protein Carbs Fat",
    "Daily Calorie Target",
    "BMR Calculator",
    "TDEE Calculator",
    "Mifflin-St Jeor Equation",
    "Katch-McArdle Formula",
    "Meal Prep Macro Split",
    "Keto Macros",
    "High Protein Diet Calculator",
    "Nutrition Planning Tool",
  ],
  openGraph: {
    title: "Free Macro Calculator: Calculate Protein, Carbs & Fat | The Meal Prep Ideas",
    description:
      "Estimate daily calories, protein, carbs, and fat with scientifically validated Mifflin-St Jeor & Katch-McArdle equations. Explore 6 diet styles with printable results.",
    type: "website",
    siteName: "The Meal Prep Ideas",
    url: PAGE_URL,
    images: [
      {
        url: `${SITE_URL}/og-macro-calculator.png`,
        width: 1200,
        height: 630,
        alt: "Free Macro Calculator - The Meal Prep Ideas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Macro Calculator: Calculate Protein, Carbs & Fat",
    description:
      "Free scientific macro calculator: calories, protein, carbs & fat. Custom ratios, BMR, TDEE, and meal prep distributions.",
  },
};

export default function MacroCalculatorPage() {
  // 1. Software / WebApplication Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Macro Calculator: Calculate Protein, Carbs & Fat",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A free scientific macro calculator estimating daily calories, protein, carbohydrates, and dietary fat based on Mifflin-St Jeor and Katch-McArdle formulas with 6 diet styles, custom macro splits, and meal prep distributions.",
    browserRequirements: "Requires JavaScript",
    softwareVersion: "2026.1",
    author: {
      "@type": "Organization",
      name: "The Meal Prep Ideas",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "The Meal Prep Ideas",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  // 2. FAQ Schema for Search Engines and AI Answer Engines (Perplexity, ChatGPT, Gemini)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  // 3. HowTo Schema for Step-by-Step Guidance
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Use the Free Macro Calculator",
    description:
      "Follow these 7 steps to calculate your personalized daily calories and macronutrient breakdown for meal prep.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose Your Unit System",
        text: "Select Metric (kg/cm) or Imperial (lbs/ft/in) according to your preference.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select Your Biological Sex",
        text: "Choose Male or Female to apply the correct Mifflin-St Jeor metabolic equation constants.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter Age, Height, and Weight",
        text: "Use the sliders or input boxes to specify your current biological stats.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Enable Optional Body Fat Percentage",
        text: "If known, enter your body fat percentage to switch to the Katch-McArdle lean body mass formula.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Select Your Activity Level",
        text: "Pick from Sedentary (1.2x) to Extremely Active (1.9x) based on your weekly routine.",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Choose Your Fitness Goal",
        text: "Select Lose Weight (-500 kcal), Fat Loss (-300 kcal), Body Recomp, Maintain, or Lean Bulk (+200 kcal).",
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: "Select Your Diet Style",
        text: "Choose Balanced, High Protein, Low Carb, Keto, Vegetarian, or Vegan, then click Calculate My Personalized Macros.",
      },
    ],
  };

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Free Macro Calculator",
        item: PAGE_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <MacroCalculator />
    </>
  );
}
