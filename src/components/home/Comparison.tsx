"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const rows = [
  { metric: "Average cost per meal", prep: "$3 – $5", takeout: "$12 – $18" },
  { metric: "Typical weekly cost (5 dinners)", prep: "$15 – $25", takeout: "$60 – $90" },
  { metric: "Hands-on time per week", prep: "~90 min, one session", takeout: "~10 min ordering + wait" },
  { metric: "Portion & calorie control", prep: "Full control", takeout: "Often oversized" },
  { metric: "Sodium & added fat", prep: "You choose every ingredient", takeout: "Frequently higher" },
  { metric: "Food ready when hungry", prep: "Always, straight from the fridge", takeout: "Depends on delivery time" },
];

export default function Comparison() {
  return (
    <section className="border-t border-brand-border/60 py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why It's Worth It"
          title="Meal Prep vs. Takeout"
          description="Typical weekly estimates for a household cooking five dinners at home. Actual numbers vary by recipe, portion size, and location."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-3xl overflow-x-auto rounded-[20px] border border-brand-border/60 bg-white"
        >
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-brand-cream/70">
                <th className="px-5 py-4 font-semibold text-brand-heading">&nbsp;</th>
                <th className="px-5 py-4 font-semibold text-brand-primary-dark">Meal Prep at Home</th>
                <th className="px-5 py-4 font-semibold text-brand-light">Takeout / Delivery</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.metric} className="border-t border-brand-border/60">
                  <td className="px-5 py-4 font-medium text-brand-heading">{row.metric}</td>
                  <td className="px-5 py-4 font-semibold tabular-nums text-brand-primary-dark">{row.prep}</td>
                  <td className="px-5 py-4 tabular-nums text-brand-light">{row.takeout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Container>
    </section>
  );
}
