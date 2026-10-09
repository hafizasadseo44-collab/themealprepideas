"use client";

import Image from "next/image";
import { Clock, ChefHat, Users, Star, Lightbulb, Flame } from "lucide-react";
import { scaleIngredientText } from "@/lib/recipes/scale";
import { formatMinutes, type Recipe } from "@/lib/recipes/types";
import type { RecipeFact } from "@/lib/recipes/extract";
import { PRINT_THEMES, PRINT_TEXT_SIZES, type PrintThemeKey, type PrintTextSize, type PrintSectionKey } from "@/lib/recipes/printThemes";

function shortTimeLabel(label: string) {
  return label.replace(/\s*time$/i, "").trim() || label;
}
function timeIcon(label: string) {
  return /cook/i.test(label) ? ChefHat : Clock;
}

export default function PrintableCard({
  recipe,
  ingredients,
  instructions,
  dietary,
  notes,
  time,
  nutrition,
  visibleSections,
  showImage,
  theme,
  textSize,
  multiplier,
}: {
  recipe: Recipe;
  ingredients: string[];
  instructions: string[];
  dietary: string[];
  notes: string[];
  time: RecipeFact[];
  nutrition: RecipeFact[];
  visibleSections: Record<PrintSectionKey, boolean>;
  showImage: boolean;
  theme: PrintThemeKey;
  textSize: PrintTextSize;
  multiplier: 1 | 2 | 3;
}) {
  const t = PRINT_THEMES[theme];
  const basePx = PRINT_TEXT_SIZES[textSize].basePx;

  const stats =
    time.length > 0
      ? time.map((fact) => ({ icon: timeIcon(fact.label), label: shortTimeLabel(fact.label), value: fact.value }))
      : [
          { icon: Clock, label: "Prep", value: formatMinutes(recipe.prepTimeMinutes) },
          { icon: ChefHat, label: "Cook", value: formatMinutes(recipe.cookTimeMinutes) },
          { icon: Clock, label: "Total", value: formatMinutes(recipe.totalTimeMinutes) },
        ].filter((s): s is { icon: typeof Clock; label: string; value: string } => Boolean(s.value));

  const nutritionStats =
    nutrition.length > 0
      ? nutrition.map((fact) => ({ label: fact.label, value: fact.value }))
      : [
          { label: "Calories", value: recipe.calories != null ? `${recipe.calories}` : null },
          { label: "Protein", value: recipe.proteinGrams != null ? `${recipe.proteinGrams}g` : null },
          { label: "Carbs", value: recipe.carbsGrams != null ? `${recipe.carbsGrams}g` : null },
          { label: "Fat", value: recipe.fatGrams != null ? `${recipe.fatGrams}g` : null },
        ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  const servingsBase = recipe.servings ?? null;
  const servingsLabel = servingsBase ? `Makes ${servingsBase * multiplier}` : recipe.servingsLabel ?? undefined;
  const displayRating = recipe.rating ?? 0;

  return (
    <div
      id="printable-recipe-card"
      style={{
        fontSize: `${basePx}px`,
        backgroundColor: t.surface,
        color: t.body,
        borderColor: t.border,
      }}
      className="recipe-print-card mx-auto w-full max-w-[720px] overflow-hidden rounded-[18px] border font-sans print:max-w-none print:rounded-none print:border-0"
    >
      {/* Header */}
      <div
        className="p-[1.8em]"
        style={{ borderBottom: `1px solid ${t.border}` }}
      >
        <div className="mb-[0.7em] flex items-center gap-2">
          <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="size-[0.9em]"
                style={{ fill: i <= Math.round(displayRating) ? t.accent : "transparent", color: t.accent, opacity: i <= Math.round(displayRating) ? 1 : 0.4 }}
              />
            ))}
          </span>
          {recipe.ratingCount > 0 && (
            <span className="text-[0.75em] font-medium" style={{ color: t.body, opacity: 0.7 }}>
              {displayRating.toFixed(1)} &middot; {recipe.ratingCount} rating{recipe.ratingCount === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <h1 className="mb-[0.5em] font-serif text-[1.7em] leading-[1.15] font-semibold" style={{ color: t.heading }}>
          {recipe.title}
        </h1>
        <p className="max-w-[60ch] text-[1em] leading-relaxed">{recipe.description}</p>

        {showImage && recipe.image && (
          <div className="relative mt-[1.2em] aspect-[16/9] w-full overflow-hidden rounded-[12px]">
            <Image src={recipe.image} alt={recipe.imageAlt} fill sizes="720px" className="object-cover" />
          </div>
        )}
      </div>

      {/* Stat bar */}
      {((visibleSections.time && stats.length > 0) || servingsLabel) && (
        <div className="flex flex-wrap" style={{ backgroundColor: t.heading }}>
          {visibleSections.time && stats.map((stat) => (
            <div key={stat.label} className="flex min-w-[6em] flex-1 flex-col items-center justify-center gap-0.5 px-[0.8em] py-[1em]" style={{ borderRight: `1px solid rgba(255,255,255,0.12)` }}>
              <span className="flex items-center gap-1 text-[1em] font-bold text-white">
                <stat.icon className="size-[0.85em] opacity-70" />
                {stat.value}
              </span>
              <span className="text-[0.68em] font-medium uppercase tracking-wide text-white/55">{stat.label}</span>
            </div>
          ))}
          {servingsLabel && (
            <div className="flex min-w-[6em] flex-1 flex-col items-center justify-center gap-0.5 px-[0.8em] py-[1em]">
              <span className="flex items-center gap-1 text-[1em] font-bold text-white">
                <Users className="size-[0.85em] opacity-70" />
                {servingsLabel}
              </span>
              <span className="text-[0.68em] font-medium uppercase tracking-wide text-white/55">Servings</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.3fr] print:grid-cols-[1fr_1.3fr]">
        {visibleSections.ingredients && ingredients.length > 0 && (
          <div className="p-[1.8em]" style={{ borderRight: `1px solid ${t.border}` }}>
            <h2 className="mb-[0.9em] font-serif text-[1.25em] font-semibold" style={{ color: t.heading }}>
              Ingredients
            </h2>
            <ul className="flex flex-col gap-[0.5em]">
              {ingredients.map((line, i) => (
                <li key={i} className="flex items-start gap-[0.6em] text-[0.95em] leading-snug">
                  <span className="mt-[0.15em] flex size-[1em] shrink-0 items-center justify-center rounded-[0.25em] border-2" style={{ borderColor: t.accent }} />
                  {scaleIngredientText(line, multiplier)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {visibleSections.instructions && instructions.length > 0 && (
          <div className="p-[1.8em]">
            <h2 className="mb-[0.9em] font-serif text-[1.25em] font-semibold" style={{ color: t.heading }}>
              Instructions
            </h2>
            <ol className="flex flex-col gap-[0.9em]">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-[0.7em] text-[0.95em] leading-relaxed">
                  <span
                    className="flex size-[1.5em] shrink-0 items-center justify-center rounded-full text-[0.75em] font-bold"
                    style={{ backgroundColor: t.accentSoft, color: t.accent }}
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {visibleSections.notes && notes.length > 0 && (
        <div className="p-[1.8em]" style={{ borderTop: `1px solid ${t.border}` }}>
          <h2 className="mb-[0.9em] flex items-center gap-[0.45em] font-serif text-[1.25em] font-semibold" style={{ color: t.heading }}>
            <Lightbulb className="size-[0.9em]" style={{ color: t.accent }} />
            Notes &amp; Tips
          </h2>
          <ul className="flex flex-col gap-[0.6em] rounded-[0.8em] p-[1.2em]" style={{ backgroundColor: t.accentSoft }}>
            {notes.map((n, i) => (
              <li key={i} className="flex items-start gap-[0.6em] text-[0.9em] leading-relaxed">
                <span className="mt-[0.55em] size-[0.35em] shrink-0 rounded-full" style={{ backgroundColor: t.accent }} />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {visibleSections.nutrition && nutritionStats.length > 0 && (
        <div className="flex flex-wrap gap-[1.4em] px-[1.8em] py-[1.1em]" style={{ borderTop: `1px solid ${t.border}` }}>
          {nutritionStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 font-serif text-[1.2em] font-semibold" style={{ color: t.heading }}>
                {/^calor/i.test(stat.label) && <Flame className="size-[0.8em]" style={{ color: t.accent }} />}
                {stat.value}
              </span>
              <span className="text-[0.65em] font-medium uppercase tracking-wide opacity-60">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {visibleSections.dietary && dietary.length > 0 && (
        <div className="flex flex-wrap gap-[0.5em] px-[1.8em] pb-[1.4em]">
          {dietary.map((d) => (
            <span
              key={d}
              className="rounded-full border px-[0.8em] py-[0.35em] text-[0.75em] font-semibold"
              style={{ borderColor: t.border, backgroundColor: t.accentSoft, color: t.accent }}
            >
              {d}
            </span>
          ))}
        </div>
      )}

      <div className="px-[1.8em] py-[1.2em] text-center text-[0.7em]" style={{ borderTop: `1px solid ${t.border}`, color: t.body, opacity: 0.6 }}>
        themealprepideas.com/recipes/{recipe.slug}
      </div>
    </div>
  );
}
