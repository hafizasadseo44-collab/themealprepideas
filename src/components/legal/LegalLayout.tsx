"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { List } from "lucide-react";
import Container from "@/components/ui/Container";

export type LegalSection = { id: string; label: string };

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-110px 0px -70% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export default function LegalLayout({
  icon,
  title,
  subtitle,
  lastUpdated,
  sections,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
}) {
  const activeId = useActiveSection(sections.map((s) => s.id));

  return (
    <div className="pb-20 pt-10 md:pb-28 md:pt-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
            {icon}
          </span>
          <h1 className="mt-5 text-balance font-display text-[34px] leading-[1.15] text-brand-heading sm:text-[42px]">{title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-brand-body">{subtitle}</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-light">Last updated: {lastUpdated}</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[20px] border border-brand-border/60 bg-white p-5">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-light">
                <List className="size-3.5" />
                On This Page
              </p>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block rounded-lg px-3 py-2 text-sm leading-snug transition-colors duration-200 ${
                        activeId === section.id
                          ? "bg-brand-primary/10 font-semibold text-brand-primary-dark"
                          : "text-brand-light hover:bg-brand-primary/5 hover:text-brand-heading"
                      }`}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="min-w-0 space-y-10 rounded-[24px] border border-brand-border/60 bg-white p-6 sm:p-10"
          >
            {children}
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
