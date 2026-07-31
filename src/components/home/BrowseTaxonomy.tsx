"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { TaxonomyItem } from "@/data/site";
import { cn } from "@/lib/utils";

export default function BrowseTaxonomy({
  eyebrow,
  title,
  items,
  basePath,
  tinted = false,
}: {
  eyebrow: string;
  title: string;
  items: TaxonomyItem[];
  basePath: string;
  tinted?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-brand-border/60 p-8 md:p-10",
        tinted ? "bg-brand-cream/60" : "bg-white"
      )}
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary-dark">
            {eyebrow}
          </span>
          <h3 className="mt-1.5 font-display text-2xl text-brand-heading">{title}</h3>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {items.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
          >
            <Link
              href={`${basePath}/${item.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-brand-border/70 bg-white px-4 py-2.5 text-sm font-medium text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:bg-brand-primary hover:text-white hover:shadow-md"
            >
              {item.label}
              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
