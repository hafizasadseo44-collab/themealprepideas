"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, List } from "lucide-react";
import type { Heading } from "@/data/blog";

function useActiveHeading(headings: Heading[]) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-110px 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

function TOCList({ headings, activeId, onNavigate }: { headings: Heading[]; activeId: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {headings.map((h) => (
        <li key={h.id} style={{ paddingLeft: `${Math.max(0, h.level - 2) * 0.9}rem` }}>
          <a
            href={`#${h.id}`}
            onClick={onNavigate}
            className={`block rounded-lg px-3 py-2 text-sm leading-snug transition-colors duration-200 ${
              activeId === h.id
                ? "bg-brand-primary/10 font-semibold text-brand-primary-dark"
                : "text-brand-light hover:bg-brand-primary/5 hover:text-brand-heading"
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function DesktopTOC({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block">
      <div className="sticky top-28 rounded-[20px] border border-brand-border/60 bg-white p-5">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-light">
          <List className="size-3.5" />
          Table of Contents
        </p>
        <TOCList headings={headings} activeId={activeId} />
      </div>
    </div>
  );
}

export function MobileTOC({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;

  const active = headings.find((h) => h.id === activeId);

  return (
    <div className="mb-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-[16px] border border-brand-border/70 bg-white px-4 py-3.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-brand-heading">
          <List className="size-4 shrink-0 text-brand-primary-dark" />
          <span className="truncate">{active ? active.text : "Table of Contents"}</span>
        </span>
        <ChevronDown className={`size-4 shrink-0 text-brand-light transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden rounded-b-[16px] border border-t-0 border-brand-border/70 bg-white"
          >
            <div className="p-3">
              <TOCList headings={headings} activeId={activeId} onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
