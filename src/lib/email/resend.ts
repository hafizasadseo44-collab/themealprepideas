import "server-only";
import { Resend } from "resend";

export const SITE_URL = "https://themealprepideas.com";
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "The Meal Prep Ideas <onboarding@resend.dev>";
export const CONTACT_INBOX = process.env.CONTACT_INBOX_EMAIL || "info@themealprepideas.com";

let client: Resend | null | undefined;

/** Returns null (and logs once) when RESEND_API_KEY isn't set, instead of throwing — publishing must never fail because email isn't configured yet. */
export function getResendClient(): Resend | null {
  if (client !== undefined) return client;

  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping customer notification emails.");
    client = null;
    return client;
  }

  client = new Resend(process.env.RESEND_API_KEY);
  return client;
}
