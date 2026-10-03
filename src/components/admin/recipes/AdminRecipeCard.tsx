"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Flame, Beef, Star, Pencil, ImageOff, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { isRecipeComplete, type Recipe } from "@/lib/recipes/types";

export default function AdminRecipeCard({
  recipe,
  editHref,
  index = 0,
}: {
  recipe: Recipe;
  editHref: string;
  index?: number;
}) {
  const hasMeta = Boolean(recipe.prepTime || recipe.calories || recipe.protein);
  const complete = isRecipeComplete(recipe);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="group relative rounded-[20px] border border-brand-border/60 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_28px_56px_-24px_rgba(17,24,39,0.22)] md:grid md:grid-cols-[38%_1fr] md:grid-rows-[auto_1fr_auto] md:gap-x-7 md:gap-y-5 md:p-6 md:[grid-template-areas:'photo_head'_'photo_desc'_'photo_actions']"
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
        {recipe.rating != null && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-brand-border/70 bg-brand-gray px-2.5 py-1 text-xs font-bold text-brand-heading">
            <Star className="size-3.5 fill-brand-orange text-brand-orange" />
            {recipe.rating}
          </span>
        )}
      </div>

      {/* Photo */}
      <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-[24px] bg-brand-gray md:mt-0 md:aspect-auto md:h-full md:[grid-area:photo]">
        <span
          className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm",
            recipe.status === "published"
              ? "bg-brand-primary/90 text-white"
              : "bg-white text-brand-heading ring-1 ring-brand-border/70"
          )}
        >
          {recipe.status === "published" ? "Published" : "Draft"}
        </span>
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.imageAlt}
            fill
            sizes="(min-width: 768px) 34vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff className="size-7 text-brand-light" />
          </div>
        )}
      </div>

      {/* Description + meta */}
      <div className="mt-4 md:mt-0 md:flex md:flex-col md:justify-center md:[grid-area:desc]">
        <p className="line-clamp-2 text-[15px] leading-relaxed text-brand-body">{recipe.description}</p>
        {hasMeta && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-light">
            {recipe.prepTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {recipe.prepTime}
              </span>
            )}
            {recipe.calories != null && (
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
        {!complete && (
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange-deep">
            <ListChecks className="size-3.5" /> Needs ingredients &amp; steps
          </span>
        )}
      </div>

      {/* Buttons row */}
      <div className="mt-5 flex items-center gap-3 border-t border-brand-border/60 pt-5 md:mt-0 md:[grid-area:actions]">
        <Link
          href={editHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(63,163,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark hover:shadow-[0_16px_34px_-12px_rgba(63,163,77,0.7)] active:translate-y-0 active:scale-[0.98] md:flex-none md:px-8"
        >
          <Pencil className="size-4" />
          Edit Recipe
        </Link>
      </div>
    </motion.article>
  );
}
