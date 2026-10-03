import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getRecipePageBySlug, getRecipeSections, getRecipesForPageAdmin } from "@/lib/recipes/queries";
import PageRecipesView from "@/components/admin/recipes/PageRecipesView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}): Promise<Metadata> {
  const { pageSlug } = await params;
  const page = await getRecipePageBySlug(pageSlug);
  return {
    title: page ? `${page.name} Recipes | Admin` : "Recipes | Admin",
    robots: { index: false, follow: false },
  };
}

export default async function AdminRecipePagePage({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}) {
  await requireRole(["admin", "editor"]);
  const { pageSlug } = await params;

  const page = await getRecipePageBySlug(pageSlug);
  if (!page) notFound();

  const [sections, recipes] = await Promise.all([
    getRecipeSections(page.id),
    getRecipesForPageAdmin(page.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/recipes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-light transition-colors hover:text-brand-heading"
      >
        <ChevronLeft className="size-4" />
        All pages
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-brand-heading">{page.name}</h1>
          <p className="mt-1 text-sm text-brand-light">
            {recipes.length} recipe{recipes.length === 1 ? "" : "s"} on this page
          </p>
        </div>
        <Link
          href={page.route}
          target="_blank"
          className="text-sm font-semibold text-brand-primary-dark hover:underline"
        >
          View live page →
        </Link>
      </div>

      <div className="mt-8">
        <PageRecipesView page={page} sections={sections} recipes={recipes} />
      </div>
    </div>
  );
}
