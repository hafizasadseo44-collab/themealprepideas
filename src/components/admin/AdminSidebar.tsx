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
import type { Profile, EditorPermissions } from "@/lib/auth/session";
import { getEffectivePermissions } from "@/lib/auth/session";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  permission?: keyof EditorPermissions;
};

const navItems: NavItem[] = [
  { label: "Dashboard",   href: "/admin",           icon: LayoutDashboard },
  { label: "Posts",       href: "/admin/posts",     icon: FileText,       permission: "can_posts" },
  { label: "Recipes",     href: "/admin/recipes",   icon: UtensilsCrossed, permission: "can_recipes" },
  { label: "Comments",    href: "/admin/comments",  icon: MessageCircle,  permission: "can_comments" },
  { label: "Messages",    href: "/admin/messages",  icon: Mail,           adminOnly: true },
  { label: "Categories",  href: "/admin/categories",icon: FolderKanban,   adminOnly: true },
  { label: "Header Menu", href: "/admin/menu",      icon: Menu,           adminOnly: true },
  { label: "Media",       href: "/admin/media",     icon: ImageIcon,      permission: "can_media" },
  { label: "Users",       href: "/admin/users",     icon: Users,          adminOnly: true },
];

export default function AdminSidebar({ profile, onNavigate }: { profile: Profile; onNavigate?: () => void }) {
  const pathname = usePathname();
  const perms = getEffectivePermissions(profile);
  const isAdmin = profile.role === "admin";

  const items = navItems.filter((item) => {
    if (item.adminOnly) return isAdmin;
    if (item.permission) return isAdmin || perms[item.permission];
    return true; // Dashboard always visible
  });

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
