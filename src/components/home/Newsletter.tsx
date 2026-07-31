"use client";

import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-primary-dark px-8 py-16 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-brand-orange/20 blur-3xl" />

          <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
            <Mail className="size-6" />
          </span>

          <h2 className="relative mt-6 font-display text-[32px] leading-tight text-white md:text-[40px]">
            Get Your Free 7-Day Meal Prep Plan
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/85">
            Join 50,000+ subscribers getting weekly meal prep ideas, shopping
            lists, and time-saving tips straight to their inbox.
          </p>

          <form className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-[52px] w-full rounded-[14px] border-0 bg-white px-5 text-[15px] text-brand-heading placeholder:text-brand-light focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button type="submit" variant="dark" size="lg" className="shrink-0 !bg-white !text-brand-primary-dark hover:!bg-white/90">
              Send My Plan
            </Button>
          </form>

          <div className="relative mt-5 flex items-center justify-center gap-2 text-sm text-white/80">
            <CheckCircle2 className="size-4" />
            No spam. Unsubscribe anytime.
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
