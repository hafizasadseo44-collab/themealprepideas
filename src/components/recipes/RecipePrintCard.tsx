"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  ChefHat,
  Users,
  Mail,
  Printer,
  Check,
  Lightbulb,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { scaleIngredientText } from "@/lib/recipes/scale";
import { formatMinutes, type Recipe } from "@/lib/recipes/types";
import type { RecipeFact } from "@/lib/recipes/extract";

/** "Prep Time" -> "Prep", "Total Time" -> "Total" — keeps the stat bar compact regardless of how the recipe's content spells out each label. */
function shortTimeLabel(label: string) {
  return label.replace(/\s*time$/i, "").trim() || label;
}

function timeIcon(label: string) {
  return /cook/i.test(label) ? ChefHat : Clock;
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.5 2 3 5.9 3 10.3c0 2.8 1.6 4.9 3.4 5.9.3.2.5 0 .5-.3l.3-1.2c.1-.4 0-.5-.2-.8-.6-.7-1.1-1.8-1.1-3.3 0-3.2 2.4-6.3 6.4-6.3 3.5 0 5.8 2.1 5.8 4.9 0 3.3-1.5 5.9-3.7 5.9-1.2 0-2.1-1-1.8-2.2.3-1.4.9-2.9.9-4 0-.9-.5-1.7-1.5-1.7-1.2 0-2.2 1.3-2.2 2.9 0 1.1.4 1.8.4 1.8s-1.3 5.5-1.5 6.4c-.4 1.7-.1 3.7 0 3.9.1.1.2.1.3 0 .1-.2 1.6-2 2.1-3.7l.8-3c.4.8 1.6 1.5 2.9 1.5 3.8 0 6.5-3.5 6.5-8C21.3 5.6 17.6 2 12 2z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function RecipePrintCard({
  recipe,
  ingredients,
  instructions,
  dietary,
  notes,
  time,
  nutrition,
}: {
  recipe: Recipe;
  ingredients: string[];
  instructions: string[];
  dietary: string[];
  notes: string[];
  time: RecipeFact[];
  nutrition: RecipeFact[];
}) {
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (ingredients.length === 0 && instructions.length === 0) return null;

  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const shareUrl = `https://themealprepideas.com/recipes/${recipe.slug}`;

  const handlePin = () => {
    const url = encodeURIComponent(shareUrl);
    const description = encodeURIComponent(`${recipe.title} — The Meal Prep Ideas`);
    const media = recipe.image ? `&media=${encodeURIComponent(recipe.image)}` : "";
    window.open(`https://www.pinterest.com/pin/create/button/?url=${url}${media}&description=${description}`, "_blank", "width=750,height=550");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Recipe: ${recipe.title}`);
    const body = encodeURIComponent(`Thought you'd like this one — ${recipe.title} from The Meal Prep Ideas.\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const stats =
    time.length > 0
      ? time.map((fact) => ({ icon: timeIcon(fact.label), label: shortTimeLabel(fact.label), value: fact.value }))
      : [
          { icon: Clock, label: "Prep", value: formatMinutes(recipe.prepTimeMinutes) },
          { icon: ChefHat, label: "Cook", value: formatMinutes(recipe.cookTimeMinutes) },
          { icon: Clock, label: "Total", value: formatMinutes(recipe.totalTimeMinutes) },
        ].filter((s): s is { icon: typeof Clock; label: string; value: string } => Boolean(s.value));

  const servingsBase = recipe.servings ?? null;
  const servingsLabel = servingsBase
    ? `Makes ${servingsBase * multiplier}`
    : recipe.servingsLabel ?? undefined;

  const nutritionStats =
    nutrition.length > 0
      ? nutrition.map((fact) => ({ label: fact.label, value: fact.value }))
      : [
          { label: "Calories", value: recipe.calories != null ? `${recipe.calories}` : null },
          { label: "Protein", value: recipe.proteinGrams != null ? `${recipe.proteinGrams}g` : null },
          { label: "Carbs", value: recipe.carbsGrams != null ? `${recipe.carbsGrams}g` : null },
          { label: "Fat", value: recipe.fatGrams != null ? `${recipe.fatGrams}g` : null },
        ].filter((s): s is { label: string; value: string } => Boolean(s.value));
  const hasNutrition = nutritionStats.length > 0;
  const progressPct = ingredients.length ? Math.round((checked.size / ingredients.length) * 100) : 0;
  const displayRating = recipe.rating ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="recipe-print-card overflow-hidden rounded-[22px] border border-brand-border/70 bg-white shadow-[0_24px_54px_-28px_rgba(56,38,12,0.28)]"
    >
      {/* Header */}
      <div className="grid grid-cols-1 gap-7 p-7 sm:grid-cols-[1fr_190px] sm:p-8">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i <= Math.round(displayRating) ? "fill-brand-orange text-brand-orange" : "fill-none text-brand-orange/50"
                  )}
                />
              ))}
            </span>
            <span className="text-[13px] font-medium tabular-nums text-brand-light">
              {recipe.ratingCount > 0
                ? `${displayRating.toFixed(1)} · ${recipe.ratingCount} rating${recipe.ratingCount === 1 ? "" : "s"}`
                : "No ratings yet"}
            </span>
          </div>

          <h3 className="mb-3 text-balance font-display text-[26px] leading-[1.15] text-brand-heading sm:text-[30px]">{recipe.title}</h3>
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-brand-body">{recipe.description}</p>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-[16px] bg-brand-gray">
          {recipe.image && (
            <Image src={recipe.image} alt={recipe.imageAlt} fill sizes="190px" className="object-cover" />
          )}
          <span className="absolute bottom-2.5 right-2.5 flex size-14 animate-float items-center justify-center rounded-full border border-brand-border bg-white text-center font-display text-[8px] leading-[1.15] text-brand-primary-dark shadow-[0_6px_14px_-6px_rgba(0,0,0,.25)]">
            the meal
            <br />
            prep ideas
          </span>
        </div>
      </div>

      {/* Stat bar */}
      {(stats.length > 0 || servingsLabel) && (
        <div className="flex flex-wrap bg-gradient-to-br from-brand-heading to-[#2A2115]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-[100px] flex-1 flex-col items-center justify-center gap-1 border-r border-white/10 px-3 py-4 last:border-r-0">
              <span className="flex items-center gap-1.5 text-[15px] font-bold tabular-nums text-white">
                <stat.icon className="size-3.5 opacity-70" />
                {stat.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/55">{stat.label}</span>
            </div>
          ))}
          {servingsLabel && (
            <div className="flex min-w-[100px] flex-1 flex-col items-center justify-center gap-1 px-3 py-4">
              <span className="flex items-center gap-1.5 text-[15px] font-bold tabular-nums text-white">
                <Users className="size-3.5 opacity-70" />
                {servingsLabel}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/55">Servings</span>
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="no-print flex flex-wrap gap-2.5 border-b border-brand-border/60 p-5 sm:px-8">
        <button
          type="button"
          onClick={handlePin}
          className="flex items-center gap-1.5 rounded-[12px] border border-brand-orange bg-brand-orange px-4 py-2.5 text-[13px] font-semibold text-[#3A1F00] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-14px_rgba(245,158,11,0.6)] active:translate-y-0 active:scale-95"
        >
          <PinIcon className="size-3.5" />
          Pin for later
        </button>
        <button
          type="button"
          onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="flex items-center gap-1.5 rounded-[12px] border border-brand-border bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-body transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary active:translate-y-0 active:scale-95"
        >
          <Star className="size-3.5" />
          Rate &amp; review
        </button>
        <button
          type="button"
          onClick={handleEmail}
          className="flex items-center gap-1.5 rounded-[12px] border border-brand-border bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-body transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary active:translate-y-0 active:scale-95"
        >
          <Mail className="size-3.5" />
          Email recipe
        </button>
        <Link
          href={`/recipes/${recipe.slug}/print`}
          target="_blank"
          className="flex items-center gap-1.5 rounded-[12px] border border-brand-border bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-body transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary active:translate-y-0 active:scale-95"
        >
          <Printer className="size-3.5" />
          Print recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.3fr]">
        {/* Ingredients */}
        {ingredients.length > 0 && (
          <div className="p-7 sm:border-r sm:border-brand-border/60 sm:p-8">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-display text-xl text-brand-heading">Ingredients</h4>
              <div className="no-print flex overflow-hidden rounded-[9px] border border-brand-border">
                {([1, 2, 3] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMultiplier(m)}
                    className={cn(
                      "border-r border-brand-border px-2.5 py-1.5 text-xs font-bold transition-colors last:border-r-0",
                      multiplier === m ? "bg-brand-primary text-white" : "bg-white text-brand-light hover:text-brand-heading"
                    )}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            {ingredients.length > 1 && (
              <div className="no-print mb-4 flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-gray">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-dark transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
                </div>
                <span className={cn("shrink-0 whitespace-nowrap text-xs font-semibold tabular-nums", checked.size === ingredients.length ? "text-brand-primary-dark" : "text-brand-light")}>
                  {checked.size === ingredients.length ? "All set!" : `${checked.size} of ${ingredients.length} gathered`}
                </span>
              </div>
            )}

            <ul className="flex flex-col gap-0.5">
              {ingredients.map((line, i) => {
                const isChecked = checked.has(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => toggleCheck(i)}
                      className="flex w-full items-start gap-3 rounded-[10px] px-2 py-1.5 text-left transition-colors hover:bg-brand-gray/60"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-[6px] border-[1.6px] transition-colors",
                          isChecked ? "border-brand-primary bg-brand-primary" : "border-brand-border"
                        )}
                      >
                        <Check className={cn("size-3 text-white transition-all duration-200", isChecked ? "scale-100 opacity-100" : "scale-50 opacity-0")} strokeWidth={3} />
                      </span>
                      <span className={cn("text-[14.5px] leading-snug", isChecked ? "text-brand-light line-through" : "text-brand-body")}>
                        {scaleIngredientText(line, multiplier)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {instructions.length > 0 && (
          <div className="p-7 sm:p-8">
            <h4 className="mb-5 font-display text-xl text-brand-heading">How to prepare</h4>
            <ol className="relative flex flex-col gap-[18px] before:absolute before:bottom-1.5 before:left-[12.5px] before:top-1.5 before:w-px before:bg-brand-border">
              {instructions.map((step, i) => (
                <motion.li key={i} {...fadeUp} transition={{ duration: 0.4, delay: (i % 8) * 0.06 }} className="relative flex gap-3.5 text-[14.5px] leading-relaxed text-brand-body">
                  <span className="relative z-[1] mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-brand-primary/12 text-xs font-bold text-brand-primary-dark">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Notes */}
      {notes.length > 0 && (
        <div className="mx-7 mb-1 rounded-[16px] border border-dashed border-brand-border bg-brand-gray/60 p-5 sm:mx-8">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-light">
            <Lightbulb className="size-3.5 text-brand-orange-deep" />
            Good to know
          </p>
          <ul className="flex flex-col gap-2">
            {notes.map((n, i) => (
              <motion.li key={i} {...fadeUp} transition={{ duration: 0.4, delay: (i % 8) * 0.05 }} className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-body">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                {n}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Nutrition */}
      {hasNutrition && (
        <div className="flex flex-wrap gap-6 border-t border-brand-border/60 px-7 py-5 sm:px-8">
          {nutritionStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 font-display text-xl tabular-nums text-brand-heading">
                {/^calor/i.test(stat.label) && <Flame className="size-4 text-brand-orange-deep" />}
                {stat.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-brand-light">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dietary */}
      {dietary.length > 0 && (
        <div className="flex flex-wrap gap-2 px-7 pb-6 sm:px-8">
          {dietary.map((d) => (
            <span key={d} className="rounded-full border border-brand-border bg-brand-primary/10 px-3 py-1.5 text-xs font-semibold text-brand-primary-dark transition-transform hover:-translate-y-0.5">
              {d}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="no-print relative overflow-hidden bg-gradient-to-br from-brand-heading to-[#2A2115] p-7 sm:px-8">
        <span className="pointer-events-none absolute -right-16 -top-24 size-56 animate-float-slow rounded-full bg-brand-orange/20 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg text-white">Made this recipe?</p>
            <p className="mt-0.5 text-[13.5px] text-white/65">
              Tag <span className="font-semibold text-white">@themealprepideas</span> on Instagram — we love seeing what you made.
            </p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-[12px] border border-brand-orange bg-brand-orange px-4 py-2.5 text-[13px] font-semibold text-[#3A1F00] transition-all duration-200 hover:-translate-y-0.5"
          >
            <InstagramIcon className="size-3.5" />
            Tag us
          </a>
        </div>
      </div>
    </motion.div>
  );
}
