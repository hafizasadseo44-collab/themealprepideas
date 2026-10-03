"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, Check, Image as ImageIcon, Type, Palette, Users, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import PrintableCard from "@/components/recipes/print/PrintableCard";
import {
  PRINT_THEMES,
  PRINT_TEXT_SIZES,
  PRINT_SECTION_LABELS,
  type PrintThemeKey,
  type PrintTextSize,
  type PrintSectionKey,
} from "@/lib/recipes/printThemes";
import type { Recipe } from "@/lib/recipes/types";
import type { RecipeFact } from "@/lib/recipes/extract";

const STORAGE_KEY = "mpi-print-prefs";

type StoredPrefs = {
  theme: PrintThemeKey;
  textSize: PrintTextSize;
  showImage: boolean;
};

export default function PrintStudio({
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
  const availableSections: PrintSectionKey[] = [
    ingredients.length > 0 ? "ingredients" : null,
    instructions.length > 0 ? "instructions" : null,
    notes.length > 0 ? "notes" : null,
    (nutrition.length > 0 || recipe.calories != null) ? "nutrition" : null,
    (time.length > 0 || recipe.prepTimeMinutes != null || recipe.cookTimeMinutes != null) ? "time" : null,
    dietary.length > 0 ? "dietary" : null,
  ].filter((s): s is PrintSectionKey => s !== null);

  const [visibleSections, setVisibleSections] = useState<Record<PrintSectionKey, boolean>>(() => {
    const initial = {} as Record<PrintSectionKey, boolean>;
    for (const key of availableSections) initial[key] = true;
    return initial;
  });
  const [showImage, setShowImage] = useState(Boolean(recipe.image));
  const [theme, setTheme] = useState<PrintThemeKey>("brand");
  const [textSize, setTextSize] = useState<PrintTextSize>("md");
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [hydrated, setHydrated] = useState(false);

  // Load the viewer's last-used theme/size/image preference (per-browser
  // convenience only) — deliberately done post-mount rather than in a
  // lazy useState initializer, so the server-rendered HTML and the
  // client's first paint always match (no localStorage during SSR).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const prefs = JSON.parse(raw) as Partial<StoredPrefs>;
        if (prefs.theme && prefs.theme in PRINT_THEMES) setTheme(prefs.theme);
        if (prefs.textSize && prefs.textSize in PRINT_TEXT_SIZES) setTextSize(prefs.textSize);
        if (typeof prefs.showImage === "boolean" && recipe.image) setShowImage(prefs.showImage);
      }
    } catch {
      // localStorage unavailable — just use the defaults.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, textSize, showImage } satisfies StoredPrefs));
    } catch {
      // ignore
    }
  }, [theme, textSize, showImage, hydrated]);

  const toggleSection = (key: PrintSectionKey) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="sticky top-0 z-30 border-b border-brand-border/60 bg-white/90 backdrop-blur-sm print:hidden">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-5 py-3.5">
          <Link
            href={`/recipes/${recipe.slug}`}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-body transition-colors hover:text-brand-primary-dark"
          >
            <ArrowLeft className="size-4" />
            Back to Recipe
          </Link>
          <p className="hidden font-display text-base text-brand-heading sm:block">Customize &amp; Print</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-[12px] bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(63,163,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark"
          >
            <Printer className="size-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-5 py-8 lg:grid-cols-[300px_1fr] lg:items-start">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 print:hidden lg:sticky lg:top-24"
        >
          {availableSections.length > 0 && (
            <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
                <ListChecks className="size-4 text-brand-primary-dark" />
                Sections to Include
              </p>
              <div className="space-y-1">
                {availableSections.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSection(key)}
                    className="flex w-full items-center justify-between rounded-[10px] px-2.5 py-2 text-sm text-brand-body transition-colors hover:bg-brand-gray"
                  >
                    {PRINT_SECTION_LABELS[key]}
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-[6px] border-2 transition-colors",
                        visibleSections[key] ? "border-brand-primary bg-brand-primary" : "border-brand-border"
                      )}
                    >
                      <Check className={cn("size-3 text-white transition-opacity", visibleSections[key] ? "opacity-100" : "opacity-0")} strokeWidth={3} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recipe.image && (
            <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
              <button
                type="button"
                onClick={() => setShowImage((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-semibold text-brand-heading"
              >
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="size-4 text-brand-primary-dark" />
                  Include Photo
                </span>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-[6px] border-2 transition-colors",
                    showImage ? "border-brand-primary bg-brand-primary" : "border-brand-border"
                  )}
                >
                  <Check className={cn("size-3 text-white transition-opacity", showImage ? "opacity-100" : "opacity-0")} strokeWidth={3} />
                </span>
              </button>
            </div>
          )}

          {recipe.servings != null && (
            <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
                <Users className="size-4 text-brand-primary-dark" />
                Servings
              </p>
              <div className="flex overflow-hidden rounded-[10px] border border-brand-border">
                {([1, 2, 3] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMultiplier(m)}
                    className={cn(
                      "flex-1 border-r border-brand-border py-2 text-sm font-bold transition-colors last:border-r-0",
                      multiplier === m ? "bg-brand-primary text-white" : "bg-white text-brand-light hover:text-brand-heading"
                    )}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
              <Type className="size-4 text-brand-primary-dark" />
              Text Size
            </p>
            <div className="flex overflow-hidden rounded-[10px] border border-brand-border">
              {(Object.keys(PRINT_TEXT_SIZES) as PrintTextSize[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTextSize(key)}
                  className={cn(
                    "flex-1 border-r border-brand-border py-2 text-sm font-semibold transition-colors last:border-r-0",
                    textSize === key ? "bg-brand-primary text-white" : "bg-white text-brand-light hover:text-brand-heading"
                  )}
                >
                  {PRINT_TEXT_SIZES[key].label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
              <Palette className="size-4 text-brand-primary-dark" />
              Color Theme
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PRINT_THEMES) as PrintThemeKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  className={cn(
                    "flex items-center gap-2 rounded-[10px] border px-3 py-2.5 text-xs font-semibold transition-all duration-200",
                    theme === key ? "border-brand-primary bg-brand-primary/8 text-brand-heading" : "border-brand-border text-brand-body hover:border-brand-primary/40"
                  )}
                >
                  <span className="size-4 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: PRINT_THEMES[key].swatch }} />
                  {PRINT_THEMES[key].label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="print:m-0"
        >
          <PrintableCard
            recipe={recipe}
            ingredients={ingredients}
            instructions={instructions}
            dietary={dietary}
            notes={notes}
            time={time}
            nutrition={nutrition}
            visibleSections={visibleSections}
            showImage={showImage}
            theme={theme}
            textSize={textSize}
            multiplier={multiplier}
          />
        </motion.div>
      </div>
    </div>
  );
}
