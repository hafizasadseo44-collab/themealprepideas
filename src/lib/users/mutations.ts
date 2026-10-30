"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile, requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Role, EditorPermissions } from "@/lib/auth/types";

export type UserActionResult = { ok: true } | { ok: false; error: string };

export async function inviteUser(
  email: string,
  role: Role,
  permissions?: EditorPermissions
): Promise<UserActionResult> {
  await requireRole(["admin"]);
  if (!email.trim()) return { ok: false, error: "Email is required." };

  const adminClient = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themealprepideas.com";
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email.trim(), {
    data: { is_staff_invite: true },
    redirectTo: `${siteUrl}/admin/set-password`,
  });

  if (error || !data.user) return { ok: false, error: error?.message ?? "Could not send invite." };

  const supabase = await createClient();
  const updates: Record<string, unknown> = {};
  if (role === "admin") updates.role = "admin";
  if (permissions && role === "editor") updates.permissions = permissions;
  if (Object.keys(updates).length > 0) {
    await supabase.from("profiles").update(updates).eq("id", data.user.id);
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUserPermissions(
  id: string,
  permissions: EditorPermissions
): Promise<UserActionResult> {
  const me = await requireRole(["admin"]);
  if (me.id === id) return { ok: false, error: "Cannot change your own permissions." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ permissions }).eq("id", id);
  if (error) return { ok: false, error: error.message };

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

export async function resendInvite(email: string): Promise<UserActionResult> {
  await requireRole(["admin"]);
  const adminClient = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themealprepideas.com";
  const setPasswordUrl = `${siteUrl}/admin/set-password`;

  // Try the normal invite first (works for new / never-confirmed users)
  const { error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(email.trim(), {
    data: { is_staff_invite: true },
    redirectTo: setPasswordUrl,
  });

  if (!inviteErr) return { ok: true };

  // User already exists — generate a fresh invite link and email it ourselves
  const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
    type: "invite",
    email: email.trim(),
    options: { redirectTo: setPasswordUrl },
  });

  if (linkErr || !linkData?.properties?.action_link) {
    return { ok: false, error: linkErr?.message ?? "Could not generate invite link." };
  }

  const { getResendClient, EMAIL_FROM } = await import("@/lib/email/resend");
  const resend = getResendClient();
  if (!resend) return { ok: false, error: "Email service not configured (RESEND_API_KEY missing)." };

  const link = linkData.properties.action_link;
  const { error: emailErr } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email.trim(),
    subject: "You've been invited to The Meal Prep Ideas dashboard",
    html: `
      <p>Hi,</p>
      <p>You've been invited to access the Meal Prep Ideas admin dashboard.</p>
      <p><a href="${link}" style="display:inline-block;background:#2e7d32;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Set your password →</a></p>
      <p style="color:#888;font-size:12px;">This link expires in 24 hours. If you did not expect this email, ignore it.</p>
    `,
  });

  if (emailErr) return { ok: false, error: "Link generated but email failed: " + emailErr.message };
  return { ok: true };
}

export async function getMyId() {
  const profile = await getCurrentProfile();
  return profile?.id ?? null;
}
