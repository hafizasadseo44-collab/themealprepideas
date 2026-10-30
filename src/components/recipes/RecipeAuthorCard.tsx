"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Award, Briefcase } from "lucide-react";

type Author = {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  jobTitle?: string | null;
  credentials?: string | null;
  yearsExperience?: number | null;
};

function AuthorInner({ author }: { author: Author }) {
  return (
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <span className="relative shrink-0">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={56}
            height={56}
            className="size-14 rounded-full object-cover ring-2 ring-brand-primary/20 ring-offset-2 transition-all duration-300 group-hover:ring-brand-primary/60"
          />
        ) : (
          <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white shadow-[0_6px_16px_-4px_rgba(63,163,77,0.45)]">
            <ChefHat className="size-6" />
          </span>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-brand-primary-dark ring-2 ring-white">
          <ChefHat className="size-2.5 text-white" />
        </span>
      </span>

      {/* Name + credentials + bio */}
      <div className="min-w-0">
        <p className="font-display text-[17px] leading-tight text-brand-heading transition-colors group-hover:text-brand-primary-dark">
          {author.name}
        </p>
        {(author.jobTitle || author.credentials) && (
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {author.jobTitle && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary-dark">
                <Briefcase className="size-3" />
                {author.jobTitle}
              </span>
            )}
            {author.credentials && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-primary/8 px-2 py-0.5 text-[10px] font-bold text-brand-primary-dark">
                <Award className="size-2.5" />
                {author.credentials}
              </span>
            )}
          </div>
        )}
        {author.bio && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-light">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );
}

export default function RecipeAuthorCard({ author }: { author: Author }) {
  const hasProfile = !!author.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] border border-brand-border/60 bg-gradient-to-br from-brand-cream to-white p-6"
    >
      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-brand-light">
        Written By
      </p>

      {hasProfile ? (
        <Link href={`/authors/${author.id}`} className="group">
          <AuthorInner author={author} />
        </Link>
      ) : (
        <div className="group">
          <AuthorInner author={author} />
        </div>
      )}

      {hasProfile && (
        <Link
          href={`/authors/${author.id}`}
          className="group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary-dark transition-colors hover:text-brand-primary"
        >
          View all recipes by {author.name}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </motion.div>
  );
}
