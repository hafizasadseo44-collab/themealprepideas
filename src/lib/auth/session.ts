import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "editor";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
};

/**
 * Reads the current signed-in user's profile (id, role, display info).
 * Cached per-request so multiple calls in one render pass don't re-hit Supabase.
 * Returns null when signed out.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, bio, role")
    .eq("id", user.id)
    .single();

  if (error) {
    // Surfaced in the server terminal so a bad RLS policy or a missing
    // profile row shows up as a clear log line instead of a silent blank page.
    console.error("[getCurrentProfile] failed to load profile:", error.message);
    return null;
  }

  return (profile as Profile | null) ?? null;
});

/**
 * Guards a page/layout/Server Action to a set of roles.
 * `proxy.ts` only checks "is anyone signed in" — this is where the actual
 * admin-vs-editor authorization decision is enforced (with RLS as the backstop).
 */
export async function requireRole(roles: Role[]): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || !roles.includes(profile.role)) {
    // The signed-in Supabase user has no staff `profiles` row (e.g. a
    // customer account, or one that was removed) — sign them out before
    // redirecting. Otherwise proxy.ts sees a still-valid session at
    // /admin/login and bounces them straight back to /admin, looping forever.
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-staff");
  }
  return profile;
}
