"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, PiggyBank, Users2, Beef, Snowflake } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const icons = [Sparkles, CheckCircle2, PiggyBank, Users2, Beef, Snowflake];

const badges = [
  { title: "Easy to Follow", description: "Step-by-step instructions anyone can prep." },
  { title: "Beginner Friendly", description: "No fancy skills or equipment required." },
  { title: "Budget Friendly", description: "Simple ingredients that stretch further." },
  { title: "Family Friendly", description: "Recipes the whole household will eat." },
  { title: "High Protein Options", description: "Balanced macros for active lifestyles." },
  { title: "Freezer Friendly", description: "Batch it once, eat well all month." },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why Trust Our Recipes"
          title="Built for real kitchens, real schedules"
          description="Every recipe on this site is tested for taste, nutrition, and how well it actually holds up in a container."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group flex items-start gap-4 rounded-[20px] border border-brand-border/60 bg-brand-cream/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:bg-white hover:shadow-[0_20px_40px_-18px_rgba(17,24,39,0.2)]"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-brand-primary text-white transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-brand-heading">{badge.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-brand-light">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
