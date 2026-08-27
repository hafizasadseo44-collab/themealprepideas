"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { byGoal, byDiet, byProtein, byMealType } from "@/data/site";

const tabs = [
  { key: "goal", label: "By Goal", items: byGoal, basePath: "/goal" },
  { key: "diet", label: "By Diet", items: byDiet, basePath: "/diet" },
  { key: "protein", label: "By Protein", items: byProtein, basePath: "/protein" },
  { key: "meal-type", label: "By Meal Type", items: byMealType, basePath: "/meal-type" },
];

// Slugs that map to a real page or an on-page section anchor instead of the
// generic (not-yet-built) taxonomy route.
const dietOverrides: Record<string, string> = {
  vegan: "/vegan-meal-prep-ideas",
  keto: "/keto-meal-prep-ideas",
};

const mealTypeAnchors = new Set(["breakfast", "lunch", "dinner", "snacks", "bowls"]);

function resolveHref(tabKey: string, basePath: string, slug: string) {
  if (tabKey === "diet" && dietOverrides[slug]) return dietOverrides[slug];
  if (tabKey === "meal-type" && mealTypeAnchors.has(slug)) return `#${slug}`;
  return `${basePath}/${slug}`;
}

export default function BrowseSections() {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section className="border-t border-brand-border/60 py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="Find Your Fit"
          title="Browse by Goal, Diet, Protein & Meal Type"
          description="However you like to search, we've organized every recipe to get you there in one click."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  active === i
                    ? "bg-brand-primary text-white shadow-[0_10px_24px_-10px_rgba(63,163,77,0.55)]"
                    : "bg-brand-gray text-brand-body hover:bg-brand-primary/10"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mt-8 flex flex-wrap justify-center gap-2.5"
            >
              {current.items.map((item) => (
                <Link
                  key={item.slug}
                  href={resolveHref(current.key, current.basePath, item.slug)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-brand-border/70 bg-white px-4 py-2.5 text-sm font-medium text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:bg-brand-primary hover:text-white hover:shadow-md"
                >
                  {item.label}
                  <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
