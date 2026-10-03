import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getHeaderMenu } from "@/lib/menu/queries";
import MenuManager from "@/components/admin/menu/MenuManager";

export const metadata: Metadata = {
  title: "Header Menu | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMenuPage() {
  await requireRole(["admin", "editor"]);
  const groups = await getHeaderMenu();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-brand-heading">Header Menu</h1>
      <p className="mt-1 text-sm text-brand-light">
        Manage the &ldquo;Browse Categories&rdquo; dropdown shown in the site header — add, edit, reorder, or remove
        any group or link. Changes go live immediately.
      </p>

      <div className="mt-6">
        <MenuManager groups={groups} />
      </div>
    </div>
  );
}
