"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, UtensilsCrossed, Users, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";

export default function AboutHero({ totalRecipes, totalArticles }: { totalRecipes: number; totalArticles: number }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
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
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary-dark shadow-sm backdrop-blur">
              <Heart className="size-4" />
              Our Story
            </div>

            <h1 className="mt-6 text-balance font-display text-[40px] leading-[1.1] text-brand-heading sm:text-[50px] lg:text-[56px]">
              Real food, real prep,
              <br />
              <span className="text-brand-primary-dark">no wasted time.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-body">
              The Meal Prep Ideas started with one problem: weeknights are chaotic and takeout gets old fast.
              So we started building a library of simple, tested, make-ahead recipes — the kind you can prep on
              a Sunday and actually enjoy all week.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-10 border-t border-brand-border/60 pt-8">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-primary/12 text-brand-primary-dark">
                  <UtensilsCrossed className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-2xl text-brand-heading">
                    <Counter target={totalRecipes} />+
                  </p>
                  <p className="text-sm text-brand-light">tested recipes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-deep">
                  <Sparkles className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-2xl text-brand-heading">
                    <Counter target={totalArticles} />+
                  </p>
                  <p className="text-sm text-brand-light">guides &amp; articles</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-sky-500/12 text-sky-600">
                  <Users className="size-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-2xl text-brand-heading">
                    <Counter target={50} />k+
                  </p>
                  <p className="text-sm text-brand-light">home cooks</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto h-[380px] w-full max-w-[440px] sm:h-[440px]"
          >
            <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-brand-primary/16 via-brand-orange/10 to-transparent blur-2xl" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-6 h-[170px] w-[170px] overflow-hidden rounded-[24px] border-4 border-white shadow-[0_20px_44px_-16px_rgba(17,24,39,0.35)] sm:h-[190px] sm:w-[190px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
                alt="Meal prep containers ready for the week"
                fill
                sizes="190px"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute right-0 bottom-8 h-[200px] w-[200px] overflow-hidden rounded-[24px] border-4 border-white shadow-[0_20px_44px_-16px_rgba(17,24,39,0.35)] sm:h-[220px] sm:w-[220px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
                alt="Fresh ingredients being prepped"
                fill
                sizes="220px"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-brand-border/60 bg-white/95 px-4 py-2.5 shadow-[0_16px_32px_-12px_rgba(17,24,39,0.25)] backdrop-blur"
            >
              <Heart className="size-4 fill-brand-orange-deep text-brand-orange-deep" />
              <p className="text-xs font-semibold text-brand-heading">Made by people who actually cook</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
