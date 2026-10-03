import Link from "next/link";
import { ChefHat } from "lucide-react";
import AuthShowcase from "@/components/account/AuthShowcase";

export default function AccountAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-brand-primary text-white">
            <ChefHat className="size-4.5" />
          </span>
          <span className="font-display text-lg text-brand-heading">Meal Prep Ideas</span>
        </Link>
        <div className="flex flex-1 items-center justify-center">{children}</div>
      </div>
      <AuthShowcase
        title="Every recipe you love, saved in one place."
        subtitle="Create a free account to bookmark recipes, rate what you cook, and jump back to your favorites in a click."
      />
    </div>
  );
}
