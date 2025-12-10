import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { getAllBookings } from "@/services/booking/booking.service";
import { getAllListings } from "@/services/listing/listing.service";
import { getOverviewStats } from "@/services/stats/stats.service";
import { getAllUsers } from "@/services/user/user.service";
import { Suspense } from "react";
import { AdminDashboardClient } from "./admin-dashboard-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    limit?: string;
    usersPage?: string;
    usersLimit?: string;
    listingsPage?: string;
    listingsLimit?: string;
    bookingsPage?: string;
    bookingsLimit?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeTab = params.tab || "overview";
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);

  // Pagination for recent sections (default to 5 records)
  const usersPage = parseInt(params.usersPage || "1", 10);
  const usersLimit = parseInt(params.usersLimit || "5", 10);
  const listingsPage = parseInt(params.listingsPage || "1", 10);
  const listingsLimit = parseInt(params.listingsLimit || "5", 10);
  const bookingsPage = parseInt(params.bookingsPage || "1", 10);
  const bookingsLimit = parseInt(params.bookingsLimit || "5", 10);

  try {
    // Fetch all stats in parallel
    const [overviewResult, usersResult, listingsResult, bookingsResult] =
      await Promise.all([
        getOverviewStats(),
        getAllUsers({ page: usersPage, limit: usersLimit }),
        getAllListings({ page: listingsPage, limit: listingsLimit }),
        getAllBookings({ page: bookingsPage, limit: bookingsLimit }),
      ]);

    const stats = {
      overview: overviewResult.success ? overviewResult.data : {},
      users: overviewResult.success ? overviewResult.data.users : {},
      guides: overviewResult.success
        ? overviewResult.data.users.usersByRole.find(
            (role: any) => role.role === "GUIDE"
          )
        : {},
      tourists: overviewResult.success
        ? overviewResult.data.users.usersByRole.find(
            (role: any) => role.role === "TOURIST"
          )
        : {},
      listings: overviewResult.success ? overviewResult.data.listings : {},
      bookings: overviewResult.success ? overviewResult.data.bookings : {},
      revenue: overviewResult.success ? overviewResult.data.revenue : {},
      profit: overviewResult.success ? overviewResult.data.profit : {},
    };

    const recentUsers =
      usersResult.success && usersResult.data
        ? usersResult.data.data || []
        : [];
    const usersMeta =
      usersResult.success && usersResult.data
        ? usersResult.data.meta || {
            page: 1,
            limit: 5,
            total: 0,
            totalPages: 0,
          }
        : { page: 1, limit: 5, total: 0, totalPages: 0 };

    const recentListings =
      listingsResult.success && listingsResult.data
        ? listingsResult.data.data || []
        : [];
    const listingsMeta =
      listingsResult.success && listingsResult.data
        ? listingsResult.data.meta || {
            page: 1,
            limit: 5,
            total: 0,
            totalPages: 0,
          }
        : { page: 1, limit: 5, total: 0, totalPages: 0 };

    const recentBookings =
      bookingsResult.success && bookingsResult.data
        ? bookingsResult.data.data || []
        : [];
    const bookingsMeta =
      bookingsResult.success && bookingsResult.data
        ? bookingsResult.data.meta || {
            page: 1,
            limit: 5,
            total: 0,
            totalPages: 0,
          }
        : { page: 1, limit: 5, total: 0, totalPages: 0 };

    const initialData = {
      stats,
      recentUsers,
      recentListings,
      recentBookings,
      usersMeta,
      listingsMeta,
      bookingsMeta,
      activeTab,
      currentPage: page,
      currentLimit: limit,
      usersPage,
      usersLimit,
      listingsPage,
      listingsLimit,
      bookingsPage,
      bookingsLimit,
    };

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
        <AdminDashboardClient initialData={initialData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }
}
