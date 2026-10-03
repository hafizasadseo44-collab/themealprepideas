"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { getResendClient, EMAIL_FROM, CONTACT_INBOX } from "@/lib/email/resend";
import { contactFormNotificationEmail, contactFormConfirmationEmail } from "@/lib/email/templates";

export type SubmitContactResult = { ok: true } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}): Promise<SubmitContactResult> {
  // Honeypot — a real visitor never sees this field; a bot filling every field will.
  if (input.honeypot) return { ok: true };

  const name = input.name.trim().slice(0, 100);
  const email = input.email.trim().slice(0, 200);
  const subject = input.subject.trim().slice(0, 150);
  const message = input.message.trim().slice(0, 4000);

  if (!name) return { ok: false, error: "Enter your name." };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (!subject) return { ok: false, error: "Enter a subject." };
  if (!message || message.length < 10) return { ok: false, error: "Write a bit more detail in your message." };

  const supabase = createPublicClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, subject, message });
  if (error) {
    console.error("[submitContactForm]", error.message);
    return { ok: false, error: "Couldn't send your message — please try again in a moment." };
  }

  const resend = getResendClient();
  if (resend) {
    const notification = contactFormNotificationEmail({ name, email, subject, message });
    const confirmation = contactFormConfirmationEmail({ name, subject });

    await Promise.allSettled([
      resend.emails.send({ from: EMAIL_FROM, to: CONTACT_INBOX, replyTo: email, subject: notification.subject, html: notification.html }),
      resend.emails.send({ from: EMAIL_FROM, to: email, subject: confirmation.subject, html: confirmation.html }),
    ]);
  }

  return { ok: true };
}
