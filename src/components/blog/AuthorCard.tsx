"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { authorBios } from "@/data/blog";
import type { BlogPost } from "@/lib/posts/types";

export default function AuthorCard({ author }: { author: BlogPost["author"] }) {
  const bio = author.bio || authorBios[author.name];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="mt-12 flex items-start gap-4 rounded-[20px] border border-brand-border/60 bg-white p-6 sm:items-center"
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-brand-primary/12 sm:size-16">
        {author.avatar ? (
          <Image src={author.avatar} alt={author.name} fill sizes="64px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-xl text-brand-primary-dark">
            {author.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">Written by</p>
        <p className="mt-0.5 font-display text-lg text-brand-heading">{author.name}</p>
        {bio && <p className="mt-1.5 text-sm leading-relaxed text-brand-light">{bio}</p>}
      </div>
    </motion.div>
  );
}
