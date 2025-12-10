import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { getAllBookings } from "@/services/booking/booking.service";
import { getBookingStats } from "@/services/stats/stats.service";
import { Suspense } from "react";
import { AdminBookingsClient } from "./admin-bookings-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
  }>;
}

async function AdminBookingsData({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const statusFilter = params.status || "all";

  // Determine status filter value for backend
  let statusFilterValue:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | undefined = undefined;
  if (
    statusFilter !== "all" &&
    ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(statusFilter)
  ) {
    statusFilterValue = statusFilter as
      | "PENDING"
      | "CONFIRMED"
      | "COMPLETED"
      | "CANCELLED";
  }

  // Fetch booking stats
  const bookingStatsResult = await getBookingStats();

  // Extract booking stats
  let stats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  if (bookingStatsResult.success && bookingStatsResult.data) {
    stats.total = bookingStatsResult.data.totalBookings || 0;
    stats.pending = bookingStatsResult.data.pendingBookings || 0;
    stats.confirmed = bookingStatsResult.data.confirmedBookings || 0;
    stats.completed = bookingStatsResult.data.completedBookings || 0;
    stats.cancelled = bookingStatsResult.data.cancelledBookings || 0;
  }

  // Fetch paginated bookings for the table with proper filters
  const bookingsResult = await getAllBookings({
    page,
    limit,
    status: statusFilterValue,
  });

  let bookings = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 0 };

  if (bookingsResult.success && bookingsResult.data) {
    bookings = bookingsResult.data.data || [];
    meta = bookingsResult.data.meta || meta;
  }

  const initialData = {
    bookings,
    meta,
    stats,
    currentPage: page,
    currentLimit: limit,
    statusFilter,
  };

  return <AdminBookingsClient initialData={initialData} />;
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
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
      <AdminBookingsData searchParams={searchParams} />
    </Suspense>
  );
}
