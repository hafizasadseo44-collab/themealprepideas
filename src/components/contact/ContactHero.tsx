"use client";

import { motion } from "framer-motion";
import { Mail, Clock, MessageCircleHeart } from "lucide-react";
import Container from "@/components/ui/Container";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden pb-12 pt-10 md:pb-16 md:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 26, 0], y: [0, -18, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-28 left-[10%] h-[380px] w-[380px] rounded-full bg-gradient-to-br from-brand-primary/16 via-brand-orange/8 to-transparent blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -22, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[-100px] top-[120px] h-[260px] w-[260px] rounded-full bg-brand-orange/14 blur-3xl"
        />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary-dark shadow-sm backdrop-blur">
            <MessageCircleHeart className="size-4" />
            Let&apos;s Talk
          </div>

          <h1 className="mt-6 text-balance font-display text-[38px] leading-[1.12] text-brand-heading sm:text-[48px]">
            Got a question, tip, or <span className="text-brand-primary-dark">recipe request?</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-brand-body">
            Whether it&apos;s feedback on a recipe, a partnership idea, or something that just isn&apos;t working —
            drop us a message. A real person reads every one.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2 text-sm text-brand-body">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
                <Mail className="size-3.5" />
              </span>
              info@themealprepideas.com
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-body">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange-deep">
                <Clock className="size-3.5" />
              </span>
              Replies within 1-2 business days
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
