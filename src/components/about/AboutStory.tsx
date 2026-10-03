"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Container from "@/components/ui/Container";

const milestones = [
  {
    year: "The Problem",
    title: "Weeknights were a mess",
    text: "Grocery runs after work, no plan, and takeout on repeat. Meal prep sounded great in theory — every recipe online made it look like a part-time job.",
  },
  {
    year: "The Fix",
    title: "One tested recipe at a time",
    text: "We started writing down exactly what actually worked: real prep times, real substitutions, containers that don't leak. No filler, no 45-step processes.",
  },
  {
    year: "Today",
    title: "A library built for real weeks",
    text: "Every recipe here is organized by diet, meal type, and time — so you can find something that fits tonight, not just something that looks nice in a photo.",
  },
];

export default function AboutStory() {
  return (
    <section className="border-t border-brand-border/60 py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
              <Image
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"
                alt="Home kitchen counter with fresh meal prep ingredients"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -right-4 max-w-[260px] rounded-[20px] border border-brand-border/60 bg-white p-5 shadow-[0_24px_50px_-20px_rgba(17,24,39,0.3)] sm:-right-8"
            >
              <Quote className="size-5 text-brand-orange-deep" />
              <p className="mt-2 text-sm leading-relaxed text-brand-body">
                &ldquo;If it doesn&apos;t survive a real Tuesday night, it doesn&apos;t make it onto the site.&rdquo;
              </p>
            </motion.div>
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-brand-primary-dark">How We Got Here</p>
              <h2 className="mt-3 text-balance font-display text-[30px] leading-[1.15] text-brand-heading sm:text-[38px]">
                Built out of frustration with recipes that don&apos;t hold up in real life
              </h2>
            </motion.div>

            <div className="mt-10 space-y-8 border-l-2 border-brand-border/60 pl-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative"
                >
                  <span className="absolute -left-[41px] top-1 flex size-5 items-center justify-center rounded-full border-4 border-white bg-brand-primary shadow-[0_0_0_3px_rgba(63,163,77,0.15)]" />
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-orange-deep">{m.year}</p>
                  <h3 className="mt-1.5 font-display text-xl text-brand-heading">{m.title}</h3>
                  <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-brand-body">{m.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
