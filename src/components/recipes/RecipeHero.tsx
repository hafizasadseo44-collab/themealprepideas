"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import type { Recipe } from "@/lib/recipes/types";

export default function RecipeHero({ recipe }: { recipe: Recipe }) {
  return (
    <section className="pb-8 pt-8 md:pb-12 md:pt-12">
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Link
            href={recipe.pageRoute ?? "/"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-light transition-colors hover:text-brand-primary-dark"
          >
            <ArrowLeft className="size-4" />
            Back to {recipe.pageName ?? "Recipes"}
          </Link>

          {recipe.tag && (
            <span className="mt-6 inline-flex items-center rounded-full bg-brand-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-primary-dark">
              {recipe.tag}
            </span>
          )}

          <h1 className={`max-w-3xl text-balance font-display text-[30px] leading-[1.15] text-brand-heading sm:text-[38px] md:text-[46px] ${recipe.tag ? "mt-4" : "mt-6"}`}>
            {recipe.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-body sm:text-lg">{recipe.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mt-10 h-[240px] w-full overflow-hidden rounded-[24px] bg-brand-gray sm:h-[360px] md:h-[460px]"
        >
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          ) : null}

          {recipe.rating != null && (
            <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-sm font-bold text-brand-heading shadow-lg backdrop-blur">
              <Star className="size-4 fill-brand-orange text-brand-orange" />
              {recipe.rating}
            </span>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
