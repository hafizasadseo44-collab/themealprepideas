import type { Metadata } from "next";
import { requireCustomer } from "@/lib/customers/session";
import { getSavedRecipes } from "@/lib/recipes/queries";
import DashboardShell from "@/components/account/DashboardShell";

export const metadata: Metadata = {
  title: "My Account | The Meal Prep Ideas",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const customer = await requireCustomer("/account");
  const recipes = await getSavedRecipes(customer.id);

  return <DashboardShell customer={customer} recipes={recipes} />;
}
