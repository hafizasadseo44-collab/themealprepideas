import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "editor";

export type EditorPermissions = {
  can_posts: boolean;
  can_recipes: boolean;
  can_comments: boolean;
  can_media: boolean;
  can_publish: boolean;
};

export const DEFAULT_PERMISSIONS: EditorPermissions = {
  can_posts: true,
  can_recipes: true,
  can_comments: true,
  can_media: true,
  can_publish: true,
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  permissions: EditorPermissions | null;
  // E-E-A-T fields
  job_title: string | null;
  credentials: string | null;
  years_experience: number | null;
  expertise: string[] | null;
  website_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  pinterest_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
};

/** Returns effective permissions: admins always have everything. */
export function getEffectivePermissions(profile: Profile): EditorPermissions {
  if (profile.role === "admin") return DEFAULT_PERMISSIONS;
  return { ...DEFAULT_PERMISSIONS, ...(profile.permissions ?? {}) };
}

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
    .select("id, email, full_name, avatar_url, bio, role, permissions, job_title, credentials, years_experience, expertise, website_url, twitter_url, instagram_url, facebook_url, pinterest_url, linkedin_url, youtube_url")
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
