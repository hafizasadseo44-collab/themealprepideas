"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole, getCurrentProfile } from "@/lib/auth/session";

export type SubmitCommentResult = { ok: true } | { ok: false; error: string };
export type ModerationResult = { ok: true } | { ok: false; error: string };

const URL_PATTERN = /\b((https?:\/\/|www\.)\S+|[a-z0-9-]+\.(com|net|org|io|co|info|biz|xyz|site|online|shop|store)(\/\S*)?)\b/gi;

/** Comments carry no live links — pasted URLs are neutralized before they're
 * ever stored, so an approved comment can never pass link equity or send a
 * visitor anywhere the site didn't intend. */
function stripLinks(text: string): string {
  return text.replace(URL_PATTERN, "[link removed]");
}

export type SubmitCommentInput = {
  name: string;
  email?: string;
  rating?: number | null;
  body: string;
  honeypot?: string;
  parentId?: string | null;
};

export async function submitComment(
  recipeId: string,
  slug: string,
  input: SubmitCommentInput
): Promise<SubmitCommentResult> {
  // Honeypot — a real visitor never sees or fills this field; a bot filling
  // every field will. Reject quietly without revealing why.
  if (input.honeypot) return { ok: true };

  const name = input.name.trim().slice(0, 80);
  const body = stripLinks(input.body.trim()).slice(0, 2000);
  const email = input.email ? input.email.trim().slice(0, 120) : null;
  const isReply = Boolean(input.parentId);
  const rating = input.rating ? Math.round(input.rating) : null;

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!body || body.length < 3) return { ok: false, error: "Please write a comment first (at least 3 characters)." };
  
  if (!isReply) {
    if (!rating || rating < 1 || rating > 5) {
      return { ok: false, error: "Please pick a rating from 1 to 5 stars." };
    }
  }

  const supabase = await createClient();

  // Try insert with new threaded fields
  const insertPayload: Record<string, unknown> = {
    recipe_id: recipeId,
    author_name: name,
    body,
    status: "pending",
  };

  if (rating != null) insertPayload.rating = rating;
  if (input.parentId) insertPayload.parent_id = input.parentId;
  if (email) insertPayload.author_email = email;

  let { error } = await supabase.from("recipe_comments").insert(insertPayload);

  // If column error occurs because migration 0019 hasn't run yet
  if (error && (error.message.includes("parent_id") || error.message.includes("author_email"))) {
    const fallbackPayload: Record<string, unknown> = {
      recipe_id: recipeId,
      author_name: name,
      rating: rating || 5, // Legacy schema requires integer rating 1-5
      body: input.parentId ? `[Reply] ${body}` : body,
    };
    const fallback = await supabase.from("recipe_comments").insert(fallbackPayload);
    error = fallback.error;
  }

  if (error) {
    console.error("[submitComment error]", error);
    return { ok: false, error: "Couldn't submit your comment — please try again in a moment." };
  }

  revalidatePath(`/recipes/${slug}`);
  revalidatePath("/admin/comments");
  return { ok: true };
}

/** Admin official reply directly to a comment */
export async function submitAdminReply(
  recipeId: string,
  slug: string,
  parentId: string,
  replyBody: string
): Promise<SubmitCommentResult> {
  const profile = await requireRole(["admin", "editor"]);
  const body = stripLinks(replyBody.trim()).slice(0, 2000);

  if (!body || body.length < 2) {
    return { ok: false, error: "Reply cannot be empty." };
  }

  const authorName = profile.full_name?.trim() || "The Meal Prep Ideas Team";
  
  // Use admin client to ensure official staff insertion is verified and auto-approved
  const adminClient = createAdminClient();

  const payload: Record<string, unknown> = {
    recipe_id: recipeId,
    parent_id: parentId,
    author_name: authorName,
    body,
    status: "approved",
    is_admin: true,
    author_role: "admin",
    reviewed_at: new Date().toISOString(),
    reviewed_by: profile.id,
    user_id: profile.id,
  };

  let { error } = await adminClient.from("recipe_comments").insert(payload);

  if (error && (error.message.includes("parent_id") || error.message.includes("is_admin"))) {
    // Fallback if migration hasn't been run yet
    const fallback = await adminClient.from("recipe_comments").insert({
      recipe_id: recipeId,
      author_name: `${authorName} (Admin)`,
      rating: 5,
      body: `[Official Reply] ${body}`,
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: profile.id,
    });
    error = fallback.error;
  }

  if (error) {
    console.error("[submitAdminReply error]", error);
    return { ok: false, error: error.message };
  }

  revalidatePath(`/recipes/${slug}`);
  revalidatePath("/admin/comments");
  return { ok: true };
}

export async function moderateComment(id: string, slug?: string, action: "approve" | "reject" = "approve"): Promise<ModerationResult> {
  const profile = await requireRole(["admin", "editor"]);
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("recipe_comments")
    .update({
      status: action === "approve" ? "approved" : "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: profile.id,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/comments");
  if (slug) {
    revalidatePath(`/recipes/${slug}`);
  }
  return { ok: true };
}

export async function bulkModerateComments(ids: string[], action: "approve" | "reject" | "delete"): Promise<ModerationResult> {
  const profile = await requireRole(["admin", "editor"]);
  const adminClient = createAdminClient();

  if (action === "delete") {
    const { error } = await adminClient.from("recipe_comments").delete().in("id", ids);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await adminClient
      .from("recipe_comments")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: profile.id,
      })
      .in("id", ids);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/comments");
  return { ok: true };
}

export async function updateComment(
  id: string,
  slug: string | undefined,
  body: string,
  rating?: number | null
): Promise<ModerationResult> {
  await requireRole(["admin", "editor"]);
  const adminClient = createAdminClient();

  const cleanBody = stripLinks(body.trim()).slice(0, 2000);
  if (!cleanBody) return { ok: false, error: "Comment text cannot be empty." };

  const updateData: Record<string, unknown> = { body: cleanBody };
  if (rating !== undefined) {
    updateData.rating = rating;
  }

  const { error } = await adminClient
    .from("recipe_comments")
    .update(updateData)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/comments");
  if (slug) {
    revalidatePath(`/recipes/${slug}`);
  }
  return { ok: true };
}

export async function deleteComment(id: string, slug?: string): Promise<ModerationResult> {
  await requireRole(["admin", "editor"]);
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("recipe_comments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/comments");
  if (slug) {
    revalidatePath(`/recipes/${slug}`);
  }
  return { ok: true };
}
