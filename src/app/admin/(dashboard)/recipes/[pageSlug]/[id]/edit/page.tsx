import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getRecipePageBySlug, getRecipeById } from "@/lib/recipes/queries";
import RecipeEditor from "@/components/admin/recipes/RecipeEditor";
import DeleteRecipeButton from "@/components/admin/recipes/DeleteRecipeButton";

export const metadata: Metadata = {
  title: "Edit Recipe | Admin",
  robots: { index: false, follow: false },
};

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ pageSlug: string; id: string }>;
}) {
  await requireRole(["admin", "editor"]);
  const { pageSlug, id } = await params;

  const page = await getRecipePageBySlug(pageSlug);
  if (!page) notFound();

  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/admin/recipes/${page.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-brand-light hover:text-brand-heading"
        >
          <ArrowLeft className="size-4" />
          Back to {page.name}
        </Link>
        <DeleteRecipeButton id={recipe.id} slug={recipe.slug} pageId={page.id} pageSlug={page.slug}>
          <Trash2 className="size-3.5" />
          Delete Recipe
        </DeleteRecipeButton>
      </div>
      <RecipeEditor recipe={recipe} page={page} />
    </div>
  );
}
