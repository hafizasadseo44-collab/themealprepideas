"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { categorySections } from "@/data/site";

const allRecipes = categorySections.flatMap((section) =>
  section.recipes.map((recipe) => ({
    ...recipe,
    category: section.heading,
    categorySlug: section.slug,
  }))
);

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-search", onOpen);
    return () => window.removeEventListener("open-search", onOpen);
  }, []);

  useEffect(() => {
    const onShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allRecipes
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  const goTo = (recipe: (typeof allRecipes)[number]) => {
    setOpen(false);
    setQuery("");
    requestAnimationFrame(() => {
      const el = document.getElementById(recipe.slug);
      const target = el ?? document.getElementById(recipe.categorySlug);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el) {
        el.classList.add("ring-4", "ring-brand-primary/40");
        setTimeout(() => el.classList.remove("ring-4", "ring-brand-primary/40"), 1800);
      }
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-brand-heading/50 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-[20px] border border-brand-border/60 bg-white shadow-[0_40px_80px_-24px_rgba(17,24,39,0.45)]"
          >
            <div className="flex items-center gap-3 border-b border-brand-border/60 px-5 py-4">
              <Search className="size-5 shrink-0 text-brand-light" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search 100+ recipes — "chicken", "high protein", "tacos"...'
                aria-label="Search recipes"
                className="h-6 w-full bg-transparent text-[15px] text-brand-heading placeholder:text-brand-light focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="shrink-0 text-brand-light transition-colors hover:text-brand-heading"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query.trim() === "" && (
                <p className="px-4 py-10 text-center text-sm text-brand-light">
                  Start typing to search every recipe on the site.
                </p>
              )}
              {query.trim() !== "" && results.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-brand-light">
                  No recipes found for &ldquo;{query}&rdquo;.
                </p>
              )}
              {results.map((recipe) => (
                <button
                  key={`${recipe.categorySlug}-${recipe.slug}`}
                  type="button"
                  onClick={() => goTo(recipe)}
                  className="flex w-full items-center gap-3 rounded-[14px] p-2.5 text-left transition-colors hover:bg-brand-cream/70"
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-[10px]">
                    <Image src={recipe.image} alt={recipe.title} fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-brand-heading">{recipe.title}</span>
                    <span className="block text-xs text-brand-light">{recipe.category}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
