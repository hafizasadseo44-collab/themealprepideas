"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookmarkCheck, Settings, LogOut, ChefHat } from "lucide-react";
import { signOutAction } from "@/lib/customers/actions";
import DashboardOverview from "@/components/account/DashboardOverview";
import SavedRecipesPanel from "@/components/account/SavedRecipesPanel";
import AccountSettingsPanel from "@/components/account/AccountSettingsPanel";
import type { Customer } from "@/lib/customers/session";
import type { Recipe } from "@/lib/recipes/types";

type Tab = "overview" | "saved" | "settings";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "saved", label: "Saved Recipes", icon: BookmarkCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DashboardShell({ customer, recipes }: { customer: Customer; recipes: Recipe[] }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="flex items-center gap-2.5 px-1">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-brand-primary text-white">
                <ChefHat className="size-4.5" />
              </span>
              <span className="font-display text-base text-brand-heading">My Account</span>
            </div>

            <nav className="space-y-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className="relative flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left text-sm font-medium transition-colors"
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="account-tab-pill"
                      className="absolute inset-0 rounded-[12px] bg-brand-primary/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <t.icon className={`relative z-10 size-4.5 ${tab === t.id ? "text-brand-primary-dark" : "text-brand-light"}`} />
                  <span className={`relative z-10 ${tab === t.id ? "text-brand-primary-dark" : "text-brand-body"}`}>{t.label}</span>
                </button>
              ))}
            </nav>

            <form action={signOutAction} className="border-t border-brand-border/60 pt-4">
              <input type="hidden" name="next" value="/" />
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left text-sm font-medium text-brand-error transition-colors hover:bg-brand-error/8"
              >
                <LogOut className="size-4.5" />
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Tab bar — mobile/tablet */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-[14px] bg-brand-gray p-1.5 lg:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex shrink-0 items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-white text-brand-primary-dark shadow-sm" : "text-brand-light"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {tab === "overview" && (
                <DashboardOverview customer={customer} recipes={recipes} onViewSaved={() => setTab("saved")} />
              )}
              {tab === "saved" && <SavedRecipesPanel recipes={recipes} />}
              {tab === "settings" && <AccountSettingsPanel customer={customer} />}
            </motion.div>
          </AnimatePresence>

          {/* Sign out — mobile/tablet */}
          <form action={signOutAction} className="mt-8 border-t border-brand-border/60 pt-6 lg:hidden">
            <input type="hidden" name="next" value="/" />
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-semibold text-brand-error transition-colors hover:underline"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
