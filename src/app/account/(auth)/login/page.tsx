import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customers/session";
import LoginForm from "@/components/account/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | The Meal Prep Ideas",
  robots: { index: false, follow: false },
};

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; confirm?: string }>;
}) {
  const { next, confirm } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  const customer = await getCurrentCustomer();
  if (customer) redirect(safeNext);

  return <LoginForm next={safeNext} confirm={confirm === "1"} />;
}
