"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/data/site";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 md:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />

        <div className="mt-12 divide-y divide-brand-border/60 rounded-[20px] border border-brand-border/60">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.question} className="px-6">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-semibold text-brand-heading">{faq.question}</span>
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark transition-transform duration-300",
                      isOpen && "rotate-45"
                    )}
                  >
                    <Plus className="size-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-12 text-sm leading-relaxed text-brand-light">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
