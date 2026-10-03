"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookmarkCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function AboutCTA() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,var(--color-brand-primary-dark),var(--color-brand-primary)_55%,var(--color-brand-orange-deep))] px-8 py-14 text-center sm:px-14 sm:py-20"
        >
          <motion.div
            aria-hidden
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <motion.div
            aria-hidden
            animate={{ x: [0, -24, 0], y: [0, -20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="pointer-events-none absolute -bottom-24 -right-10 size-80 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-xl">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
              <BookmarkCheck className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-[28px] leading-tight text-white sm:text-[36px]">
              Ready to make meal prep the easy part of your week?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80">
              Browse the full library, save the recipes you want to try, and build a cookbook that actually fits
              your week — free, in a couple of clicks.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/recipes" size="lg" variant="secondary" icon={ArrowRight}>
                Browse Recipes
              </Button>
              <Button href="/account/signup" size="lg" className="bg-white text-brand-primary-dark hover:bg-white/90">
                Create Free Account
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
