import type { Metadata } from "next";
import LoginForm from "@/components/admin/login/LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In | The Meal Prep Ideas",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <LoginForm notStaffError={error === "not-staff"} />;
}
