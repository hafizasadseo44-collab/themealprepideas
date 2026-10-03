"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  LayoutDashboard,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Users,
  UtensilsCrossed,
  MessageCircle,
  Mail,
  Menu,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/auth/session";

type NavItem = { label: string; href: string; icon: LucideIcon; roles: Role[] };

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin", "editor"] },
  { label: "Posts", href: "/admin/posts", icon: FileText, roles: ["admin", "editor"] },
  { label: "Recipes", href: "/admin/recipes", icon: UtensilsCrossed, roles: ["admin", "editor"] },
  { label: "Comments", href: "/admin/comments", icon: MessageCircle, roles: ["admin", "editor"] },
  { label: "Messages", href: "/admin/messages", icon: Mail, roles: ["admin", "editor"] },
  { label: "Categories", href: "/admin/categories", icon: FolderKanban, roles: ["admin", "editor"] },
  { label: "Header Menu", href: "/admin/menu", icon: Menu, roles: ["admin", "editor"] },
  { label: "Media", href: "/admin/media", icon: ImageIcon, roles: ["admin", "editor"] },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
];

export default function AdminSidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="flex h-full w-64 flex-col border-r border-brand-border/60 bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-brand-border/60 px-6">
        <span className="flex size-8 items-center justify-center rounded-[10px] bg-brand-primary text-white">
          <ChefHat className="size-4" />
        </span>
        <span className="font-display text-base text-brand-heading">
          Meal Prep <span className="text-brand-primary-dark">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-brand-primary/10 text-brand-primary-dark"
                  : "text-brand-body hover:bg-brand-gray"
              }`}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-border/60 p-4">
        <Link
          href="/"
          target="_blank"
          className="block rounded-[12px] px-3.5 py-2.5 text-sm font-medium text-brand-light transition-colors hover:bg-brand-gray hover:text-brand-heading"
        >
          ← View live site
        </Link>
      </div>
    </div>
  );
}
