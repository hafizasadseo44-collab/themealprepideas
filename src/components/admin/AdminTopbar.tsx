"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, LogOut, ChevronDown, UserCircle } from "lucide-react";
import { signOutAction } from "@/app/admin/actions/auth";
import type { Profile } from "@/lib/auth/session";

export default function AdminTopbar({ profile, onMenuClick }: { profile: Profile; onMenuClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = (profile.full_name || profile.email).charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-brand-border/60 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-[10px] border border-brand-border/70 text-brand-body lg:hidden"
      >
        <Menu className="size-4.5" />
      </button>

      <span className="hidden text-sm text-brand-light sm:block">
        Signed in as <span className="font-medium text-brand-heading">{profile.email}</span>
      </span>

      <div className="relative ml-auto">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-full border border-brand-border/70 py-1 pl-1 pr-3 transition-colors hover:border-brand-primary/40"
        >
          {profile.avatar_url ? (
            <div className="relative size-8 overflow-hidden rounded-full">
              <Image src={profile.avatar_url} alt={profile.full_name ?? profile.email} fill sizes="32px" className="object-cover" />
            </div>
          ) : (
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-primary/12 text-sm font-semibold text-brand-primary-dark">
              {initial}
            </span>
          )}
          <span className="hidden text-sm font-medium text-brand-heading sm:block">
            {profile.full_name || profile.email.split("@")[0]}
          </span>
          <ChevronDown className="size-3.5 text-brand-light" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-[14px] border border-brand-border/60 bg-white p-1.5 shadow-[0_16px_40px_-16px_rgba(17,24,39,0.25)]">
              <div className="border-b border-brand-border/60 px-3 py-2">
                <p className="text-sm font-medium text-brand-heading">{profile.full_name || "Admin"}</p>
                <p className="mt-0.5 inline-flex rounded-full bg-brand-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-primary-dark">
                  {profile.role}
                </p>
              </div>
              <Link
                href="/admin/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-brand-body transition-colors hover:bg-brand-gray"
              >
                <UserCircle className="size-4" />
                My Profile
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm font-medium text-brand-error transition-colors hover:bg-brand-error/8"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
