"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, BookOpen, PenSquare, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";

const floatingCards = [
  {
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80",
    label: "Getting Started",
    className: "left-0 top-2 h-[130px] w-[164px] sm:h-[160px] sm:w-[200px]",
  },
  {
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
    label: "Gear & Containers",
    className: "right-0 top-20 h-[112px] w-[140px] sm:h-[138px] sm:w-[170px]",
  },
  {
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80",
    label: "Nutrition",
    className: "left-8 bottom-0 h-[120px] w-[150px] sm:h-[148px] sm:w-[180px]",
  },
];

export default function BlogHero({ postCount, categoryCount }: { postCount: number; categoryCount: number }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 right-[6%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-brand-orange/16 via-brand-primary/8 to-transparent blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-[-100px] bottom-[-40px] h-[280px] w-[280px] rounded-full bg-brand-primary/14 blur-3xl"
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-orange-deep shadow-sm backdrop-blur">
              <PenSquare className="size-4" />
              The Meal Prep Journal
            </div>

            <h1 className="mt-5 text-balance font-display text-[32px] leading-[1.12] text-brand-heading sm:text-[42px] lg:text-[52px]">
              Stories, tips &{" "}
              <span className="text-brand-primary-dark">real advice</span>{" "}
              for your kitchen
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-body sm:text-lg lg:mx-0">
              No fluff, no filler — just practical guides on planning,
              storing, and prepping food that actually holds up all week.
            </p>

            <div className="mt-7 flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#blog-grid"
                className="inline-flex items-center gap-2 rounded-[14px] bg-brand-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(63,163,77,0.55)] transition-all duration-300 hover:bg-brand-primary-dark"
              >
                Browse All Articles
                <ArrowDown className="size-4" />
              </a>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-primary/12 text-brand-primary-dark">
                    <BookOpen className="size-4" />
                  </span>
                  <div className="leading-tight text-left">
                    <p className="font-display text-lg text-brand-heading">
                      <Counter target={postCount} />+
                    </p>
                    <p className="text-xs text-brand-light">articles</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-deep">
                    <Sparkles className="size-4" />
                  </span>
                  <div className="leading-tight text-left">
                    <p className="font-display text-lg text-brand-heading">
                      <Counter target={categoryCount} />
                    </p>
                    <p className="text-xs text-brand-light">topics</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto hidden h-[300px] w-full max-w-[380px] sm:block sm:h-[340px]"
          >
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className={`absolute overflow-hidden rounded-[20px] border-4 border-white shadow-[0_20px_44px_-16px_rgba(17,24,39,0.32)] ${card.className}`}
              >
                <Image src={card.image} alt={card.label} fill sizes="220px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-heading">
                  {card.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
