"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";

export type ProfileActionResult = { ok: true } | { ok: false; error: string };

export async function updateOwnProfile(input: {
  fullName: string;
  bio: string;
  avatarUrl: string | null;
  jobTitle: string;
  credentials: string;
  yearsExperience: string;
  expertise: string;
  websiteUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
}): Promise<ProfileActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, error: "Not signed in." };

  const expertiseTags = input.expertise
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName.trim() || null,
      bio: input.bio.trim() || null,
      avatar_url: input.avatarUrl,
      job_title: input.jobTitle.trim() || null,
      credentials: input.credentials.trim() || null,
      years_experience: input.yearsExperience ? parseInt(input.yearsExperience, 10) : null,
      expertise: expertiseTags.length > 0 ? expertiseTags : null,
      website_url: input.websiteUrl.trim() || null,
      twitter_url: input.twitterUrl.trim() || null,
      instagram_url: input.instagramUrl.trim() || null,
      facebook_url: input.facebookUrl.trim() || null,
      pinterest_url: input.pinterestUrl.trim() || null,
      linkedin_url: input.linkedinUrl.trim() || null,
      youtube_url: input.youtubeUrl.trim() || null,
    })
    .eq("id", profile.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/authors/${profile.id}`);
  return { ok: true };
}

export async function updateOwnPassword(newPassword: string): Promise<ProfileActionResult> {
  if (newPassword.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
