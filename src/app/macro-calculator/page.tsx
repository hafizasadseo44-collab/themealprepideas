import type { Metadata } from "next";
import MacroCalculator from "@/components/tools/MacroCalculator";

export const metadata: Metadata = {
  title: "Free Macro Calculator — Calories, Protein, Carbs & Fat | The Meal Prep Ideas",
  description:
    "Calculate your daily macros in seconds. Enter your age, weight, height, activity level, and fitness goal to get a personalized breakdown of calories, protein, carbs, and fat.",
  alternates: { canonical: "https://themealprepideas.com/macro-calculator" },
  openGraph: {
    title: "Free Macro Calculator — Calories, Protein, Carbs & Fat | The Meal Prep Ideas",
    description:
      "Get your personalized daily macros — calories, protein, carbs, and fat — based on your body stats and fitness goal.",
    type: "website",
    siteName: "The Meal Prep Ideas",
    url: "https://themealprepideas.com/macro-calculator",
  },
  twitter: {
    card: "summary",
    title: "Free Macro Calculator | The Meal Prep Ideas",
    description:
      "Calculate your daily macros: calories, protein, carbs, and fat — personalized to your body and goal.",
  },
};

export default function MacroCalculatorPage() {
  return <MacroCalculator />;
}
