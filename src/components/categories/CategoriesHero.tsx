"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Compass, LayoutGrid, Salad, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";

const jumpLinks = [
  { label: "Meal Types", href: "#meal-types" },
  { label: "Diets & Lifestyles", href: "#diets" },
  { label: "Featured Collections", href: "#collections" },
  { label: "More Ways to Browse", href: "#browse-more" },
];

const bentoImages = [
  { src: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80", alt: "Breakfast meal prep containers", className: "left-0 top-6 h-[132px] w-[132px] sm:h-[150px] sm:w-[150px]" },
  { src: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80", alt: "Chicken meal prep bowl", className: "right-2 top-0 h-[100px] w-[100px] sm:h-[118px] sm:w-[118px]" },
  { src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80", alt: "Vegan meal prep bowl", className: "right-0 bottom-16 h-[150px] w-[150px] sm:h-[172px] sm:w-[172px]" },
  { src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80", alt: "Keto meal prep plate", className: "left-8 bottom-0 h-[112px] w-[112px] sm:h-[130px] sm:w-[130px]" },
  { src: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=500&q=80", alt: "Dinner meal prep containers", className: "left-1/2 top-1/2 h-[124px] w-[124px] -translate-x-1/2 -translate-y-1/2 sm:h-[142px] sm:w-[142px]" },
];

export default function CategoriesHero({
  totalRecipes,
  totalCategories,
}: {
  totalRecipes: number;
  totalCategories: number;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      {/* Ambient animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 26, 0], y: [0, -18, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-28 left-[8%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-brand-primary/16 via-brand-orange/8 to-transparent blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -22, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[-120px] top-[220px] h-[300px] w-[300px] rounded-full bg-brand-orange/14 blur-3xl"
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary-dark shadow-sm backdrop-blur">
              <Compass className="size-4" />
              Every Category, One Place
            </div>

            <h1 className="mt-6 text-balance font-display text-[40px] leading-[1.1] text-brand-heading sm:text-[50px] lg:text-[56px]">
              Browse Every{" "}
              <span className="text-brand-primary-dark">Meal Prep</span>{" "}
              Category
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-body">
              From breakfast to keto, family dinners to weight-loss bowls —
              every collection on The Meal Prep Ideas lives right here.
              Explore what&apos;s ready today, and check back often: new
              categories are added every week.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {jumpLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-brand-border/70 bg-white/80 px-4 py-2 text-sm font-medium text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary-dark hover:shadow-md"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-10 border-t border-brand-border/60 pt-8">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-primary/12 text-brand-primary-dark">
                  <LayoutGrid className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-2xl text-brand-heading">
                    <Counter target={totalCategories} />+
                  </p>
                  <p className="text-sm text-brand-light">categories &amp; collections</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-deep">
                  <Salad className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-2xl text-brand-heading">
                    <Counter target={totalRecipes} />+
                  </p>
                  <p className="text-sm text-brand-light">recipes to explore</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual: floating bento of food photos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto h-[380px] w-full max-w-[440px] sm:h-[440px]"
          >
            <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-brand-primary/16 via-brand-orange/10 to-transparent blur-2xl" />

            {bentoImages.map((img, i) => (
              <motion.div
                key={img.src}
                animate={{ y: [0, i % 2 === 0 ? -12 : 12, 0] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className={`absolute overflow-hidden rounded-[22px] border-4 border-white shadow-[0_20px_44px_-16px_rgba(17,24,39,0.35)] ${img.className}`}
              >
                <Image src={img.src} alt={img.alt} fill sizes="180px" className="object-cover" />
              </motion.div>
            ))}

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-brand-border/60 bg-white/95 px-4 py-2.5 shadow-[0_16px_32px_-12px_rgba(17,24,39,0.25)] backdrop-blur"
            >
              <Sparkles className="size-4 text-brand-orange-deep" />
              <p className="text-xs font-semibold text-brand-heading">New categories added weekly</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
