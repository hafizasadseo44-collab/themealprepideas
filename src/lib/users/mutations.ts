"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile, requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/auth/session";

export type UserActionResult = { ok: true } | { ok: false; error: string };

export async function inviteUser(email: string, role: Role): Promise<UserActionResult> {
  await requireRole(["admin"]);
  if (!email.trim()) return { ok: false, error: "Email is required." };

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email.trim(), {
    data: { is_staff_invite: true },
  });

  if (error || !data.user) return { ok: false, error: error?.message ?? "Could not send invite." };

  if (role === "admin") {
    const supabase = await createClient();
    await supabase.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUserRole(id: string, role: Role): Promise<UserActionResult> {
  const me = await requireRole(["admin"]);
  if (me.id === id) return { ok: false, error: "You can't change your own role." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function removeUser(id: string): Promise<UserActionResult> {
  const me = await requireRole(["admin"]);
  if (me.id === id) return { ok: false, error: "You can't remove your own account." };

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function getMyId() {
  const profile = await getCurrentProfile();
  return profile?.id ?? null;
}
