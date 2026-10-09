"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ChefHat, Users, Printer, ArrowDown, UtensilsCrossed } from "lucide-react";
import { formatMinutes } from "@/lib/recipes/types";
import type { Recipe } from "@/lib/recipes/types";

function scrollToRecipe() {
  document.getElementById("recipe-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function RecipeSidebar({ recipe, related = [] }: { recipe: Recipe; related?: Recipe[] }) {
  const facts = [
    { icon: Clock, label: "Prep Time", value: formatMinutes(recipe.prepTimeMinutes) },
    { icon: ChefHat, label: "Cook Time", value: formatMinutes(recipe.cookTimeMinutes) },
    { icon: Clock, label: "Total Time", value: formatMinutes(recipe.totalTimeMinutes) },
    { icon: Users, label: "Servings", value: recipe.servingsLabel ?? (recipe.servings ? `${recipe.servings}` : undefined) },
  ].filter((f): f is { icon: typeof Clock; label: string; value: string } => Boolean(f.value));

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 space-y-5">
        {/* At a glance */}
        {facts.length > 0 && (
          <div className="overflow-hidden rounded-[20px] border border-brand-border/60 bg-white shadow-[0_18px_40px_-28px_rgba(28,26,22,0.35)]">
            <div className="bg-brand-primary/8 px-5 py-3.5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary-dark">
                <UtensilsCrossed className="size-3.5" />
                Recipe At a Glance
              </p>
            </div>
            <dl className="space-y-1 p-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-3 rounded-[12px] px-2.5 py-2 text-sm transition-colors hover:bg-brand-gray"
                >
                  <dt className="flex items-center gap-2 text-brand-light">
                    <span className="flex size-7 items-center justify-center rounded-[9px] bg-brand-primary/10 text-brand-primary-dark">
                      <fact.icon className="size-3.5" />
                    </span>
                    {fact.label}
                  </dt>
                  <dd className="font-semibold text-brand-heading">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Quick actions */}
        <div className="rounded-[20px] border border-brand-border/60 bg-white p-3 shadow-[0_18px_40px_-28px_rgba(28,26,22,0.35)]">
          <button
            type="button"
            onClick={scrollToRecipe}
            className="flex w-full items-center gap-2.5 rounded-[12px] bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark"
          >
            <ArrowDown className="size-4" />
            Jump to Recipe
          </button>
          <Link
            href={`/recipes/${recipe.slug}/print`}
            target="_blank"
            className="mt-2 flex w-full items-center gap-2.5 rounded-[12px] border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-heading transition-colors hover:border-brand-primary/40 hover:bg-brand-gray"
          >
            <Printer className="size-4 text-brand-primary-dark" />
            Print / Save as PDF
          </Link>
        </div>

        {/* More recipes */}
        {related.length > 0 && (
          <div className="rounded-[20px] border border-brand-border/60 bg-white p-4 shadow-[0_18px_40px_-28px_rgba(28,26,22,0.35)]">
            <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-brand-light">More Recipes</p>
            <ul className="space-y-1">
              {related.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/recipes/${r.slug}`}
                    className="group flex items-center gap-3 rounded-[14px] p-2 transition-colors hover:bg-brand-gray"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-[11px] bg-brand-gray">
                      {r.image && (
                        <Image
                          src={r.image}
                          alt={r.imageAlt || r.title}
                          fill
                          sizes="56px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-brand-heading group-hover:text-brand-primary-dark">
                        {r.title}
                      </span>
                      {formatMinutes(r.totalTimeMinutes) && (
                        <span className="mt-1 flex items-center gap-1 text-xs text-brand-light">
                          <Clock className="size-3" />
                          {formatMinutes(r.totalTimeMinutes)}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
