"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  ChefHat,
  Users,
  Printer,
  ClipboardList,
  ListOrdered,
  Archive,
  Lightbulb,
  Apple,
  Leaf,
  HelpCircle,
  Hash,
  Compass,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { formatMinutes } from "@/lib/recipes/types";
import type { Recipe } from "@/lib/recipes/types";
import type { Heading } from "@/lib/posts/types";

function iconFor(text: string) {
  const t = text.toLowerCase();
  if (t.includes("ingredient")) return ClipboardList;
  if (t.includes("how to") || t.includes("instruction") || t.includes("direction")) return ListOrdered;
  if (t.includes("storage") || t.includes("tip")) return Archive;
  if (t.includes("note") || t.includes("variation")) return Lightbulb;
  if (t.includes("nutrition")) return Apple;
  if (t.includes("dietary")) return Leaf;
  if (t.includes("faq") || t.includes("frequently asked")) return HelpCircle;
  return Hash;
}

function useActiveHeading(headings: Heading[]) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-140px 0px -65% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

export default function RecipeMetaBar({
  recipe,
  hasContent,
  headings = [],
}: {
  recipe: Recipe;
  hasContent: boolean;
  headings?: Heading[];
}) {
  const activeId = useActiveHeading(headings);

  const stats = [
    { icon: Clock, label: "Prep", value: formatMinutes(recipe.prepTimeMinutes) },
    { icon: ChefHat, label: "Cook", value: formatMinutes(recipe.cookTimeMinutes) },
    { icon: Clock, label: "Total", value: formatMinutes(recipe.totalTimeMinutes) },
    { icon: Users, label: "Servings", value: recipe.servingsLabel ?? (recipe.servings ? `${recipe.servings}` : undefined) },
  ].filter((s) => s.value);

  if (stats.length === 0 && !hasContent) return null;

  return (
    <div className="sticky top-16 z-40 border-y border-brand-border/60 bg-white/90 backdrop-blur md:top-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {stats.map((stat) => (
              <span key={stat.label} className="flex items-center gap-1.5 text-sm text-brand-body">
                <stat.icon className="size-4 text-brand-primary-dark" />
                <span className="font-semibold text-brand-heading">{stat.value}</span>
                <span className="hidden text-brand-light sm:inline">{stat.label}</span>
              </span>
            ))}
          </div>

          {hasContent && (
            <a
              href={`/recipes/${recipe.slug}/print`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_-10px_rgba(63,163,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark"
            >
              <Printer className="size-3.5" />
              Recipe PDF
            </a>
          )}
        </motion.div>

        {headings.length > 1 && (
          <div className="flex items-stretch gap-3 border-t border-brand-border/50 py-2.5">
            <div className="flex shrink-0 items-center gap-1.5 pl-1 text-xs font-semibold uppercase tracking-wide text-brand-light">
              <Compass className="size-3.5 text-brand-primary-dark" />
              <span className="sm:hidden">Contents</span>
              <span className="hidden sm:inline">Table of Contents</span>
            </div>
            <div className="h-auto w-px shrink-0 self-stretch bg-brand-border/70" />
            <div
              className="no-scrollbar -mr-1 flex min-w-0 flex-1 gap-2 overflow-x-auto pr-4"
              style={{
                maskImage: "linear-gradient(to right, black calc(100% - 28px), transparent)",
                WebkitMaskImage: "linear-gradient(to right, black calc(100% - 28px), transparent)",
              }}
            >
              {headings.map((h) => {
                const Icon = iconFor(h.text);
                const active = activeId === h.id;
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                      active
                        ? "border-brand-orange bg-brand-orange text-white shadow-[0_10px_20px_-12px_rgba(245,158,11,0.7)]"
                        : "border-brand-border bg-white text-brand-light hover:border-brand-primary/40 hover:text-brand-heading"
                    )}
                  >
                    <Icon className="size-3.5" />
                    {h.text}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
