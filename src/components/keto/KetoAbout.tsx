"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChefHat, Drumstick, Salad, Flame, UtensilsCrossed } from "lucide-react";
import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";

const points = [
  { label: "Protein First", icon: Drumstick },
  { label: "Low-Carb Veggies", icon: Salad },
  { label: "Healthy Fats", icon: Flame },
  { label: "Batch Cooked", icon: UtensilsCrossed },
];

export default function KetoAbout({ sectionCount }: { sectionCount: number }) {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-140px] top-10 h-[360px] w-[360px] rounded-full bg-brand-orange/8 blur-3xl" />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-1.5 text-sm font-semibold text-brand-orange-deep">
              <ChefHat className="size-4" />
              Getting Started
            </span>

            <h2 className="mt-4 font-display text-[32px] leading-tight text-brand-heading md:text-[40px]">
              What Is Keto Meal Prep?
            </h2>

            <p className="mt-5 text-base leading-relaxed text-brand-body md:text-lg">
              Keto meal prep means preparing keto-friendly meals or ingredients ahead of time so
              you have ready-to-eat food when you need it. A simple keto meal combines protein,
              low-carb vegetables, and healthy fats.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {points.map((point, i) => (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex flex-col items-center gap-2 rounded-[16px] border border-brand-border/60 bg-brand-cream/50 px-3 py-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-md"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange-deep">
                    <point.icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold text-brand-heading">{point.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto h-[300px] w-full max-w-[440px] sm:h-[360px]"
          >
            <div className="absolute inset-0 overflow-hidden rounded-[24px] shadow-[0_30px_60px_-20px_rgba(17,24,39,0.3)]">
              <Image
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80"
                alt="Balanced keto plate with a poached egg, vegetables, and healthy fats"
                fill
                sizes="(min-width: 1024px) 440px, 90vw"
                className="object-cover"
              />
            </div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-brand-border/60 bg-white/95 px-5 py-4 shadow-[0_20px_44px_-16px_rgba(17,24,39,0.3)] backdrop-blur"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-deep">
                <Flame className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-2xl text-brand-heading">
                  <Counter target={sectionCount} />
                </p>
                <p className="text-xs text-brand-light">Recipe Collections</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
