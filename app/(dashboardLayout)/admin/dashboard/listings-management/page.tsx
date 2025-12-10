import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import {
  getAllListings,
  getDistinctCategories,
} from "@/services/listing/listing.service";
import { getListingStats } from "@/services/stats/stats.service";
import { Suspense } from "react";
import { AdminListingsClient } from "./admin-listings-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    category?: string;
  }>;
}

async function AdminListingsData({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const statusFilter = params.status || "all";
  const categoryFilter = params.category || "all";

  // Determine isActive filter value for backend
  let isActiveFilter: boolean | undefined = undefined;
  if (statusFilter === "active") {
    isActiveFilter = true;
  } else if (statusFilter === "inactive") {
    isActiveFilter = false;
  }

  // Fetch listing stats from listing stats API
  const listingStatsResult = await getListingStats();

  const distinctCategories = await getDistinctCategories();

  // Extract listing stats
  let stats = {
    total: 0,
    active: 0,
    inactive: 0,
  };

  if (listingStatsResult.success && listingStatsResult.data) {
    stats.total = listingStatsResult.data.totalListings || 0;
    stats.active = listingStatsResult.data.activeListings || 0;
    stats.inactive = listingStatsResult.data.inactiveListings || 0;
  }

  // Fetch paginated listings for the table with proper filters
  const listingsResult = await getAllListings({
    page,
    limit,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    isActive: isActiveFilter,
  });

  let listings = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 0 };

  if (listingsResult.success && listingsResult.data) {
    listings = listingsResult.data.data || [];
    meta = listingsResult.data.meta || meta;
  }

  const initialData = {
    listings,
    distinctCategories,
    meta,
    stats,
    currentPage: page,
    currentLimit: limit,
    statusFilter,
    categoryFilter,
  };

  return <AdminListingsClient initialData={initialData} />;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
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
      <AdminListingsData searchParams={searchParams} />
    </Suspense>
  );
}
