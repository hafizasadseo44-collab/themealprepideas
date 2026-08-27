"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ArrowRight, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import { veganRecipeCount } from "@/data/vegan";

const cyclingWords = ["Breakfast", "Lunch", "Dinner", "High-Protein Days", "Busy Weeks"];

const quickCategories = [
  { label: "Breakfast", slug: "vegan-breakfast" },
  { label: "Bowls", slug: "vegan-bowls" },
  { label: "High-Protein", slug: "high-protein-vegan" },
  { label: "Soups & Chili", slug: "vegan-soups-stews-chili" },
  { label: "Snacks", slug: "vegan-snacks-desserts" },
];

function CyclingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % cyclingWords.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={cyclingWords[index]}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -22, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="inline-block text-brand-orange-deep"
        >
          {cyclingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function VeganHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 26, 0], y: [0, -18, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-28 left-1/3 h-[500px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-primary/16 via-brand-primary/8 to-transparent blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 18, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="absolute -right-32 top-[200px] h-[300px] w-[300px] rounded-full bg-brand-orange/10 blur-3xl"
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary-dark shadow-sm backdrop-blur">
              <Leaf className="size-4" />
              <Counter target={veganRecipeCount} />+ Plant-Based Recipes
            </div>

            <h1 className="mt-6 font-display text-[38px] leading-[1.1] text-balance text-brand-heading sm:text-[48px] lg:text-[54px]">
              <span className="text-brand-primary-dark">Vegan</span> Meal Prep Ideas for{" "}
              <CyclingWord />
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-body">
              Ready-to-eat breakfasts, lunches, dinners, and snacks — built from tofu, beans,
              grains, and vegetables you prep ahead. No meat, dairy, or eggs, just recipes to mix,
              match, and make your own.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="#vegan-meat-alternatives" size="lg" icon={ArrowRight}>
                Browse All Recipes
              </Button>
              <Button href="#vegan-faq" variant="ghost" size="lg" icon={Sparkles} iconPosition="left">
                Meal Prep FAQs
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {quickCategories.map((cat) => (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="rounded-full border border-brand-border/70 bg-white/80 px-4 py-2 text-sm font-medium text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary-dark hover:shadow-md"
                >
                  {cat.label}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto h-[280px] w-full max-w-[480px] sm:h-[360px] lg:h-[420px]"
          >
            <div className="absolute inset-0 overflow-hidden rounded-[28px] shadow-[0_34px_68px_-20px_rgba(17,24,39,0.32)]">
              <Image
                src="https://images.unsplash.com/photo-1681146375902-e26675413dad?auto=format&fit=crop&w=1000&q=80"
                alt="Glass meal prep containers filled with colorful plant-based meals"
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 bottom-6 flex items-center gap-3 rounded-2xl border border-brand-border/60 bg-white/95 px-4 py-3 shadow-[0_18px_36px_-14px_rgba(17,24,39,0.28)] backdrop-blur"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-primary/12 text-brand-primary-dark">
                <Leaf className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-brand-heading">100% Plant-Based</p>
                <p className="text-xs text-brand-light">No meat, dairy, or eggs</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
