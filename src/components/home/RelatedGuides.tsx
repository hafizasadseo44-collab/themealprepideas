"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Flame, ChefHat } from "lucide-react";
import Container from "@/components/ui/Container";

const allGuides = [
  {
    key: "home",
    href: "/",
    icon: ChefHat,
    title: "All Meal Prep Ideas",
    description: "100+ breakfast, lunch, dinner, and snack recipes organized by category.",
  },
  {
    key: "vegan",
    href: "/vegan-meal-prep-ideas",
    icon: Leaf,
    title: "Vegan Meal Prep Ideas",
    description: "115+ plant-based recipes — tofu, bowls, pasta, and high-protein options.",
  },
  {
    key: "keto",
    href: "/keto-meal-prep-ideas",
    icon: Flame,
    title: "Keto Meal Prep Ideas",
    description: "85+ low-carb recipes — chicken, beef, salmon, and vegetarian keto options.",
  },
];

export default function RelatedGuides({ current }: { current: "home" | "vegan" | "keto" }) {
  const guides = allGuides.filter((g) => g.key !== current);

  return (
    <section className="border-t border-brand-border/60 bg-brand-cream/30 py-16 md:py-20">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-brand-light">
          Explore More Guides
        </p>
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={guide.href}
                className="group flex h-full flex-col rounded-[20px] border border-brand-border/60 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-[0_20px_40px_-20px_rgba(17,24,39,0.2)]"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
                  <guide.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-xl text-brand-heading">{guide.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-light">{guide.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                  Explore
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
