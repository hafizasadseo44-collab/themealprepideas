"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function WelcomeHeader({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-primary-dark px-6 py-8 sm:px-8"
    >
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="pointer-events-none absolute -bottom-14 left-1/3 size-48 rounded-full bg-brand-orange/25 blur-3xl"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
            <Sparkles className="size-3.5" />
            Welcome back
          </span>
          <h1 className="mt-3 font-display text-[26px] leading-tight text-white sm:text-[30px]">{name} 👋</h1>
          <p className="mt-1.5 text-sm text-white/80">Here&apos;s what&apos;s happening with your blog today.</p>
        </div>

        <Link
          href="/admin/posts/new"
          className="flex shrink-0 items-center gap-2 rounded-[14px] bg-white px-5 py-3 text-sm font-semibold text-brand-primary-dark shadow-lg transition-transform duration-300 hover:scale-105"
        >
          Write New Post
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </motion.div>
  );
}
