"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import AdminRecipeCard from "@/components/admin/recipes/AdminRecipeCard";
import AddRecipeModal from "@/components/admin/recipes/AddRecipeModal";
import type { Recipe, RecipePage, RecipeSection, RecipeStatus } from "@/lib/recipes/types";

type StatusFilter = "all" | RecipeStatus;

export default function PageRecipesView({
  page,
  sections,
  recipes,
}: {
  page: RecipePage;
  sections: RecipeSection[];
  recipes: Recipe[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [recipes, query, statusFilter]);

  const grouped = sections.map((section) => ({
    section,
    recipes: filtered.filter((r) => r.sectionIds.includes(section.id)),
  }));

  const sectionedIds = new Set(sections.flatMap((s) => filtered.filter((r) => r.sectionIds.includes(s.id)).map((r) => r.id)));
  const unsectioned = filtered.filter((r) => !sectionedIds.has(r.id));

  const draftCount = recipes.filter((r) => r.status === "draft").length;
  const publishedCount = recipes.filter((r) => r.status === "published").length;
  const isFiltering = query.trim().length > 0 || statusFilter !== "all";
  const totalMatches = filtered.length;

  return (
    <div className="space-y-10 pb-24">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-[18px] border border-brand-border/60 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes on this page…"
            className="h-11 w-full rounded-[12px] border border-brand-border bg-white pl-10 pr-9 text-sm focus:border-brand-primary focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light hover:text-brand-heading"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-[12px] bg-brand-gray p-1">
          {(
            [
              { value: "all", label: `All ${recipes.length}` },
              { value: "published", label: `Published ${publishedCount}` },
              { value: "draft", label: `Draft ${draftCount}` },
            ] as { value: StatusFilter; label: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-[9px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === opt.value ? "bg-white text-brand-heading shadow-sm" : "text-brand-light hover:text-brand-heading"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section quick-nav */}
      {sections.length > 1 && !isFiltering && (
        <div className="-mt-6 flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#section-${section.slug}`}
              className="rounded-full border border-brand-border/60 bg-white px-3 py-1.5 text-xs font-medium text-brand-body transition-colors hover:border-brand-primary/40 hover:text-brand-primary-dark"
            >
              {section.heading}
            </a>
          ))}
        </div>
      )}

      {isFiltering && (
        <p className="-mt-6 text-sm text-brand-light">
          {totalMatches} result{totalMatches === 1 ? "" : "s"} for
          {query.trim() ? ` "${query.trim()}"` : ""}
          {statusFilter !== "all" ? ` · ${statusFilter}` : ""}
        </p>
      )}

      {grouped.map(({ section, recipes: sectionRecipes }) => {
        if (isFiltering && sectionRecipes.length === 0) return null;
        return (
          <section key={section.id} id={`section-${section.slug}`} className="scroll-mt-24">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl text-brand-heading">{section.heading}</h2>
                <p className="mt-0.5 text-sm text-brand-light">{sectionRecipes.length} recipe{sectionRecipes.length === 1 ? "" : "s"}</p>
              </div>
            </div>
            {sectionRecipes.length === 0 ? (
              <p className="rounded-[16px] border border-dashed border-brand-border/70 bg-white px-5 py-6 text-sm text-brand-light">
                No recipes in this section yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {sectionRecipes.map((recipe, i) => (
                  <AdminRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    index={i}
                    editHref={`/admin/recipes/${page.slug}/${recipe.id}/edit`}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {(unsectioned.length > 0 || sections.length === 0) && (
        <section>
          <div className="mb-4">
            <h2 className="font-display text-xl text-brand-heading">
              {sections.length === 0 ? "All Recipes" : "Uncategorized"}
            </h2>
            <p className="mt-0.5 text-sm text-brand-light">
              {unsectioned.length} recipe{unsectioned.length === 1 ? "" : "s"}
            </p>
          </div>
          {unsectioned.length === 0 ? (
            <p className="rounded-[16px] border border-dashed border-brand-border/70 bg-white px-5 py-6 text-sm text-brand-light">
              {isFiltering ? "No matches here." : "No recipes yet — add the first one."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {unsectioned.map((recipe, i) => (
                <AdminRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={i}
                  editHref={`/admin/recipes/${page.slug}/${recipe.id}/edit`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="fixed bottom-8 right-8 z-20 flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_-12px_rgba(63,163,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark"
      >
        <Plus className="size-4" />
        Add Recipe
      </button>

      <AddRecipeModal open={addOpen} onClose={() => setAddOpen(false)} pageId={page.id} sections={sections} />
    </div>
  );
}
