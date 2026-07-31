"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { seasonal, cuisines, type Collection } from "@/data/site";

function Row({ title, items }: { title: string; items: Collection[] }) {
  return (
    <div>
      <h3 className="font-display text-2xl text-brand-heading">{title}</h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {items.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <Link
              href={`/categories/${c.slug}`}
              className="group relative flex h-40 items-end overflow-hidden rounded-[20px] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-18px_rgba(17,24,39,0.3)]"
            >
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(min-width: 1024px) 340px, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative z-10 flex w-full items-end justify-between">
                <div>
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-xs text-white/80">{c.count} recipes</p>
                </div>
                <span className="flex size-8 items-center justify-center rounded-full bg-white/90 text-brand-heading transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SeasonalCuisine() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2">
          <Row title="Seasonal Collections" items={seasonal} />
          <Row title="Cuisine Collections" items={cuisines} />
        </div>
      </Container>
    </section>
  );
}
