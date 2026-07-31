"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { tips } from "@/data/site";

export default function Tips() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative h-[380px] w-full overflow-hidden rounded-[24px] shadow-[0_30px_60px_-24px_rgba(17,24,39,0.3)] md:h-[440px]">
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
              alt="Meal prep containers organized on a wooden table"
              fill
              sizes="(min-width: 1024px) 540px, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow="Meal Prep Tips"
              title="Five habits that make prep day painless"
              align="left"
              className="mx-0"
            />
            <div className="mt-8 space-y-5">
              {tips.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex gap-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 font-display text-base text-brand-primary-dark">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-brand-heading">{tip.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-brand-light">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
