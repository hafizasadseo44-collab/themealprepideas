"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-brand-primary-dark">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-[32px] leading-tight text-balance text-brand-heading md:text-[42px]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-brand-light md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
