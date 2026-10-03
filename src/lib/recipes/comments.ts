"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

export type SubmitCommentResult = { ok: true } | { ok: false; error: string };
export type ModerationResult = { ok: true } | { ok: false; error: string };

const URL_PATTERN = /\b((https?:\/\/|www\.)\S+|[a-z0-9-]+\.(com|net|org|io|co|info|biz|xyz|site|online|shop|store)(\/\S*)?)\b/gi;

/** Comments carry no live links — pasted URLs are neutralized before they're
 * ever stored, so an approved comment can never pass link equity or send a
 * visitor anywhere the site didn't intend. */
function stripLinks(text: string): string {
  return text.replace(URL_PATTERN, "[link removed]");
}

export async function submitComment(
  recipeId: string,
  slug: string,
  input: { name: string; rating: number; body: string; honeypot?: string }
): Promise<SubmitCommentResult> {
  // Honeypot — a real visitor never sees or fills this field; a bot filling
  // every field will. Reject quietly without revealing why.
  if (input.honeypot) return { ok: true };

  const name = input.name.trim().slice(0, 80);
  const body = stripLinks(input.body.trim()).slice(0, 2000);
  const rating = Math.round(input.rating);

  if (!name) return { ok: false, error: "Enter your name." };
  if (!body || body.length < 3) return { ok: false, error: "Write a short comment first." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: "Pick a rating from 1 to 5 stars." };

  const supabase = await createClient();
  const { error } = await supabase.from("recipe_comments").insert({
    recipe_id: recipeId,
    author_name: name,
    rating,
    body,
  });

  if (error) return { ok: false, error: "Couldn't submit your comment — try again in a moment." };

  revalidatePath(`/recipes/${slug}`);
  return { ok: true };
}

export async function moderateComment(id: string, slug: string, action: "approve" | "reject"): Promise<ModerationResult> {
  const profile = await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { error } = await supabase
    .from("recipe_comments")
    .update({
      status: action === "approve" ? "approved" : "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: profile.id,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/comments");
  revalidatePath(`/recipes/${slug}`);
  return { ok: true };
}

export async function deleteComment(id: string, slug: string): Promise<ModerationResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { error } = await supabase.from("recipe_comments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/comments");
  revalidatePath(`/recipes/${slug}`);
  return { ok: true };
}
