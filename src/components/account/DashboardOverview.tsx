"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookmarkCheck, CalendarDays, LayoutGrid, ArrowRight, UtensilsCrossed, Leaf, Flame, ChevronRight, Clock, Star } from "lucide-react";
import { useSavedRecipes } from "@/components/account/SavedRecipesProvider";
import { formatMinutes } from "@/lib/recipes/types";
import type { Recipe } from "@/lib/recipes/types";
import type { Customer } from "@/lib/customers/session";

const quickLinks = [
  { label: "All Recipes", href: "/recipes", icon: UtensilsCrossed, tint: "from-brand-primary/15 to-brand-primary/5" },
  { label: "Vegan Ideas", href: "/vegan-meal-prep-ideas", icon: Leaf, tint: "from-emerald-500/15 to-emerald-500/5" },
  { label: "Keto Ideas", href: "/keto-meal-prep-ideas", icon: Flame, tint: "from-brand-orange/20 to-brand-orange/5" },
  { label: "Categories", href: "/categories", icon: LayoutGrid, tint: "from-sky-500/15 to-sky-500/5" },
];

function memberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function DashboardOverview({
  customer,
  recipes,
  onViewSaved,
}: {
  customer: Customer;
  recipes: Recipe[];
  onViewSaved: () => void;
}) {
  const { isSaved } = useSavedRecipes();
  const savedNow = useMemo(() => recipes.filter((r) => isSaved(r.slug)), [recipes, isSaved]);
  const collections = useMemo(() => new Set(savedNow.map((r) => r.pageName).filter(Boolean)).size, [savedNow]);

  const totalPrepMinutes = useMemo(
    () => savedNow.reduce((sum, r) => sum + (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0), 0),
    [savedNow]
  );

  const avgRating = useMemo(() => {
    const rated = savedNow.filter((r) => r.rating != null);
    if (rated.length === 0) return null;
    return rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length;
  }, [savedNow]);

  const stats = [
    { label: "Saved Recipes", value: String(savedNow.length), icon: BookmarkCheck, tint: "bg-brand-primary/10 text-brand-primary-dark" },
    { label: "Collections", value: String(collections), icon: LayoutGrid, tint: "bg-sky-500/10 text-sky-600" },
    {
      label: "Total Cook Time",
      value: totalPrepMinutes > 0 ? formatMinutes(totalPrepMinutes) || "0 min" : "—",
      icon: Clock,
      tint: "bg-brand-orange/15 text-brand-orange-deep",
    },
    {
      label: "Avg. Rating",
      value: avgRating != null ? avgRating.toFixed(1) : "—",
      icon: Star,
      tint: "bg-amber-400/15 text-amber-600",
    },
    { label: "Member Since", value: memberSince(customer.created_at), icon: CalendarDays, tint: "bg-violet-500/10 text-violet-600" },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,var(--color-brand-primary-dark),var(--color-brand-primary)_60%,var(--color-brand-orange-deep))] p-7 text-white sm:p-9"
      >
        <p className="text-sm text-white/75">Welcome back,</p>
        <h1 className="mt-1 font-display text-[28px] leading-tight sm:text-[34px]">{customer.full_name || "there"} 👋</h1>
        <p className="mt-2 max-w-md text-sm text-white/80">
          Here&apos;s a quick look at your cookbook. Bookmark more recipes anytime — they&apos;ll show up here automatically.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            className="flex flex-col gap-3 rounded-[18px] border border-brand-border/60 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-18px_rgba(17,24,39,0.2)] sm:p-5"
          >
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] ${stat.tint}`}>
              <stat.icon className="size-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg text-brand-heading sm:text-xl">{stat.value}</p>
              <p className="text-xs text-brand-light">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-brand-heading">Explore More</h2>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            >
              <Link
                href={link.href}
                className={`group flex h-full flex-col items-start gap-3 rounded-[18px] bg-gradient-to-br ${link.tint} border border-brand-border/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(17,24,39,0.25)]`}
              >
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-white text-brand-primary-dark shadow-sm">
                  <link.icon className="size-4.5" />
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-brand-heading">
                  {link.label}
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {savedNow.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-brand-heading">Recently Saved</h2>
            <button
              type="button"
              onClick={onViewSaved}
              className="flex items-center gap-1 text-sm font-semibold text-brand-primary-dark hover:underline"
            >
              View all
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {savedNow.slice(0, 6).map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="group flex w-56 shrink-0 flex-col gap-2.5 rounded-[16px] border border-brand-border/60 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(17,24,39,0.22)]"
              >
                <div
                  className="aspect-[4/3] w-full rounded-[12px] bg-brand-gray bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
                  style={recipe.image ? { backgroundImage: `url(${recipe.image})` } : undefined}
                />
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-brand-heading">{recipe.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
