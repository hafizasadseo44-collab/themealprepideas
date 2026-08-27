"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ChefHat, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import SearchOverlay from "@/components/layout/SearchOverlay";

const navLinks = [
  { label: "Browse Categories", href: "/categories", hasMenu: true },
  { label: "Recipes", href: "/recipes" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
];

const megaMenuGroups = [
  {
    title: "By Meal Type",
    items: [
      { label: "Breakfast", href: "/#breakfast" },
      { label: "Lunch", href: "/#lunch" },
      { label: "Dinner", href: "/#dinner" },
      { label: "Snacks", href: "/#snacks" },
    ],
  },
  {
    title: "By Diet",
    items: [
      { label: "Vegan", href: "/vegan-meal-prep-ideas" },
      { label: "Keto", href: "/keto-meal-prep-ideas" },
      { label: "Low Carb", href: "/categories/low-carb" },
      { label: "Mediterranean", href: "/categories/mediterranean" },
    ],
  },
  {
    title: "By Protein",
    items: [
      { label: "Chicken", href: "/keto-meal-prep-ideas#keto-chicken" },
      { label: "Beef", href: "/keto-meal-prep-ideas#keto-beef" },
      { label: "Salmon", href: "/keto-meal-prep-ideas#keto-fish-seafood" },
      { label: "Tofu", href: "/vegan-meal-prep-ideas#tofu-tempeh" },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] border-b border-brand-border/60"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 md:h-20 md:px-10">
        <Link href="/" className="group flex min-w-0 items-center gap-2 md:gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-brand-primary text-white shadow-[0_6px_16px_-4px_rgba(63,163,77,0.5)] transition-transform duration-300 group-hover:scale-105 md:size-10 md:rounded-[12px]">
            <ChefHat className="size-4 md:size-5" />
          </span>
          <span className="truncate font-display text-base leading-none text-brand-heading sm:text-lg md:text-xl">
            Meal Prep <span className="text-brand-primary-dark">Ideas</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.hasMenu ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="flex items-center gap-1 rounded-full px-4 py-2.5 text-[15px] font-medium text-brand-body transition-colors hover:bg-brand-primary/8 hover:text-brand-primary-dark">
                  {link.label}
                  <ChevronDown className="size-3.5" />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                    >
                      <div className="grid grid-cols-3 gap-6 rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)]">
                        {megaMenuGroups.map((group) => (
                          <div key={group.title}>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-light">
                              {group.title}
                            </p>
                            <ul className="space-y-2">
                              {group.items.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    href={item.href}
                                    className="text-sm text-brand-body transition-colors hover:text-brand-primary-dark"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2.5 text-[15px] font-medium text-brand-body transition-colors hover:bg-brand-primary/8 hover:text-brand-primary-dark"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Search recipes"
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-border/70 bg-white/70 text-brand-body transition-all duration-300 hover:border-brand-primary/50 hover:text-brand-primary-dark md:size-11"
          >
            <Search className="size-4 md:size-[18px]" />
          </button>
          <div className="hidden sm:block">
            <Button href="/recipes" size="md">
              Get Started
            </Button>
          </div>
          <button
            aria-label="Toggle menu"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-border/70 bg-white/70 text-brand-body md:size-11 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4 md:size-5" /> : <Menu className="size-4 md:size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-brand-border/60 bg-white lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-[15px] font-medium text-brand-body hover:bg-brand-primary/8 hover:text-brand-primary-dark"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 sm:hidden">
                <Button href="/recipes" size="md" className="w-full">
                  Get Started
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <SearchOverlay />
    </>
  );
}
