"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { byDiet, byMealType, SITE_SOCIALS } from "@/data/site";
import AskAiSection from "./AskAiSection";

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

        <div className="mt-16">
          <AskAiSection />
        </div>

        {/* Social links */}
        <div className="mt-10 flex items-center justify-center gap-3 border-t border-brand-border/60 pt-8">
          {[
            { href: SITE_SOCIALS.instagram, label: "Instagram", icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            )},
            { href: SITE_SOCIALS.pinterest, label: "Pinterest", icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
            )},
            { href: SITE_SOCIALS.facebook, label: "Facebook", icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            )},
            { href: SITE_SOCIALS.twitter, label: "X / Twitter", icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.261 5.634 5.903-5.634Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            )},
          ].map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-9 items-center justify-center rounded-full border border-brand-border/60 text-brand-light transition-colors hover:border-brand-primary/40 hover:bg-brand-primary/8 hover:text-brand-primary-dark"
            >
              {icon}
            </a>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
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
