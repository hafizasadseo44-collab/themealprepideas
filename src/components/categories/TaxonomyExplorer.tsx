"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Wallet,
  Briefcase,
  Users,
  GraduationCap,
  Heart,
  Baby,
  Smile,
  Sparkles as SparklesIcon,
  TrendingUp,
  Beef,
  Drumstick,
  Fish,
  Sprout,
  Egg,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { byGoal, byProtein, cuisines, seasonal } from "@/data/site";

const goalIcons: Record<string, LucideIcon> = {
  "weight-loss": TrendingUp,
  "muscle-gain": Dumbbell,
  bulking: Dumbbell,
  budget: Wallet,
  "busy-professionals": Briefcase,
  family: Users,
  college: GraduationCap,
  seniors: Heart,
  toddlers: Baby,
  "picky-eaters": Smile,
  postpartum: SparklesIcon,
};

const proteinIcons: Record<string, LucideIcon> = {
  chicken: Drumstick,
  "ground-beef": Beef,
  "ground-turkey": Drumstick,
  salmon: Fish,
  fish: Fish,
  shrimp: Fish,
  steak: Beef,
  tofu: Sprout,
  eggs: Egg,
};

const proteinHrefs: Record<string, string> = {
  chicken: "/keto-meal-prep-ideas#keto-chicken",
  "ground-beef": "/keto-meal-prep-ideas#keto-beef",
  steak: "/keto-meal-prep-ideas#keto-beef",
  salmon: "/keto-meal-prep-ideas#keto-fish-seafood",
  fish: "/keto-meal-prep-ideas#keto-fish-seafood",
  shrimp: "/keto-meal-prep-ideas#keto-fish-seafood",
  tofu: "/vegan-meal-prep-ideas#tofu-tempeh",
};

const goalHrefs: Record<string, string> = {
  family: "/#family-meals",
};

function TagCloud({
  items,
  icons,
  hrefs,
}: {
  items: { label: string; slug: string }[];
  icons: Record<string, LucideIcon>;
  hrefs: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item) => {
        const Icon = icons[item.slug] ?? SparklesIcon;
        const href = hrefs[item.slug];
        return href ? (
          <Link
            key={item.slug}
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/8 px-4 py-2 text-sm font-semibold text-brand-primary-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/14 hover:shadow-md"
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        ) : (
          <span
            key={item.slug}
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-border bg-white/60 px-4 py-2 text-sm font-medium text-brand-light"
          >
            <Icon className="size-4" />
            {item.label}
            <span className="rounded-full bg-brand-border/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-light">
              Soon
            </span>
          </span>
        );
      })}
    </div>
  );
}

function ImageTileRow({ items }: { items: { slug: string; title: string; description: string; image: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="group relative h-44 overflow-hidden rounded-[20px] border border-brand-border/60"
        >
          <Image src={item.image} alt={item.title} fill sizes="360px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/0" />
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-light">
            Coming Soon
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h4 className="font-display text-lg text-white">{item.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-white/80">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function TaxonomyExplorer() {
  return (
    <section id="browse-more" className="scroll-mt-24 border-t border-brand-border/60 py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Keep Exploring"
          title="More Ways to Browse"
          description="Filter by goal, protein, cuisine, and season — some are live today, and the rest are on the way."
        />

        <div className="mt-14 space-y-12">
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-light">By Protein</h3>
            <TagCloud items={byProtein} icons={proteinIcons} hrefs={proteinHrefs} />
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-light">By Goal</h3>
            <TagCloud items={byGoal} icons={goalIcons} hrefs={goalHrefs} />
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-light">By Cuisine</h3>
            <ImageTileRow items={cuisines} />
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-light">Seasonal</h3>
            <ImageTileRow items={seasonal} />
          </div>
        </div>
      </Container>
    </section>
  );
}
