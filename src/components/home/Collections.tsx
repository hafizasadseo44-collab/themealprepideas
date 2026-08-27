"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { collections } from "@/data/site";

export default function Collections() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Explore"
            title="Browse Meal Prep Collections"
            align="left"
            description="Curated recipe collections built around how you actually eat — by goal, protein, and meal type."
            className="mx-0"
          />
          <Button href="/categories" variant="secondary" icon={ArrowUpRight}>
            View All Collections
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Link
                href={`/categories/${c.slug}`}
                className="group block overflow-hidden rounded-[20px] border border-brand-border/60 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-20px_rgba(17,24,39,0.25)]"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-heading backdrop-blur">
                    {c.count} recipes
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-brand-heading">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-light">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                    View Collection
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
