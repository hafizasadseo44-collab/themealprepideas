"use client";

import { createContext, useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toggleSavedRecipe } from "@/lib/recipes/saved";

type SavedRecipesContextValue = {
  isLoggedIn: boolean;
  isSaved: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const SavedRecipesContext = createContext<SavedRecipesContextValue | null>(null);

export function SavedRecipesProvider({
  initialSlugs,
  isLoggedIn,
  children,
}: {
  initialSlugs: string[];
  isLoggedIn: boolean;
  children: React.ReactNode;
}) {
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(() => new Set(initialSlugs));
  const router = useRouter();
  const pathname = usePathname();

  const goToLogin = () => router.push(`/account/login?next=${encodeURIComponent(pathname || "/")}`);

  const toggle = (slug: string) => {
    if (!isLoggedIn) {
      goToLogin();
      return;
    }

    const wasSaved = savedSlugs.has(slug);
    setSavedSlugs((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(slug);
      else next.add(slug);
      return next;
    });

    toggleSavedRecipe(slug).then((result) => {
      if (!result.ok) {
        setSavedSlugs((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(slug);
          else next.delete(slug);
          return next;
        });
        if (result.needsAuth) goToLogin();
      }
    });
  };

  return (
    <SavedRecipesContext.Provider value={{ isLoggedIn, isSaved: (slug) => savedSlugs.has(slug), toggle }}>
      {children}
    </SavedRecipesContext.Provider>
  );
}

export function useSavedRecipes() {
  const ctx = useContext(SavedRecipesContext);
  if (!ctx) throw new Error("useSavedRecipes must be used within a SavedRecipesProvider");
  return ctx;
}
