"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCustomer } from "@/lib/customers/session";

export type ToggleSavedResult =
  | { ok: true; saved: boolean }
  | { ok: false; error: string; needsAuth?: boolean };

export async function toggleSavedRecipe(recipeSlug: string): Promise<ToggleSavedResult> {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return { ok: false, error: "Sign in to save recipes.", needsAuth: true };
  }

  const supabase = await createClient();
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .select("id")
    .eq("slug", recipeSlug)
    .single();

  if (recipeError || !recipe) {
    return { ok: false, error: "Recipe not found." };
  }

  const { data: existing } = await supabase
    .from("saved_recipes")
    .select("id")
    .eq("customer_id", customer.id)
    .eq("recipe_id", recipe.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("saved_recipes").delete().eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/account");
    return { ok: true, saved: false };
  }

  const { error } = await supabase.from("saved_recipes").insert({ customer_id: customer.id, recipe_id: recipe.id });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/account");
  return { ok: true, saved: true };
}
