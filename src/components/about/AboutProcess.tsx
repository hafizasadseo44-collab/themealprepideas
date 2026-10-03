"use client";

import { motion } from "framer-motion";
import { ClipboardList, ChefHat, Camera, Send } from "lucide-react";
import Container from "@/components/ui/Container";

const steps = [
  { icon: ClipboardList, title: "We Plan It", text: "Every recipe starts from a real problem — a busy morning, a picky family, a diet that's hard to stick to." },
  { icon: ChefHat, title: "We Cook It", text: "We make it in a normal kitchen, adjust the steps that don't work, and time everything honestly." },
  { icon: Camera, title: "We Shoot It", text: "Real photos of the actual dish, not a stand-in. What you see is exactly what lands on your counter." },
  { icon: Send, title: "You Try It", text: "You cook it, rate it, and tell us what you'd change — that feedback shapes what we publish next." },
];

export default function AboutProcess() {
  return (
    <section className="border-t border-brand-border/60 py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-brand-primary-dark">Behind Every Recipe</p>
          <h2 className="mt-3 text-balance font-display text-[30px] leading-[1.15] text-brand-heading sm:text-[38px]">
            From our kitchen to your meal prep Sunday
          </h2>
        </motion.div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-brand-border)_0,var(--color-brand-border)_8px,transparent_8px,transparent_16px)] lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto flex size-14 items-center justify-center rounded-full bg-white ring-4 ring-brand-cream">
                <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white shadow-[0_12px_28px_-10px_rgba(63,163,77,0.55)]">
                  <step.icon className="size-6" />
                </span>
                <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-brand-orange-deep text-[11px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg text-brand-heading">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed text-brand-light">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
