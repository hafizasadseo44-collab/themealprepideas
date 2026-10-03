"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed, Plus } from "lucide-react";
import AddPageModal from "@/components/admin/recipes/AddPageModal";
import type { RecipePage } from "@/lib/recipes/types";

export default function PagesGrid({ pages }: { pages: RecipePage[] }) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page, i) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
          >
            <Link
              href={`/admin/recipes/${page.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-brand-border/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[0_24px_50px_-24px_rgba(17,24,39,0.22)]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-gray">
                {page.coverImageUrl ? (
                  <Image
                    src={page.coverImageUrl}
                    alt={page.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <UtensilsCrossed className="size-8 text-brand-light" />
                  </div>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-heading shadow-sm">
                  {page.recipeCount ?? 0} recipe{page.recipeCount === 1 ? "" : "s"}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1.5 p-5">
                <h3 className="font-display text-lg text-brand-heading">{page.name}</h3>
                {page.description && (
                  <p className="line-clamp-2 text-sm text-brand-light">{page.description}</p>
                )}
                <div className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-brand-primary-dark">
                  Manage recipes
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        <motion.button
          type="button"
          onClick={() => setAddOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: pages.length * 0.06, ease: "easeOut" }}
          className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-brand-border/70 bg-white/60 text-brand-light transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:text-brand-primary-dark hover:shadow-[0_24px_50px_-24px_rgba(17,24,39,0.16)]"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
            <Plus className="size-5" />
          </span>
          <span className="text-sm font-semibold">Add a Page</span>
          <span className="max-w-[220px] text-center text-xs text-brand-light">Register a new site page so its recipes can be managed here</span>
        </motion.button>
      </div>

      {pages.length === 0 && (
        <div className="mt-5 rounded-[20px] border border-dashed border-brand-border/70 bg-white p-10 text-center">
          <UtensilsCrossed className="mx-auto size-8 text-brand-light" />
          <p className="mt-3 text-sm font-medium text-brand-heading">No pages yet</p>
          <p className="mt-1 text-sm text-brand-light">Add your first page above to start managing its recipes.</p>
        </div>
      )}

      <AddPageModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
