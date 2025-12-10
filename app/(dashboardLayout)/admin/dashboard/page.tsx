import { Suspense } from "react"
import { AdminDashboardClient } from "./admin-dashboard-client"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { 
  getOverviewStats,
  getUserStats,
  getGuideStats,
  getTouristStats,
  getListingStats,
  getBookingStats,
  getRevenueStats,
} from "@/services/stats/stats.service"
import { getAllUsers } from "@/services/user/user.service"
import { getAllListings } from "@/services/listing/listing.service"
import { getAllBookings } from "@/services/booking/booking.service"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    tab?: string
    page?: string
    limit?: string
  }>
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeTab = params.tab || "overview"
  const page = parseInt(params.page || "1", 10)
  const limit = parseInt(params.limit || "10", 10)

  try {
    // Fetch all stats in parallel
    const [
      overviewResult,
      userStatsResult,
      guideStatsResult,
      touristStatsResult,
      listingStatsResult,
      bookingStatsResult,
      revenueStatsResult,
      usersResult,
      listingsResult,
      bookingsResult,
    ] = await Promise.all([
      getOverviewStats(),
      getUserStats(),
      getGuideStats(),
      getTouristStats(),
      getListingStats(),
      getBookingStats(),
      getRevenueStats(),
      getAllUsers({ page: 1, limit: 5 }),
      getAllListings({ page: 1, limit: 5 }),
      getAllBookings({ page: 1, limit: 5 }),
    ])

    const stats = {
      overview: overviewResult.success ? overviewResult.data : {},
      users: userStatsResult.success ? userStatsResult.data : {},
      guides: guideStatsResult.success ? guideStatsResult.data : {},
      tourists: touristStatsResult.success ? touristStatsResult.data : {},
      listings: listingStatsResult.success ? listingStatsResult.data : {},
      bookings: bookingStatsResult.success ? bookingStatsResult.data : {},
      revenue: revenueStatsResult.success ? revenueStatsResult.data : {},
    }

    const recentUsers = usersResult.success && usersResult.data ? usersResult.data.data || [] : []
    const recentListings = listingsResult.success && listingsResult.data ? listingsResult.data.data || [] : []
    const recentBookings = bookingsResult.success && bookingsResult.data ? bookingsResult.data || [] : []

    const initialData = {
      stats,
      recentUsers,
      recentListings,
      recentBookings,
      activeTab,
      currentPage: page,
      currentLimit: limit,
    }

    return (
      <Suspense fallback={
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 bg-muted/30 py-8">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <DashboardSkeleton />
            </div>
          </main>
        </div>
      }>
        <AdminDashboardClient initialData={initialData} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    )
  }
}
