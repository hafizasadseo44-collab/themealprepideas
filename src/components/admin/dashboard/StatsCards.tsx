"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, PenLine, Clock, Image as ImageIcon } from "lucide-react";
import Counter from "@/components/ui/Counter";

type Stat = {
  label: string;
  value: number;
  icon: typeof FileText;
  href: string;
  accent: string;
  iconBg: string;
};

export default function StatsCards({
  total,
  published,
  draft,
  scheduled,
  mediaCount,
}: {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
  mediaCount: number;
}) {
  const stats: Stat[] = [
    { label: "Total Posts", value: total, icon: FileText, href: "/admin/posts", accent: "text-brand-heading", iconBg: "bg-brand-heading/8" },
    { label: "Published", value: published, icon: CheckCircle2, href: "/admin/posts", accent: "text-brand-primary-dark", iconBg: "bg-brand-primary/12" },
    { label: "Drafts", value: draft, icon: PenLine, href: "/admin/posts", accent: "text-brand-orange-deep", iconBg: "bg-brand-orange/12" },
    { label: "Scheduled", value: scheduled, icon: Clock, href: "/admin/posts", accent: "text-brand-info", iconBg: "bg-brand-info/12" },
    { label: "Media Files", value: mediaCount, icon: ImageIcon, href: "/admin/media", accent: "text-brand-heading", iconBg: "bg-brand-heading/8" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
        >
          <Link
            href={stat.href}
            className="group flex h-full flex-col gap-3 rounded-[18px] border border-brand-border/60 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[0_20px_44px_-20px_rgba(17,24,39,0.2)] sm:p-5"
          >
            <span className={`flex size-10 items-center justify-center rounded-[12px] ${stat.iconBg} ${stat.accent}`}>
              <stat.icon className="size-5" />
            </span>
            <div>
              <p className={`font-display text-2xl ${stat.accent}`}>
                <Counter target={stat.value} />
              </p>
              <p className="mt-0.5 text-xs text-brand-light">{stat.label}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
