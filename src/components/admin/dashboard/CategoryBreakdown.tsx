"use client";

import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

export default function CategoryBreakdown({ categories }: { categories: { name: string; count: number }[] }) {
  const max = Math.max(1, ...categories.map((c) => c.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-[18px] border border-brand-border/60 bg-white p-5"
    >
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-heading">
        <PieChart className="size-4 text-brand-primary-dark" />
        Posts by Category
      </p>

      {categories.length === 0 ? (
        <p className="py-6 text-center text-sm text-brand-light">No categorized posts yet.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={cat.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-brand-body">{cat.name}</span>
                <span className="text-brand-light">{cat.count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.count / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-dark"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
