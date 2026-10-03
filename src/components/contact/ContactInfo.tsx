"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronDown, UtensilsCrossed, BookOpen, LayoutGrid } from "lucide-react";

const faqs = [
  {
    q: "How fast will I hear back?",
    a: "We read every message and reply within 1-2 business days. Recipe-specific questions sometimes take a little longer if we need to re-test something.",
  },
  {
    q: "Can I request a recipe?",
    a: "Yes — pick \"Recipe Request\" as the subject and tell us what you're craving. We can't promise every request makes it onto the site, but we read all of them.",
  },
  {
    q: "I found an error in a recipe. What do I do?",
    a: "Please send it our way with \"Something's Not Working\" as the subject — include the recipe name and what seemed off. We fix these fast.",
  },
  {
    q: "Do you accept guest posts or partnerships?",
    a: "Select \"Partnership / Press\" and tell us a bit about what you have in mind.",
  },
];

const quickLinks = [
  { label: "Browse Recipes", href: "/recipes", icon: UtensilsCrossed },
  { label: "Read the Blog", href: "/blog", icon: BookOpen },
  { label: "All Categories", href: "/categories", icon: LayoutGrid },
];

export default function ContactInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-[22px] bg-[linear-gradient(135deg,var(--color-brand-primary-dark),var(--color-brand-primary)_60%,var(--color-brand-orange-deep))] p-6 text-white"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
          <Mail className="size-5" />
        </span>
        <p className="mt-4 text-sm text-white/75">Prefer email directly?</p>
        <a href="mailto:info@themealprepideas.com" className="mt-1 block break-words font-display text-lg hover:underline">
          info@themealprepideas.com
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-[22px] border border-brand-border/60 bg-white p-6"
      >
        <p className="mb-4 text-sm font-semibold text-brand-heading">While you&apos;re here</p>
        <div className="space-y-1.5">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-sm font-medium text-brand-body transition-colors hover:bg-brand-primary/8 hover:text-brand-primary-dark"
            >
              <link.icon className="size-4 text-brand-light transition-colors group-hover:text-brand-primary-dark" />
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="rounded-[22px] border border-brand-border/60 bg-white p-6"
      >
        <p className="mb-2 text-sm font-semibold text-brand-heading">Quick Answers</p>
        <div className="divide-y divide-brand-border/50">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span className="text-sm font-medium text-brand-heading">{faq.q}</span>
                  <ChevronDown className={`size-4 shrink-0 text-brand-light transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2.5 text-sm leading-relaxed text-brand-light">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
