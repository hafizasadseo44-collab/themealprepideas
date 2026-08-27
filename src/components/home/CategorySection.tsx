"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  Sandwich,
  UtensilsCrossed,
  Users,
  Soup,
  Apple,
  Salad,
  Leaf,
  Wheat,
  Sprout,
  Drumstick,
  Beef,
  Fish,
  Snowflake,
  DollarSign,
  Cookie,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";
import RecipeCard from "@/components/home/RecipeCard";
import type { CategorySection as CategorySectionData } from "@/data/site";

const categoryIcons: Record<string, LucideIcon> = {
  breakfast: Coffee,
  lunch: Sandwich,
  dinner: UtensilsCrossed,
  "family-meals": Users,
  soups: Soup,
  snacks: Apple,
  bowls: Salad,
  "vegan-meat-alternatives": Leaf,
  "tofu-tempeh": Sprout,
  "vegan-breakfast": Coffee,
  "vegan-pasta-noodles": UtensilsCrossed,
  "vegan-bowls": Salad,
  "vegan-rice-grain-quinoa": Wheat,
  "chickpea-bean": Soup,
  "vegan-salads": Salad,
  "vegan-sandwiches-wraps": Sandwich,
  "vegan-soups-stews-chili": Soup,
  "easy-vegan": Leaf,
  "high-protein-vegan": Sprout,
  "vegan-weight-loss": Salad,
  "vegan-snacks-desserts": Apple,
  "vegan-components": Wheat,
  "keto-breakfast": Coffee,
  "keto-chicken": Drumstick,
  "keto-beef": Beef,
  "keto-fish-seafood": Fish,
  "keto-lunch": Sandwich,
  "keto-dinner": UtensilsCrossed,
  "keto-affordable": DollarSign,
  "keto-freezer": Snowflake,
  "keto-vegetarian": Leaf,
  "keto-vegan": Sprout,
  "keto-snacks-desserts": Cookie,
};

const PAGE_SIZE = 6;

export default function CategorySection({ section }: { section: CategorySectionData }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const Icon = categoryIcons[section.slug] ?? Salad;
  const shown = section.recipes.slice(0, visible);
  const hasMore = visible < section.recipes.length;

  return (
    <section id={section.slug} className="border-t border-brand-border/60 py-14 md:py-20">
      <Container>
        {/* Compact header: copy left, stat card right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:gap-14"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary-dark">
              <Icon className="size-3.5" />
              Meal Prep Collection
            </span>
            <h2 className="mt-3 text-balance font-display text-[26px] leading-[1.15] text-brand-heading md:text-[34px]">
              {section.heading}
            </h2>
            <div className="mt-4 max-w-xl space-y-3">
              {section.intro.map((paragraph, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-brand-light md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="flex items-center gap-4 rounded-[22px] border border-brand-border/60 bg-gradient-to-br from-brand-primary/8 via-white to-brand-orange/8 p-5 md:p-6"
          >
            <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-primary-dark shadow-[0_10px_24px_-12px_rgba(17,24,39,0.2)]">
              <Icon className="size-6" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[28px] text-brand-heading">
                <Counter target={section.recipes.length} />+
              </p>
              <p className="text-sm text-brand-light">Recipes in this collection</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Recipe feed */}
        <div className="mx-auto mt-10 flex max-w-[980px] flex-col gap-6 md:mt-12">
          {shown.map((recipe, i) => (
            <RecipeCard key={recipe.slug} recipe={recipe} index={i} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, section.recipes.length))}
              className="inline-flex items-center gap-2 rounded-[14px] border border-brand-primary/30 bg-white px-8 py-3.5 text-[15px] font-semibold text-brand-primary-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary/5 hover:shadow-md active:translate-y-0"
            >
              Load More Recipes
              <ChevronDown className="size-4" />
            </button>
            <p className="text-xs text-brand-light">
              Showing {shown.length} of {section.recipes.length} recipes
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
