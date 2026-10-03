import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Customer = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  notify_new_recipes: boolean;
  notify_new_posts: boolean;
};

/**
 * Reads the current signed-in visitor's customer row (site accounts, not
 * CMS staff — see 0012_customers.sql). Cached per-request. Returns null when
 * signed out, or when the signed-in user is staff-only (no customer row).
 */
export const getCurrentCustomer = cache(async (): Promise<Customer | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, email, full_name, avatar_url, created_at, notify_new_recipes, notify_new_posts")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[getCurrentCustomer] failed to load customer:", error.message);
    return null;
  }

  return (customer as Customer | null) ?? null;
});

export async function requireCustomer(nextPath?: string): Promise<Customer> {
  const customer = await getCurrentCustomer();
  if (!customer) {
    const suffix = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/account/login${suffix}`);
  }
  return customer;
}
