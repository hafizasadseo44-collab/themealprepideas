"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, PlayCircle, Star, Users, Salad, ChefHat } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";

const cyclingWords = ["Breakfast", "Lunch", "Dinner", "Busy Weeknights", "Every Goal"];

const quickCategories = [
  { label: "Breakfast", slug: "breakfast" },
  { label: "Lunch", slug: "lunch" },
  { label: "Dinner", slug: "dinner" },
  { label: "Family Meals", slug: "family-meals" },
  { label: "Soups & Chilis", slug: "soups" },
  { label: "Snacks", slug: "snacks" },
  { label: "Meal Prep Bowls", slug: "bowls" },
];

const orbitImages = [
  { src: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?auto=format&fit=crop&w=400&q=80", alt: "Meal prep containers with rice, corn, olives, tomatoes and lentils" },
  { src: "https://images.unsplash.com/photo-1747292718361-c838a9968ec7?auto=format&fit=crop&w=400&q=80", alt: "Colorful salad bowl with fresh ingredients" },
  { src: "https://images.unsplash.com/photo-1490371475955-4cb3bfc72f71?auto=format&fit=crop&w=400&q=80", alt: "Granola and yogurt mason jar" },
  { src: "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=400&q=80", alt: "Salmon fillet with quinoa and roasted broccoli" },
  { src: "https://images.unsplash.com/photo-1679279726946-a158b8bcaa23?auto=format&fit=crop&w=400&q=80", alt: "Rice bowl with seasoned meat and sauce" },
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

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16">
      {/* Ambient animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-primary/14 via-brand-orange/10 to-transparent blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[-140px] top-[260px] h-[340px] w-[340px] rounded-full bg-brand-orange/12 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -left-24 bottom-0 h-[260px] w-[260px] rounded-full bg-brand-primary/10 blur-3xl"
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary-dark shadow-sm backdrop-blur">
              <Salad className="size-4" />
              100+ Recipes &middot; Updated for 2026
            </div>

            <h1 className="mt-6 font-display text-[42px] leading-[1.08] text-balance text-brand-heading sm:text-[52px] lg:text-[58px]">
              <span className="text-brand-primary-dark">100+</span> Easy Meal Prep Ideas for{" "}
              <CyclingWord />
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-body">
              A premium collection of simple, healthy meal prep recipes — from
              high-protein bowls to freezer-friendly dinners. Plan less, eat
              better, and save hours every week with recipes built for real
              life.
            </p>

            {/* Advanced search trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-search"))}
              className="mt-8 flex w-full max-w-lg items-center gap-3 rounded-[18px] border border-brand-border/70 bg-white p-3.5 text-left shadow-[0_16px_40px_-16px_rgba(17,24,39,0.18)] transition-all duration-300 hover:border-brand-primary/40 hover:shadow-[0_20px_44px_-16px_rgba(17,24,39,0.24)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
                <Search className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[15px] text-brand-light">
                Search 100+ recipes — <span className="font-medium text-brand-heading">try &ldquo;high protein lunch&rdquo;</span>
              </span>
              <span className="hidden shrink-0 rounded-md border border-brand-border/70 px-2 py-1 text-xs font-medium text-brand-light sm:inline-block">
                Ctrl K
              </span>
            </button>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button href="#breakfast" size="lg" icon={ArrowRight}>
                Browse All Recipes
              </Button>
              <Button href="#how-it-works" variant="ghost" size="lg" icon={PlayCircle} iconPosition="left">
                How Meal Prep Works
              </Button>
            </div>

            {/* Quick category links */}
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

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-brand-border/60 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {["photo-1517673132405-a56a62b18caf", "photo-1502685104226-ee32379fefbe", "photo-1544005313-94ddf0286df2"].map((id) => (
                    <div key={id} className="size-9 overflow-hidden rounded-full border-2 border-white">
                      <Image src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=80&q=80`} alt="" width={36} height={36} className="size-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-brand-heading flex items-center gap-1">
                    <Users className="size-3.5 text-brand-primary" /> 120,000+
                  </p>
                  <p className="text-brand-light">home cooks weekly</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-brand-orange">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-brand-heading">4.9/5</span>
                <span className="text-brand-light">from 2,400+ reviews</span>
              </div>
            </div>
          </motion.div>

          {/* Right: rotating image orbit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto flex h-[400px] w-[400px] items-center justify-center sm:h-[500px] sm:w-[500px] lg:h-[600px] lg:w-[600px]"
          >
            {/* Glow behind the orbit */}
            <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-brand-primary/18 via-brand-orange/12 to-transparent blur-2xl" />

            {/* Faint orbit ring */}
            <div className="absolute inset-[6%] rounded-full border border-dashed border-brand-primary/25" />

            {/* Center hub */}
            <div className="absolute inset-0 z-10 m-auto flex h-[34%] w-[34%] flex-col items-center justify-center rounded-full border border-brand-border/60 bg-white/95 text-center shadow-[0_24px_48px_-16px_rgba(17,24,39,0.28)] backdrop-blur">
              <ChefHat className="size-6 text-brand-primary-dark" />
              <p className="mt-1 font-display text-2xl leading-none text-brand-heading">
                <Counter target={100} />+
              </p>
              <p className="mt-1 text-[11px] font-medium text-brand-light">Recipes</p>
            </div>

            {/* Rotating ring of images */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            >
              {orbitImages.map((img, i) => {
                const angle = (360 / orbitImages.length) * i;
                return (
                  <div
                    key={img.src}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="absolute left-1/2 top-[10%] -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                        className="relative size-[104px] overflow-hidden rounded-full border-4 border-white shadow-[0_18px_36px_-12px_rgba(17,24,39,0.4)] sm:size-[128px] lg:size-[150px]"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="150px"
                          className="object-cover"
                        />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Floating stat badges */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-2 top-2 z-10 flex items-center gap-2 rounded-2xl border border-brand-border/60 bg-white/90 px-3.5 py-2.5 shadow-[0_16px_32px_-12px_rgba(17,24,39,0.25)] backdrop-blur sm:left-2"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary-dark">
                <Star className="size-4 fill-current" />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-brand-heading">4.9 Rating</p>
                <p className="text-[11px] text-brand-light">2,400+ reviews</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-2 bottom-4 z-10 flex items-center gap-2 rounded-2xl border border-brand-border/60 bg-white/90 px-3.5 py-2.5 shadow-[0_16px_32px_-12px_rgba(17,24,39,0.25)] backdrop-blur sm:right-2"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange-deep">
                🔥
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-brand-heading">100+ Ideas</p>
                <p className="text-[11px] text-brand-light">7 collections</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
