"use client";

import { motion } from "framer-motion";
import { Refrigerator, Snowflake, Flame, Clock, Salad, type LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { veganStorage } from "@/data/vegan";

const iconMap: Record<string, LucideIcon> = {
  refrigerator: Refrigerator,
  snowflake: Snowflake,
  flame: Flame,
  clock: Clock,
  salad: Salad,
};

type StorageItem = { title: string; description: string };

type StorageGuideProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: StorageItem[];
  icons?: string[];
};

export default function StorageGuide({
  id,
  eyebrow = "Keep It Fresh",
  title = "How to Store Vegan Meal Prep",
  description = "Proper storage helps your meals stay fresh and makes your vegan meal prep ideas easier to enjoy throughout the week. Use clean, airtight containers, refrigerate cooked food promptly, and keep ingredients separate when sauces or crunchy vegetables could affect the texture.",
  items = veganStorage,
  icons = ["refrigerator", "snowflake", "flame"],
}: StorageGuideProps) {
  const gridCols = items.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

  return (
    <section id={id} className="scroll-mt-24 bg-white py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className={`mt-14 grid grid-cols-1 gap-6 ${gridCols}`}>
          {items.map((item, i) => {
            const Icon = iconMap[icons[i % icons.length]] ?? Refrigerator;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-[20px] border border-brand-border/60 bg-brand-cream/40 p-7 transition-shadow duration-300 hover:shadow-[0_20px_40px_-20px_rgba(17,24,39,0.2)]"
              >
                <span className="flex size-12 items-center justify-center rounded-[14px] bg-brand-primary/10 text-brand-primary-dark">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl text-brand-heading">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-light">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
