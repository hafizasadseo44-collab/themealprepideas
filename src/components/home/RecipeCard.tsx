"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Flame, Beef, Star, ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavedRecipes } from "@/components/account/SavedRecipesProvider";
import type { Recipe } from "@/data/site";

export default function RecipeCard({
  recipe,
  index = 0,
}: {
  recipe: Recipe;
  index?: number;
}) {
  const { isSaved, toggle } = useSavedRecipes();
  const saved = isSaved(recipe.slug);
  const [pop, setPop] = useState(false);

  const hasMeta = Boolean(recipe.prepTime || recipe.calories || recipe.protein);

  return (
    <motion.article
      id={recipe.slug}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="group scroll-mt-28 rounded-[20px] border border-brand-border/60 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_28px_56px_-24px_rgba(17,24,39,0.22)] md:grid md:grid-cols-[38%_1fr] md:grid-rows-[auto_1fr_auto] md:gap-x-7 md:gap-y-5 md:p-6 md:[grid-template-areas:'photo_head'_'photo_desc'_'photo_actions']"
    >
      {/* Tag + title + rating */}
      <div className="flex items-start justify-between gap-4 md:[grid-area:head]">
        <div className="min-w-0">
          {recipe.tag && (
            <span className="inline-block rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-primary-dark">
              {recipe.tag}
            </span>
          )}
          <h3 className={cn("font-display text-xl leading-snug text-brand-heading md:text-[26px]", recipe.tag && "mt-2.5")}>
            {recipe.title}
          </h3>
        </div>
        {recipe.rating && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-brand-border/70 bg-brand-gray px-2.5 py-1 text-xs font-bold text-brand-heading">
            <Star className="size-3.5 fill-brand-orange text-brand-orange" />
            {recipe.rating}
          </span>
        )}
      </div>

      {/* Photo */}
      <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-[24px] md:mt-0 md:aspect-auto md:h-full md:[grid-area:photo]">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(min-width: 768px) 34vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Description + meta */}
      <div className="mt-4 md:mt-0 md:flex md:flex-col md:justify-center md:[grid-area:desc]">
        <p className="text-[15px] leading-relaxed text-brand-body">{recipe.description}</p>
        {hasMeta && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-light">
            {recipe.prepTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {recipe.prepTime}
              </span>
            )}
            {recipe.calories && (
              <span className="flex items-center gap-1">
                <Flame className="size-3.5" /> {recipe.calories}
              </span>
            )}
            {recipe.protein && (
              <span className="flex items-center gap-1">
                <Beef className="size-3.5" /> {recipe.protein}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Buttons row */}
      <div className="mt-5 flex items-center gap-3 border-t border-brand-border/60 pt-5 md:mt-0 md:[grid-area:actions]">
        <Link
          href={`/recipes/${recipe.slug}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(63,163,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark hover:shadow-[0_16px_34px_-12px_rgba(63,163,77,0.7)] active:translate-y-0 active:scale-[0.98] md:flex-none md:px-8"
        >
          Get Recipe
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={() => {
            toggle(recipe.slug);
            setPop(false);
            requestAnimationFrame(() => setPop(true));
          }}
          onAnimationEnd={() => setPop(false)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved recipes" : "Save recipe"}
          className={cn(
            "flex items-center gap-2 rounded-[14px] border px-4 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
            saved
              ? "border-brand-orange-deep bg-brand-orange-deep/10 text-brand-orange-deep shadow-[0_12px_28px_-14px_rgba(234,88,12,0.55)]"
              : "border-brand-border bg-brand-gray text-brand-body hover:border-brand-orange hover:text-brand-orange-deep"
          )}
        >
          <Heart
            className={cn("size-4", pop && "animate-pop", saved && "fill-brand-orange-deep")}
          />
          Save Recipe
        </button>
      </div>
    </motion.article>
  );
}
