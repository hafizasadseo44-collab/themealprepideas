"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { deleteRecipe } from "@/lib/recipes/mutations";

export default function DeleteRecipeButton({
  id,
  slug,
  pageId,
  pageSlug,
  children,
}: {
  id: string;
  slug: string;
  pageId: string;
  pageSlug: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${slug}" permanently? This can't be undone.`)) return;
    setDeleting(true);
    const result = await deleteRecipe(id, slug, pageId);
    if (!result.ok) {
      setDeleting(false);
      alert(result.error);
      return;
    }
    router.push(`/admin/recipes/${pageSlug}`);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-sm font-medium text-brand-error transition-colors hover:bg-brand-error/10 disabled:opacity-60"
    >
      {deleting ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          Deleting…
        </>
      ) : (
        children
      )}
    </button>
  );
}
