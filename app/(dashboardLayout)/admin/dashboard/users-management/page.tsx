import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { getUserStats } from "@/services/stats/stats.service";
import { getAllUsers } from "@/services/user/user.service";
import { Suspense } from "react";
import { AdminUsersClient } from "./admin-users-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    role?: string;
  }>;
}

async function AdminUsersData({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const roleFilter = params.role || "all";

  // Fetch user stats from API
  const userStatsResult = await getUserStats();

  // Extract user stats
  let stats = {
    total: 0,
    active: 0,
    blocked: 0,
    guides: 0,
    tourists: 0,
  };

  if (userStatsResult.success && userStatsResult.data) {
    stats.total = userStatsResult.data.totalUsers || 0;
    stats.active = userStatsResult.data.totalActiveUsers || 0;
    stats.blocked = userStatsResult.data.totalBlockedUsers || 0;
    // Extract guides and tourists from usersByRole if available
    if (userStatsResult.data.usersByRole) {
      const guidesRole = userStatsResult.data.usersByRole.find(
        (r: any) => r.role === "GUIDE"
      );
      const touristsRole = userStatsResult.data.usersByRole.find(
        (r: any) => r.role === "TOURIST"
      );
      stats.guides = guidesRole?.count || 0;
      stats.tourists = touristsRole?.count || 0;
    }
  }

  // Fetch users data with proper pagination and role filter
  const usersResult = await getAllUsers({
    page,
    limit,
    role: roleFilter !== "all" ? roleFilter.toUpperCase() : undefined,
  });

  let users = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 0 };

  if (usersResult.success && usersResult.data) {
    // Service returns: { success: true, data: { data: [...users], meta: {...} } }
    // Backend API returns: { data: [...users], meta: {...} }
    // Service wraps it as: { success: true, data: { data: [...], meta: {...} } }
    users = Array.isArray(usersResult.data.data) ? usersResult.data.data : [];
    meta = usersResult.data.meta || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }

  const initialData = {
    users,
    meta,
    stats,
    currentPage: page,
    currentLimit: limit,
    roleFilter,
  };

  return <AdminUsersClient initialData={initialData} />;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 bg-muted/30 py-8">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <DashboardSkeleton />
            </div>
          </main>
        </div>
      }
    >
      <AdminUsersData searchParams={searchParams} />
    </Suspense>
  );
}
