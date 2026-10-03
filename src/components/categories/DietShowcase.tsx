"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Leaf, Drumstick } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/ui/Counter";
import { byDiet } from "@/data/site";

const liveDietSlugs = new Set(["vegan", "keto"]);

export default function DietShowcase({ veganCount, ketoCount }: { veganCount: number; ketoCount: number }) {
  const featured = [
    {
      slug: "vegan",
      title: "Vegan Meal Prep",
      description: "Plant-powered recipes with tofu, tempeh, bowls, and more — no meat or dairy required.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
      href: "/vegan-meal-prep-ideas",
      count: veganCount,
      icon: Leaf,
    },
    {
      slug: "keto",
      title: "Keto Meal Prep",
      description: "Low-carb, high-fat recipes built for busy weeks — chicken, beef, fish, and freezer-friendly favorites.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
      href: "/keto-meal-prep-ideas",
      count: ketoCount,
      icon: Drumstick,
    },
  ];

  return (
    <section id="diets" className="scroll-mt-24 border-t border-brand-border/60 py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Diets & Lifestyles"
          title="Eat Your Way"
          description="Full diet-specific hubs are live for vegan and keto — more lifestyles are being built out next."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured.map((diet, i) => (
            <motion.div
              key={diet.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <Link
                href={diet.href}
                className="group relative block h-[300px] overflow-hidden rounded-[24px] border border-brand-border/60 shadow-[0_20px_44px_-20px_rgba(17,24,39,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_64px_-20px_rgba(17,24,39,0.35)]"
              >
                <Image
                  src={diet.image}
                  alt={diet.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/0" />

                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-primary-dark backdrop-blur">
                  <diet.icon className="size-3.5" />
                  Live Now
                </div>

                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-display text-2xl text-white md:text-[28px]">{diet.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">{diet.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      <Counter target={diet.count} />+ recipes
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      Explore
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Diet taxonomy cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-2.5"
        >
          {byDiet.map((diet) => {
            const isLive = liveDietSlugs.has(diet.slug);
            return isLive ? (
              <Link
                key={diet.slug}
                href={diet.slug === "vegan" ? "/vegan-meal-prep-ideas" : "/keto-meal-prep-ideas"}
                className="rounded-full border border-brand-primary/30 bg-brand-primary/8 px-4 py-2 text-sm font-semibold text-brand-primary-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/14 hover:shadow-md"
              >
                {diet.label}
              </Link>
            ) : (
              <span
                key={diet.slug}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-border bg-white/60 px-4 py-2 text-sm font-medium text-brand-light"
              >
                {diet.label}
                <span className="rounded-full bg-brand-border/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-light">
                  Soon
                </span>
              </span>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
