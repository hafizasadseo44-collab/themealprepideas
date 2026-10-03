"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookmarkCheck, ArrowUpDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSavedRecipes } from "@/components/account/SavedRecipesProvider";
import SavedRecipeCard from "@/components/account/SavedRecipeCard";
import type { Recipe } from "@/lib/recipes/types";

type SortKey = "recent" | "az" | "rating";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Recently Saved" },
  { value: "az", label: "A–Z" },
  { value: "rating", label: "Top Rated" },
];

export default function SavedRecipesPanel({ recipes }: { recipes: Recipe[] }) {
  const { isSaved } = useSavedRecipes();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const visible = useMemo(() => {
    const stillSaved = recipes.filter((r) => isSaved(r.slug));
    const filtered = query.trim()
      ? stillSaved.filter((r) => r.title.toLowerCase().includes(query.trim().toLowerCase()))
      : stillSaved;

    const sorted = [...filtered];
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "rating") sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted;
  }, [recipes, isSaved, query, sort]);

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-dashed border-brand-border/70 bg-white px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
          <BookmarkCheck className="size-6" />
        </span>
        <div>
          <p className="font-display text-xl text-brand-heading">No saved recipes yet</p>
          <p className="mt-1.5 max-w-sm text-sm text-brand-light">
            Tap the heart on any recipe card to bookmark it — it&apos;ll show up right here.
          </p>
        </div>
        <Button href="/recipes" className="mt-2">
          Browse Recipes
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your saved recipes…"
            className="h-11 w-full rounded-[12px] border border-brand-border bg-white pl-10 pr-4 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto rounded-[12px] bg-brand-gray p-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              className={`flex shrink-0 items-center gap-1.5 rounded-[9px] px-3 py-2 text-xs font-semibold transition-colors ${
                sort === opt.value ? "bg-white text-brand-heading shadow-sm" : "text-brand-light hover:text-brand-heading"
              }`}
            >
              {opt.value === "recent" && <ArrowUpDown className="size-3.5" />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-[16px] border border-dashed border-brand-border/70 bg-white px-5 py-10 text-center text-sm text-brand-light">
          No saved recipes match &quot;{query}&quot;.
        </p>
      ) : (
        <motion.div layout className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((recipe, i) => (
              <SavedRecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
