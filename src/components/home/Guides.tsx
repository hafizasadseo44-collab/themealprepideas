"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { guides } from "@/data/site";

export default function Guides() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Learn" title="Latest Meal Prep Guides" />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {guides.slice(0, 3).map((g, i) => (
            <motion.div
              key={g.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/guides/${g.slug}`}
                className="group block overflow-hidden rounded-[20px] border border-brand-border/60 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-18px_rgba(17,24,39,0.22)]"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary-dark">
                    {g.readTime}
                  </span>
                  <h3 className="mt-2 font-display text-xl leading-snug text-brand-heading">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-light">{g.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                    Read Guide
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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
