"use client";

import { motion } from "framer-motion";
import { Salad, Timer, Camera, Star } from "lucide-react";
import Container from "@/components/ui/Container";

const values = [
  {
    icon: Salad,
    tint: "bg-brand-primary/10 text-brand-primary-dark",
    title: "Real Ingredients",
    text: "Nothing you can't find at a normal grocery store. No hunting down obscure powders for one recipe.",
  },
  {
    icon: Timer,
    tint: "bg-brand-orange/15 text-brand-orange-deep",
    title: "Respect Your Time",
    text: "Every recipe lists real prep and cook time — because a 'quick' dinner shouldn't take an hour.",
  },
  {
    icon: Camera,
    tint: "bg-sky-500/10 text-sky-600",
    title: "Real Photos",
    text: "What you see is what you'll actually make — no styled food that looks nothing like the recipe.",
  },
  {
    icon: Star,
    tint: "bg-amber-400/15 text-amber-600",
    title: "Rated By Real Cooks",
    text: "Every rating on this site comes from someone who actually made the recipe and left a review.",
  },
];

export default function AboutValues() {
  return (
    <section className="border-t border-brand-border/60 bg-brand-cream/50 py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-brand-primary-dark">What We Believe</p>
          <h2 className="mt-3 text-balance font-display text-[30px] leading-[1.15] text-brand-heading sm:text-[38px]">
            Meal prep should make your life easier, not harder
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-[22px] border border-brand-border/60 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgba(17,24,39,0.22)]"
            >
              <span className={`flex size-12 items-center justify-center rounded-[14px] ${value.tint} transition-transform duration-300 group-hover:scale-110`}>
                <value.icon className="size-5.5" />
              </span>
              <h3 className="mt-5 font-display text-lg text-brand-heading">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-light">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
