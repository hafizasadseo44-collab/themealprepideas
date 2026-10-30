"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Award, Briefcase, Star } from "lucide-react";

type Author = {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  jobTitle?: string | null;
  credentials?: string | null;
  yearsExperience?: number | null;
};

export default function RecipeAuthorCard({ author }: { author: Author }) {
  const hasProfile = !!author.id;
  const initials = author.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  const inner = (
    <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
      {/* Avatar */}
      <div className="relative shrink-0">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={80}
            height={80}
            className="size-20 rounded-full object-cover ring-4 ring-white shadow-[0_8px_24px_-8px_rgba(63,163,77,0.45)] transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white text-xl font-bold shadow-[0_8px_24px_-8px_rgba(63,163,77,0.5)] transition-transform duration-300 group-hover:scale-105">
            {initials || <ChefHat className="size-8" />}
          </span>
        )}
        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-brand-primary-dark ring-2 ring-white shadow">
          <ChefHat className="size-3.5 text-white" />
        </span>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <p className="font-display text-[20px] leading-tight text-brand-heading transition-colors group-hover:text-brand-primary-dark">
          {author.name}
        </p>

        {(author.jobTitle || author.credentials || author.yearsExperience) && (
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {author.jobTitle && (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-primary-dark">
                <Briefcase className="size-3.5" />
                {author.jobTitle}
              </span>
            )}
            {author.credentials && (
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-primary/20 bg-brand-primary/8 px-2.5 py-0.5 text-[11px] font-bold text-brand-primary-dark">
                <Award className="size-3" />
                {author.credentials}
              </span>
            )}
            {author.yearsExperience && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-[11px] font-bold text-brand-orange">
                <Star className="size-3" />
                {author.yearsExperience}+ yrs exp
              </span>
            )}
          </div>
        )}

        {author.bio && (
          <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-brand-light">
            {author.bio}
          </p>
        )}

        {hasProfile && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-primary-dark transition-all group-hover:gap-2.5">
            View all recipes by {author.name}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-brand-primary/15 bg-gradient-to-br from-[#f0faf1] via-white to-brand-cream p-6 shadow-[0_4px_24px_-8px_rgba(63,163,77,0.12)]">
        {/* Decorative blob */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand-primary/6 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-brand-orange/6 blur-2xl" />

        {/* Label */}
        <div className="relative mb-4 flex items-center gap-2">
          <span className="h-px flex-1 bg-gradient-to-r from-brand-primary/30 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary-dark">
            Written By
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-brand-primary/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative">
          {hasProfile ? (
            <Link href={`/authors/${author.id}`} className="group block">
              {inner}
            </Link>
          ) : (
            <div className="group">{inner}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
