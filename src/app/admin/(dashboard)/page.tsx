import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/dashboard/queries";
import WelcomeHeader from "@/components/admin/dashboard/WelcomeHeader";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import RecentPostsList from "@/components/admin/dashboard/RecentPostsList";
import CategoryBreakdown from "@/components/admin/dashboard/CategoryBreakdown";
import QuickActions from "@/components/admin/dashboard/QuickActions";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [profile, stats] = await Promise.all([getCurrentProfile(), getDashboardStats()]);
  const name = profile?.full_name || profile?.email.split("@")[0] || "there";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <WelcomeHeader name={name} />

      <StatsCards total={stats.total} published={stats.published} draft={stats.draft} scheduled={stats.scheduled} mediaCount={stats.mediaCount} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <RecentPostsList posts={stats.recentPosts} />
          <CategoryBreakdown categories={stats.categoryBreakdown} />
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-brand-heading">Quick Actions</p>
          <QuickActions isAdmin={stats.isAdmin} />
        </div>
      </div>
    </div>
  );
}
