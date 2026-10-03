"use client";

import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";

export default function RecipeEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-brand-border/70 bg-brand-gray/40 px-6 py-14 text-center"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
        <ChefHat className="size-6" />
      </span>
      <p className="font-display text-xl text-brand-heading">We&apos;re still writing this one up</p>
      <p className="max-w-sm text-sm text-brand-light">
        The full ingredients and step-by-step instructions for this recipe are coming soon. Check back shortly!
      </p>
    </motion.div>
  );
}
