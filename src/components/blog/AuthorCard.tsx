"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { authorBios } from "@/data/blog";
import type { BlogPost } from "@/lib/posts/types";

export default function AuthorCard({ author, authorId }: { author: BlogPost["author"]; authorId?: string | null }) {
  const bio = author.bio || authorBios[author.name];

  const inner = (
    <div className="flex items-start gap-4 sm:items-center">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-brand-primary/12 sm:size-16">
        {author.avatar ? (
          <Image src={author.avatar} alt={author.name} fill sizes="64px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-xl text-brand-primary-dark">
            {author.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">Written by</p>
        <p className={`mt-0.5 font-display text-lg text-brand-heading ${authorId ? "transition-colors group-hover:text-brand-primary-dark" : ""}`}>
          {author.name}
        </p>
        {bio && <p className="mt-1.5 text-sm leading-relaxed text-brand-light">{bio}</p>}
        {authorId && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-primary-dark transition-all group-hover:gap-2">
            View all recipes <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="relative mt-12 overflow-hidden rounded-[20px] border border-brand-border/60 bg-gradient-to-br from-[#f0faf1] via-white to-brand-cream shadow-sm"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand-primary/6 blur-2xl" />
      <div className="relative p-6">
        {authorId ? (
          <Link href={`/authors/${authorId}`} className="group block">
            {inner}
          </Link>
        ) : inner}
      </div>
    </motion.div>
  );
}
