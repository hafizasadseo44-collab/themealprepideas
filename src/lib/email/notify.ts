import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, EMAIL_FROM } from "@/lib/email/resend";
import { newRecipeEmail, newPostEmail, newCategoryEmail } from "@/lib/email/templates";

const BATCH_SIZE = 90; // Resend caps a single batch call at 100 emails.

async function getSubscriberEmails(column: "notify_new_recipes" | "notify_new_posts"): Promise<string[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("customers").select("email").eq(column, true);

  if (error) {
    console.error(`[email] failed to load subscribers (${column}):`, error.message);
    return [];
  }

  return (data ?? []).map((row) => row.email).filter(Boolean);
}

async function sendToRecipients(subject: string, html: string, recipients: string[]) {
  const resend = getResendClient();
  if (!resend || recipients.length === 0) return;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    try {
      const { error } = await resend.batch.send(chunk.map((to) => ({ from: EMAIL_FROM, to, subject, html })));
      if (error) console.error("[email] batch send failed:", error);
    } catch (err) {
      console.error("[email] batch send threw:", err);
    }
  }
}

/** Called once, right when a recipe transitions into "published" — never on every edit. */
export async function notifyNewRecipe(recipe: {
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  tag: string | null;
}) {
  const recipients = await getSubscriberEmails("notify_new_recipes");
  if (recipients.length === 0) return;
  const { subject, html } = newRecipeEmail(recipe);
  await sendToRecipients(subject, html, recipients);
}

/** Called once, right when a post transitions into "published" — never on every edit. */
export async function notifyNewPost(post: {
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  categoryName?: string | null;
}) {
  const recipients = await getSubscriberEmails("notify_new_posts");
  if (recipients.length === 0) return;
  const { subject, html } = newPostEmail(post);
  await sendToRecipients(subject, html, recipients);
}

export async function notifyNewCategory(category: { name: string }) {
  const recipients = await getSubscriberEmails("notify_new_posts");
  if (recipients.length === 0) return;
  const { subject, html } = newCategoryEmail(category);
  await sendToRecipients(subject, html, recipients);
}
