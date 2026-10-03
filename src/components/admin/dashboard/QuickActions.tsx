"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, FolderKanban, Image as ImageIcon, Users, ArrowRight } from "lucide-react";

const actions = [
  { label: "Write a New Post", description: "Open the article editor", icon: PlusCircle, href: "/admin/posts/new", primary: true },
  { label: "Categories", description: "Organize your topics", icon: FolderKanban, href: "/admin/categories", adminOnly: true },
  { label: "Media Library", description: "Manage uploaded images", icon: ImageIcon, href: "/admin/media" },
  { label: "Users", description: "Invite writers, manage roles", icon: Users, href: "/admin/users", adminOnly: true },
];

export default function QuickActions({ isAdmin }: { isAdmin: boolean }) {
  const visible = actions.filter((a) => !a.adminOnly || isAdmin);

  return (
    <div className="grid grid-cols-1 gap-4">
      {visible.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
          <Link
            href={action.href}
            className={`group flex items-center gap-4 rounded-[18px] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(17,24,39,0.2)] ${
              action.primary
                ? "border-transparent bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white"
                : "border-brand-border/60 bg-white text-brand-heading hover:border-brand-primary/30"
            }`}
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-[12px] ${
                action.primary ? "bg-white/15" : "bg-brand-primary/10 text-brand-primary-dark"
              }`}
            >
              <action.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{action.label}</p>
              <p className={`mt-0.5 truncate text-xs ${action.primary ? "text-white/80" : "text-brand-light"}`}>{action.description}</p>
            </div>
            <ArrowRight className={`size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${action.primary ? "text-white" : "text-brand-light"}`} />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
