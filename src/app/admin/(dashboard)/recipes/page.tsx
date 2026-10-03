import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getRecipePages } from "@/lib/recipes/queries";
import PagesGrid from "@/components/admin/recipes/PagesGrid";

export const metadata: Metadata = {
  title: "Recipes | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminRecipesPage() {
  await requireRole(["admin", "editor"]);
  const pages = await getRecipePages();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl text-brand-heading">Recipes</h1>
      <p className="mt-1 text-sm text-brand-light">
        Choose a page to manage the recipes shown on it.
      </p>

      <div className="mt-6">
        <PagesGrid pages={pages} />
      </div>
    </div>
  );
}
