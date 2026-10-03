import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getRecipePageBySlug } from "@/lib/recipes/queries";
import RecipeEditor from "@/components/admin/recipes/RecipeEditor";

export const metadata: Metadata = {
  title: "New Recipe | Admin",
  robots: { index: false, follow: false },
};

export default async function NewRecipePage({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}) {
  await requireRole(["admin", "editor"]);
  const { pageSlug } = await params;

  const page = await getRecipePageBySlug(pageSlug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href={`/admin/recipes/${page.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-brand-light hover:text-brand-heading"
      >
        <ArrowLeft className="size-4" />
        Back to {page.name}
      </Link>
      <RecipeEditor page={page} />
    </div>
  );
}
