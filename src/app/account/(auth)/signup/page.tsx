import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customers/session";
import SignupForm from "@/components/account/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | The Meal Prep Ideas",
  robots: { index: false, follow: false },
};

export default async function AccountSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  const customer = await getCurrentCustomer();
  if (customer) redirect(safeNext);

  return <SignupForm next={safeNext} />;
}
