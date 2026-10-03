"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ChefHat,
  ChevronDown,
  UtensilsCrossed,
  BookOpen,
  Info,
  Mail,
  LayoutGrid,
  ArrowRight,
  BookmarkCheck,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import SearchOverlay from "@/components/layout/SearchOverlay";
import { signOutAction } from "@/lib/customers/actions";
import { getMenuIcon } from "@/lib/menu/icons";
import type { Customer } from "@/lib/customers/session";
import type { MenuGroup } from "@/lib/menu/types";

const navLinks: { label: string; href: string; icon: LucideIcon; hasMenu?: boolean }[] = [
  { label: "Browse Categories", href: "/categories", icon: LayoutGrid, hasMenu: true },
  { label: "Recipes", href: "/recipes", icon: UtensilsCrossed },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Header({ customer, menuGroups }: { customer: Customer | null; menuGroups: MenuGroup[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/account/login" || pathname === "/account/signup") return null;
  if (pathname?.endsWith("/print") && pathname?.startsWith("/recipes/")) return null;

  const isActive = (href: string) => pathname === href || (href !== "/" && !!pathname?.startsWith(`${href}/`));

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_16px_40px_-24px_rgba(63,163,77,0.35)] border-b border-brand-border/60"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div
        className={cn(
          "h-[3px] w-full bg-[linear-gradient(90deg,var(--color-brand-primary),var(--color-brand-orange),var(--color-brand-primary-dark))] bg-[length:200%_100%] transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-80"
        )}
      />

      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 md:h-[76px] md:px-10">
        <Link href="/" className="group flex min-w-0 items-center gap-2 md:gap-2.5">
          <motion.span
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ rotate: -8, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white shadow-[0_6px_16px_-4px_rgba(63,163,77,0.5)] md:size-10 md:rounded-[12px]"
          >
            <ChefHat className="size-4 md:size-5" />
          </motion.span>
          <span className="truncate font-display text-base leading-none text-brand-heading sm:text-lg md:text-xl">
            Meal Prep{" "}
            <span className="bg-gradient-to-r from-brand-primary-dark to-brand-primary bg-clip-text text-transparent">
              Ideas
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return link.hasMenu ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="relative flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] font-medium text-brand-body transition-colors hover:text-brand-primary-dark">
                  {megaOpen && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-brand-primary/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.label}
                    <ChevronDown className={cn("size-3.5 transition-transform duration-300", megaOpen && "rotate-180")} />
                  </span>
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={cn(
                        "absolute left-1/2 top-full -translate-x-1/2 pt-3",
                        menuGroups.length >= 4 ? "w-[720px]" : menuGroups.length === 2 ? "w-[440px]" : menuGroups.length <= 1 ? "w-[280px]" : "w-[600px]"
                      )}
                    >
                      <div className="overflow-hidden rounded-[22px] border border-brand-border/70 bg-white shadow-[0_28px_60px_-16px_rgba(17,24,39,0.22)]">
                        {menuGroups.length > 0 && (
                          <div
                            className={cn(
                              "grid gap-6 p-6",
                              menuGroups.length >= 4 ? "grid-cols-4" : menuGroups.length === 2 ? "grid-cols-2" : menuGroups.length === 1 ? "grid-cols-1" : "grid-cols-3"
                            )}
                          >
                            {menuGroups.map((group, gi) => {
                              const GroupIcon = getMenuIcon(group.icon);
                              return (
                                <motion.div
                                  key={group.id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25, delay: gi * 0.05 }}
                                >
                                  <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-light">
                                    <GroupIcon className="size-3.5 text-brand-primary-dark" />
                                    {group.title}
                                  </p>
                                  <ul className="space-y-1">
                                    {group.items.map((item) => {
                                      const ItemIcon = getMenuIcon(item.icon);
                                      return (
                                        <li key={item.id}>
                                          <Link
                                            href={item.href}
                                            className="group/item flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-sm text-brand-body transition-all duration-200 hover:translate-x-0.5 hover:bg-brand-primary/6 hover:text-brand-primary-dark"
                                          >
                                            <ItemIcon className="size-3.5 text-brand-light transition-colors group-hover/item:text-brand-primary-dark" />
                                            {item.label}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                        <Link
                          href="/categories"
                          className="group flex items-center justify-between border-t border-brand-border/60 bg-brand-cream/60 px-6 py-3.5 text-sm font-semibold text-brand-primary-dark transition-colors hover:bg-brand-primary/8"
                        >
                          Browse all categories
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="relative rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-brand-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn("relative z-10", active ? "text-brand-primary-dark" : "text-brand-body hover:text-brand-primary-dark")}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Search recipes"
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            className="group flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-border/70 bg-white/70 text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary-dark hover:shadow-[0_10px_22px_-12px_rgba(63,163,77,0.55)] md:size-11"
          >
            <Search className="size-4 transition-transform duration-300 group-hover:scale-110 md:size-[18px]" />
          </button>
          {customer ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-label="Account menu"
                className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(63,163,77,0.6)] transition-transform duration-300 hover:scale-105 md:size-11"
              >
                {initialsOf(customer.full_name || customer.email) || "A"}
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-[16px] border border-brand-border/70 bg-white p-1.5 shadow-[0_24px_50px_-16px_rgba(17,24,39,0.25)]"
                    >
                      <p className="truncate px-3 py-2 text-xs text-brand-light">{customer.email}</p>
                      <Link
                        href="/account"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-brand-body transition-colors hover:bg-brand-primary/8 hover:text-brand-primary-dark"
                      >
                        <BookmarkCheck className="size-4" />
                        My Saved Recipes
                      </Link>
                      <form action={signOutAction}>
                        <input type="hidden" name="next" value={pathname ?? "/"} />
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm font-medium text-brand-error transition-colors hover:bg-brand-error/8"
                        >
                          <LogOut className="size-4" />
                          Sign Out
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={`/account/login?next=${encodeURIComponent(pathname || "/")}`}
                className="rounded-full px-3.5 py-2.5 text-sm font-semibold text-brand-body transition-colors hover:text-brand-primary-dark"
              >
                Log In
              </Link>
              <Button href={`/account/signup?next=${encodeURIComponent(pathname || "/")}`} size="md">
                Sign Up
              </Button>
            </div>
          )}
          <button
            aria-label="Toggle menu"
            className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-border/70 bg-white/70 text-brand-body md:size-11 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                {mobileOpen ? <X className="size-4 md:size-5" /> : <Menu className="size-4 md:size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden border-t border-brand-border/60 bg-white lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                        active ? "bg-brand-primary/10 text-brand-primary-dark" : "text-brand-body hover:bg-brand-primary/8 hover:text-brand-primary-dark"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <link.icon className="size-4.5" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: navLinks.length * 0.05 }}
                className="mt-2 space-y-2 sm:hidden"
              >
                {customer ? (
                  <>
                    <Button href="/account" size="md" icon={BookmarkCheck} iconPosition="left" className="w-full" onClick={() => setMobileOpen(false)}>
                      My Saved Recipes
                    </Button>
                    <form action={signOutAction}>
                      <input type="hidden" name="next" value={pathname ?? "/"} />
                      <button
                        type="submit"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-brand-border text-[15px] font-semibold text-brand-error transition-colors hover:bg-brand-error/8"
                      >
                        <LogOut className="size-4" />
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Button
                      href={`/account/signup?next=${encodeURIComponent(pathname || "/")}`}
                      size="md"
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </Button>
                    <Link
                      href={`/account/login?next=${encodeURIComponent(pathname || "/")}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-[14px] border border-brand-border text-[15px] font-semibold text-brand-body transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <SearchOverlay />
    </>
  );
}
