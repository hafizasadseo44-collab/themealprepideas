import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getCategoriesForAdmin } from "@/lib/categories/queries";
import CategoryList from "@/components/admin/categories/CategoryList";

export const metadata: Metadata = {
  title: "Categories | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  await requireRole(["admin"]);
  const categories = await getCategoriesForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-brand-heading">Categories</h1>
      <p className="mt-1 text-sm text-brand-light">{categories.length} categories</p>

      <div className="mt-6">
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
