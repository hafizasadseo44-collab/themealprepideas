"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { containerTypes } from "@/data/site";

export default function Containers() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Gear Up"
          title="Meal Prep Containers Worth Owning"
          description="The right containers make prep day faster and keep meals fresher, longer."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {containerTypes.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group overflow-hidden rounded-[20px] border border-brand-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-18px_rgba(17,24,39,0.25)]"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 280px, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <p className="font-semibold text-brand-heading">{c.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-light">{c.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
