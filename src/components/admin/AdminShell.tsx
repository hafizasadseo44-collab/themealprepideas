"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import type { Profile } from "@/lib/auth/session";

export default function AdminShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-gray/40">
      <div className="hidden lg:block">
        <AdminSidebar role={profile.role} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full shadow-2xl">
            <AdminSidebar role={profile.role} onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-brand-heading"
          >
            <X className="size-4.5" />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar profile={profile} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-5 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
