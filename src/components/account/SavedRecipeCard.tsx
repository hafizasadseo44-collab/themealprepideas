"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavedRecipes } from "@/components/account/SavedRecipesProvider";
import type { Recipe } from "@/lib/recipes/types";

export default function SavedRecipeCard({ recipe, index = 0 }: { recipe: Recipe; index?: number }) {
  const { toggle } = useSavedRecipes();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group overflow-hidden rounded-[20px] border border-brand-border/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_28px_56px_-24px_rgba(17,24,39,0.22)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-gray">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.imageAlt || recipe.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-light">
            <Clock className="size-8" />
          </div>
        )}

        {recipe.pageName && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-primary-dark backdrop-blur-sm">
            {recipe.pageName}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggle(recipe.slug)}
          aria-label="Remove from saved recipes"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-brand-orange-deep shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white"
        >
          <Heart className="size-4 fill-brand-orange-deep" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-display text-[17px] leading-snug text-brand-heading">{recipe.title}</h3>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-light">
          {recipe.rating != null && recipe.ratingCount > 0 && (
            <span className="flex items-center gap-1 font-semibold text-brand-heading">
              <Star className="size-3.5 fill-brand-orange text-brand-orange" />
              {recipe.rating.toFixed(1)}
              <span className="font-normal text-brand-light">({recipe.ratingCount})</span>
            </span>
          )}
          {recipe.prepTimeMinutes != null && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {recipe.prepTimeMinutes}m
            </span>
          )}
        </div>

        <Link
          href={`/recipes/${recipe.slug}`}
          className={cn(
            "mt-4 flex items-center justify-center gap-1.5 rounded-[12px] bg-brand-primary/8 px-4 py-2.5 text-sm font-semibold text-brand-primary-dark transition-all duration-300",
            "hover:bg-brand-primary hover:text-white"
          )}
        >
          View Recipe
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
