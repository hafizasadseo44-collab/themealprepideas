import { requireRole } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["admin", "editor"]);

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
