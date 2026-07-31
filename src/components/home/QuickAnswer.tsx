"use client";

import { motion } from "framer-motion";
import { Clock, TrendingUp, Wallet, HeartPulse } from "lucide-react";
import Container from "@/components/ui/Container";

const points = [
  {
    icon: Clock,
    title: "Why it saves time",
    text: "Cooking once and eating four or five times cuts weekly kitchen time dramatically.",
  },
  {
    icon: HeartPulse,
    title: "The benefits",
    text: "Better portion control, fewer takeout meals, and consistent nutrition all week.",
  },
  {
    icon: Wallet,
    title: "Who should meal prep",
    text: "Busy professionals, students, families, and anyone chasing a health or fitness goal.",
  },
  {
    icon: TrendingUp,
    title: "Getting started",
    text: "Pick 3-4 recipes, batch-cook proteins and grains, then portion into containers.",
  },
];

export default function QuickAnswer() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-1.5 text-sm font-semibold text-brand-primary-dark">
              Quick Answer
            </span>
            <h2 className="mt-4 font-display text-[32px] leading-tight text-brand-heading md:text-[40px]">
              What are meal prep ideas?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-body md:text-lg">
              Meal prep ideas are recipes and strategies designed to be cooked
              in advance and portioned into ready-to-eat meals. Instead of
              cooking from scratch every night, you batch-cook proteins,
              grains, and vegetables once — then assemble them into
              balanced meals for the days ahead. It saves time, reduces
              food waste, keeps grocery costs predictable, and makes
              healthy eating the easy default instead of a daily decision.
              Whether your goal is weight loss, muscle gain, or simply
              fewer weeknight dishes, meal prep gives you a repeatable
              system that fits real, busy schedules.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {points.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-[20px] border border-brand-border/60 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_20px_40px_-20px_rgba(17,24,39,0.2)]"
              >
                <span className="flex size-11 items-center justify-center rounded-[14px] bg-brand-primary/10 text-brand-primary-dark">
                  <point.icon className="size-5" />
                </span>
                <p className="mt-4 font-semibold text-brand-heading">{point.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-light">{point.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
