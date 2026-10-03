"use client";

import { motion } from "framer-motion";
import { ChefHat, Heart, BookmarkCheck, Sparkles, Star, Clock } from "lucide-react";

const floatingIcons = [
  { Icon: Heart, top: "14%", left: "12%", delay: 0 },
  { Icon: BookmarkCheck, top: "68%", left: "8%", delay: 0.6 },
  { Icon: Star, top: "22%", left: "80%", delay: 1.1 },
  { Icon: Clock, top: "76%", left: "78%", delay: 0.3 },
  { Icon: Sparkles, top: "46%", left: "88%", delay: 0.9 },
];

const stats = [
  { value: "300+", label: "Real recipes" },
  { value: "50k+", label: "Home cooks" },
  { value: "4.8", label: "Avg. rating" },
];

export default function AuthShowcase({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative hidden h-full w-full overflow-hidden bg-[linear-gradient(160deg,var(--color-brand-primary-dark),var(--color-brand-primary)_55%,var(--color-brand-orange-deep))] lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Ambient blobs */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -24, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-brand-orange/20 blur-3xl"
      />

      {floatingIcons.map(({ Icon, top, left, delay }, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0.7], y: [10, -6, 0, -6] }}
          transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
          className="pointer-events-none absolute flex size-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm"
          style={{ top, left }}
        >
          <Icon className="size-5" />
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center gap-2.5"
      >
        <span className="flex size-10 items-center justify-center rounded-[12px] bg-white/15 text-white backdrop-blur-sm">
          <ChefHat className="size-5" />
        </span>
        <span className="font-display text-xl text-white">Meal Prep Ideas</span>
      </motion.div>

      <div className="relative z-10 max-w-md">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="font-display text-[34px] leading-[1.15] text-white"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-4 text-[15px] leading-relaxed text-white/80"
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3 }}
        className="relative z-10 flex items-center gap-8"
      >
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-2xl text-white">{stat.value}</p>
            <p className="text-xs text-white/70">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
