"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { byDiet, byMealType } from "@/data/site";

const footerNav = [
  { label: "Recipes", href: "/recipes" },
  { label: "Collections", href: "/categories" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

// Only Vegan and Keto have dedicated pages today — every other diet/meal-type
// falls back to the matching, always-real anchor section on /categories
// instead of a slug-guessed route that doesn't exist yet.
const dietOverrides: Record<string, string> = {
  vegan: "/vegan-meal-prep-ideas",
  keto: "/keto-meal-prep-ideas",
};

const mealTypeAnchors = new Set(["breakfast", "lunch", "dinner", "snacks", "bowls"]);

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/account/login" || pathname === "/account/signup") return null;
  if (pathname?.endsWith("/print") && pathname?.startsWith("/recipes/")) return null;

  return (
    <footer className="border-t border-brand-border/60 bg-white">
      <div className="h-[3px] w-full bg-[linear-gradient(90deg,var(--color-brand-primary),var(--color-brand-orange),var(--color-brand-primary-dark))] bg-[length:200%_100%] opacity-80" />

      {/* Newsletter / account CTA strip */}
      <div className="border-b border-brand-border/60 bg-brand-cream/50">
        <Container className="flex flex-col items-center justify-between gap-5 py-8 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3 text-center sm:text-left"
          >
            <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark sm:flex">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="font-display text-lg text-brand-heading">Never miss a new recipe</p>
              <p className="text-sm text-brand-light">Create a free account and choose what lands in your inbox.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <Button href="/account/signup" icon={ArrowRight}>
              Create Free Account
            </Button>
          </motion.div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="col-span-2"
          >
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-brand-primary text-white">
                <ChefHat className="size-5" />
              </span>
              <span className="font-display text-xl text-brand-heading">
                The Meal Prep <span className="text-brand-primary-dark">Ideas</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-light">
              Premium, easy meal prep ideas and recipes for every goal, diet, and
              schedule — built to make healthy eating simple.
            </p>
          </motion.div>

          {[
            {
              title: "Navigate",
              items: footerNav.map((item) => ({ label: item.label, href: item.href })),
            },
            {
              title: "By Diet",
              items: byDiet.slice(0, 5).map((item) => ({
                label: item.label,
                href: dietOverrides[item.slug] ?? "/categories#diets",
              })),
            },
            {
              title: "By Meal Type",
              items: byMealType.slice(0, 5).map((item) => ({
                label: item.label,
                href: mealTypeAnchors.has(item.slug) ? `/#${item.slug}` : "/categories#meal-types",
              })),
            },
          ].map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.06 * (i + 1) }}
            >
              <p className="mb-4 text-sm font-semibold text-brand-heading">{col.title}</p>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-brand-light transition-colors hover:text-brand-primary-dark"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-brand-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-brand-light">
            © {new Date().getFullYear()} The Meal Prep Ideas. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-brand-light transition-colors hover:text-brand-primary-dark"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
