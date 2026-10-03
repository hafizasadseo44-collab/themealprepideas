import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getAllUsers } from "@/lib/users/queries";
import UserManagement from "@/components/admin/users/UserManagement";

export const metadata: Metadata = {
  title: "Users | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const me = await requireRole(["admin"]);
  const users = await getAllUsers();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-brand-heading">Users</h1>
      <p className="mt-1 text-sm text-brand-light">{users.length} people have access to the dashboard</p>

      <div className="mt-6">
        <UserManagement users={users} currentUserId={me.id} />
      </div>
    </div>
  );
}
