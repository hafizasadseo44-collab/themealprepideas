"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentCustomer } from "@/lib/customers/session";

export type CustomerActionResult = { ok: true } | { ok: false; error: string };

export async function updateOwnCustomerName(fullName: string): Promise<CustomerActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in." };
  if (!fullName.trim()) return { ok: false, error: "Enter your name." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ full_name: fullName.trim() })
    .eq("id", customer.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/account");
  return { ok: true };
}

export async function updateOwnCustomerPassword(newPassword: string): Promise<CustomerActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in." };
  if (newPassword.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function updateOwnNotificationPrefs(prefs: {
  notifyNewRecipes: boolean;
  notifyNewPosts: boolean;
}): Promise<CustomerActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ notify_new_recipes: prefs.notifyNewRecipes, notify_new_posts: prefs.notifyNewPosts })
    .eq("id", customer.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/account");
  return { ok: true };
}

export async function deleteOwnCustomerAccount(): Promise<CustomerActionResult> {
  const customer = await getCurrentCustomer();
  if (!customer) return { ok: false, error: "Not signed in." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(customer.id);
  if (error) return { ok: false, error: error.message };

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
