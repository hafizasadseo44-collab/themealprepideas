"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChefHat,
  Coffee,
  Sandwich,
  UtensilsCrossed,
  Users,
  Soup,
  Apple,
  Salad,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";

const categories = [
  { label: "Breakfast", icon: Coffee },
  { label: "Lunch", icon: Sandwich },
  { label: "Dinner", icon: UtensilsCrossed },
  { label: "Family Meals", icon: Users },
  { label: "Soups", icon: Soup },
  { label: "Snacks", icon: Apple },
  { label: "Meal Prep Bowls", icon: Salad },
];

export default function Intro() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-140px] top-10 h-[380px] w-[380px] rounded-full bg-brand-primary/8 blur-3xl" />
        <div className="absolute right-[-100px] bottom-0 h-[320px] w-[320px] rounded-full bg-brand-orange/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-4 py-1.5 text-sm font-semibold text-brand-primary-dark">
              <ChefHat className="size-4" />
              Start Here
            </span>

            <p className="mt-6 font-display text-2xl leading-snug text-brand-heading md:text-[28px]">
              If you&apos;re looking for meal prep ideas that can make a busy week easier, you&apos;re in the right place.
            </p>

            <p className="mt-4 text-base leading-relaxed text-brand-body md:text-lg">
              Preparing your meals ahead of time can save you time, reduce last-minute cooking, and make it easier to have something good to eat when your schedule gets busy.
            </p>

            <p className="mt-4 text-base leading-relaxed text-brand-body md:text-lg">
              In this guide, you&apos;ll find{" "}
              <span className="font-semibold text-brand-heading">100 meal prep ideas</span>{" "}
              across breakfast, lunch, dinner, family meals, soups, snacks and meal prep bowls.
              Whether you need a quick breakfast, a lunch to take to work, an easy dinner for the
              week, or meals that can be made in larger batches, you&apos;ll find plenty of
              practical options to choose from.
            </p>

            {/* Category chips */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {categories.map((cat, i) => (
                <motion.span
                  key={cat.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-border/70 bg-white px-4 py-2 text-sm font-medium text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary-dark hover:shadow-md"
                >
                  <cat.icon className="size-4 text-brand-primary" />
                  {cat.label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto h-[380px] w-full max-w-[480px] sm:h-[440px]"
          >
            <div className="absolute inset-0 overflow-hidden rounded-[24px] shadow-[0_30px_60px_-20px_rgba(17,24,39,0.3)]">
              <Image
                src="https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80"
                alt="Fresh meal prep containers with prepped ingredients"
                fill
                sizes="(min-width: 1024px) 460px, 90vw"
                className="object-cover"
              />
            </div>

            {/* Animated stat badge */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-brand-border/60 bg-white/95 px-5 py-4 shadow-[0_20px_44px_-16px_rgba(17,24,39,0.3)] backdrop-blur"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-primary/12 text-brand-primary-dark">
                <Salad className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-2xl text-brand-heading">
                  <Counter target={100} />+
                </p>
                <p className="text-xs text-brand-light">Meal Prep Ideas</p>
              </div>
            </motion.div>

            {/* Floating category cluster */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute -right-4 top-6 flex items-center gap-1.5 rounded-2xl border border-brand-border/60 bg-white/95 px-3 py-2.5 shadow-[0_16px_32px_-12px_rgba(17,24,39,0.25)] backdrop-blur"
            >
              {[Coffee, UtensilsCrossed, Soup].map((Icon, i) => (
                <span
                  key={i}
                  className="flex size-8 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-deep"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
