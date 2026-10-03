import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import ProfileForm from "@/components/admin/profile/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProfilePage() {
  const profile = await requireRole(["admin", "editor"]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-brand-heading">My Profile</h1>
      <p className="mt-1 text-sm text-brand-light">Manage your account details and author bio.</p>

      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
