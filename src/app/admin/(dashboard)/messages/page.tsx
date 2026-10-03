import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getContactMessages } from "@/lib/contact/queries";
import ContactMessagesList from "@/components/admin/messages/ContactMessagesList";

export const metadata: Metadata = {
  title: "Messages | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMessagesPage() {
  await requireRole(["admin", "editor"]);
  const messages = await getContactMessages();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-brand-heading">Messages</h1>
      <p className="mt-1 text-sm text-brand-light">
        Everything submitted through the site&apos;s contact form. Each one is also emailed straight to your inbox.
      </p>

      <div className="mt-6">
        <ContactMessagesList messages={messages} />
      </div>
    </div>
  );
}
