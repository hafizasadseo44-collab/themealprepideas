"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";

export type ProfileActionResult = { ok: true } | { ok: false; error: string };

export async function updateOwnProfile(input: {
  fullName: string;
  bio: string;
  avatarUrl: string | null;
}): Promise<ProfileActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: input.fullName.trim() || null, bio: input.bio.trim() || null, avatar_url: input.avatarUrl })
    .eq("id", profile.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/blog");
  return { ok: true };
}

export async function updateOwnPassword(newPassword: string): Promise<ProfileActionResult> {
  if (newPassword.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
