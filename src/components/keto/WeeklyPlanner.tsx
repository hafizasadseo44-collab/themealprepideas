"use client";

import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { ketoWeeklyPlan, ketoWeightLossPicks } from "@/data/keto";

export default function WeeklyPlanner() {
  return (
    <section className="border-t border-brand-border/60 py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Plan Your Week"
          title="Keto Meal Prep Ideas for the Week"
          description="A simple 5-day plan built from recipes already in this guide. Prepare a few in larger batches on the weekend and mix them across the week."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 overflow-x-auto rounded-[20px] border border-brand-border/60 bg-white"
        >
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-brand-cream/70">
                <th className="px-5 py-4 font-semibold text-brand-heading">Day</th>
                <th className="px-5 py-4 font-semibold text-brand-orange-deep">Breakfast</th>
                <th className="px-5 py-4 font-semibold text-brand-orange-deep">Lunch</th>
                <th className="px-5 py-4 font-semibold text-brand-orange-deep">Dinner</th>
                <th className="px-5 py-4 font-semibold text-brand-orange-deep">Snack</th>
              </tr>
            </thead>
            <tbody>
              {ketoWeeklyPlan.map((row) => (
                <tr key={row.day} className="border-t border-brand-border/60">
                  <td className="px-5 py-4 font-semibold text-brand-heading">{row.day}</td>
                  <td className="px-5 py-4 text-brand-body">
                    <a href={`#${row.breakfast.slug}`} className="hover:text-brand-orange-deep hover:underline">
                      {row.breakfast.title}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-brand-body">
                    <a href={`#${row.lunch.slug}`} className="hover:text-brand-orange-deep hover:underline">
                      {row.lunch.title}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-brand-body">
                    <a href={`#${row.dinner.slug}`} className="hover:text-brand-orange-deep hover:underline">
                      {row.dinner.title}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-brand-body">
                    <a href={`#${row.snack.slug}`} className="hover:text-brand-orange-deep hover:underline">
                      {row.snack.title}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-10 max-w-3xl rounded-[20px] border border-brand-border/60 bg-brand-cream/40 p-6 md:p-8"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange-deep">
              <TrendingDown className="size-4.5" />
            </span>
            <h3 className="font-display text-lg text-brand-heading md:text-xl">
              Fits a Weight-Loss Plan
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-brand-light">
            You don&apos;t need a separate set of recipes for weight loss — these picks from the guide
            already balance lean protein, non-starchy vegetables, and reasonable portions.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {ketoWeightLossPicks.map((pick) => (
              <a
                key={pick.slug}
                href={`#${pick.slug}`}
                className="rounded-full border border-brand-border/70 bg-white px-4 py-2 text-sm font-medium text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/50 hover:text-brand-orange-deep hover:shadow-md"
              >
                {pick.title}
              </a>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
