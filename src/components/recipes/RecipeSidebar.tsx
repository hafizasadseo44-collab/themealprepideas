"use client";

import { Clock, ChefHat, Users } from "lucide-react";
import { formatMinutes } from "@/lib/recipes/types";
import type { Recipe } from "@/lib/recipes/types";

export default function RecipeSidebar({ recipe }: { recipe: Recipe }) {
  const facts = [
    { icon: Clock, label: "Prep Time", value: formatMinutes(recipe.prepTimeMinutes) },
    { icon: ChefHat, label: "Cook Time", value: formatMinutes(recipe.cookTimeMinutes) },
    { icon: Clock, label: "Total Time", value: formatMinutes(recipe.totalTimeMinutes) },
    { icon: Users, label: "Servings", value: recipe.servingsLabel ?? (recipe.servings ? `${recipe.servings}` : undefined) },
  ].filter((f) => f.value);

  if (facts.length === 0) return null;

  return (
    <div className="hidden lg:block">
      <div className="sticky top-28 space-y-4">
        <div className="rounded-[20px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-light">Recipe At a Glance</p>
          <dl className="space-y-2.5">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between gap-3 text-sm">
                <dt className="flex items-center gap-1.5 text-brand-light">
                  <fact.icon className="size-3.5" />
                  {fact.label}
                </dt>
                <dd className="font-semibold text-brand-heading">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
