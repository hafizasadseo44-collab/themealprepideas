"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Flame, Beef, Star, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { featuredRecipes } from "@/data/site";

export default function FeaturedRecipes() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Reader Favorites"
          title="Featured Meal Prep Recipes"
          description="The most-cooked, highest-rated recipes from the collection — tested, timed, and macro-counted."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredRecipes.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
            >
              <Link
                href={`/recipes/${r.slug}`}
                className="group block overflow-hidden rounded-[20px] border border-brand-border/60 bg-brand-cream/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-20px_rgba(17,24,39,0.25)]"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-heading backdrop-blur">
                    <Star className="size-3.5 fill-brand-orange text-brand-orange" />
                    {r.rating}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold leading-snug text-brand-heading">{r.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-light">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {r.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="size-3.5" /> {r.calories}
                    </span>
                    <span className="flex items-center gap-1">
                      <Beef className="size-3.5" /> {r.protein}
                    </span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                    Read Recipe
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/recipes" variant="secondary" size="lg" icon={ArrowRight}>
            See All Recipes
          </Button>
        </div>
      </Container>
    </section>
  );
}
