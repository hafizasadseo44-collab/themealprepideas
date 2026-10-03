"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Coffee,
  Sandwich,
  UtensilsCrossed,
  Users,
  Soup,
  Apple,
  Salad,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/ui/Counter";

type ShowcaseSection = { slug: string; heading: string; intro: string[]; recipeCount: number };

const icons: Record<string, LucideIcon> = {
  breakfast: Coffee,
  lunch: Sandwich,
  dinner: UtensilsCrossed,
  "family-meals": Users,
  soups: Soup,
  snacks: Apple,
  bowls: Salad,
};

const titles: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  "family-meals": "Family Meals",
  soups: "Soups & Chilis",
  snacks: "Snacks",
  bowls: "Meal Prep Bowls",
};

export default function MealTypeShowcase({ sections }: { sections: ShowcaseSection[] }) {
  if (sections.length === 0) return null;

  return (
    <section id="meal-types" className="scroll-mt-24 py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Live Now"
          title="Browse by Meal Type"
          description="Every core meal type, ready to explore today — click through to jump straight to the recipes."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section, i) => {
            const Icon = icons[section.slug] ?? Salad;
            return (
              <motion.div
                key={section.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              >
                <Link
                  href={`/#${section.slug}`}
                  className="group flex h-full flex-col rounded-[20px] border border-brand-border/60 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-20px_rgba(17,24,39,0.22)]"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary-dark transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-brand-heading">
                    {titles[section.slug] ?? section.heading}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-light">
                    {section.intro[0] ? `${section.intro[0].slice(0, 96)}…` : "Explore this collection of ready-to-prep recipes."}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-brand-border/60 pt-4">
                    <span className="text-sm font-semibold text-brand-heading">
                      <Counter target={section.recipeCount} />+ recipes
                    </span>
                    <ArrowUpRight className="size-4 text-brand-primary-dark transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
