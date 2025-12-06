import { Suspense } from "react"
import { GuideDashboardClient } from "./guide-dashboard-client"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { Footer } from "@/components/layout/footer"
import { getMyListings } from "@/services/listing/listing.service"
import { getMyBookings } from "@/services/booking/booking.service"
import { getMyProfile } from "@/services/user/user.service"
import { getMyReviews } from "@/services/review/review.service"
import { getGuideBadges } from "@/services/badge/badge.service"
import { getGuideInfoStats } from "@/services/stats/stats.service"
import type { GuideListing, GuideBooking, GuideStats, GuideReview, GuideBadge, GuidePayment } from "@/types/guide"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    tab?: string
    page?: string
    limit?: string
    refresh?: string
  }>
}

export default async function GuideDashboardPage({ searchParams }: PageProps) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams
  
  // Get active tab and pagination from URL
  const activeTab = params.tab || "upcoming"
  const page = parseInt(params.page || "1", 10)
  const limit = parseInt(params.limit || "10", 10)
  
  // Different default limits for different tabs
  const reviewsLimit = activeTab === "reviews" ? parseInt(params.limit || "5", 10) : limit
  const listingsLimit = activeTab === "listings" ? limit : 100
  const bookingsLimit = (activeTab === "upcoming" || activeTab === "pending" || activeTab === "completed") ? limit : 100

  try {
    // Fetch all data in parallel with pagination based on active tab
    const [listingsResult, upcomingBookingsResult, pendingBookingsResult, completedBookingsResult, profileResult, reviewsResult, guideStatsResult] = await Promise.all([
      getMyListings({ page: activeTab === "listings" ? page : 1, limit: listingsLimit }),
      getMyBookings({ status: "CONFIRMED", type: "upcoming", page: activeTab === "upcoming" ? page : 1, limit: bookingsLimit }),
      getMyBookings({ status: "PENDING", page: activeTab === "pending" ? page : 1, limit: bookingsLimit }),
      getMyBookings({ status: "COMPLETED", page: activeTab === "completed" ? page : 1, limit: bookingsLimit }),
      getMyProfile(),
      getMyReviews({ page: activeTab === "reviews" ? page : 1, limit: reviewsLimit }),
      getGuideInfoStats(),
    ])

    // Process listings - use averageRating from API response
    let processedListings: GuideListing[] = []
    let listingsTotal = 0
    let listingsTotalPages = 0
    
    if (listingsResult.success && listingsResult.data) {
      // Listing service returns: { success: true, data: { data: [...listings], meta: {...} } }
      // averageRating is already included in the API response
      const listings = Array.isArray(listingsResult.data)
        ? listingsResult.data
        : (listingsResult.data.data || [])
      const listingsMeta = Array.isArray(listingsResult.data)
        ? {}
        : (listingsResult.data.meta || {})
      
      listingsTotal = listingsMeta.total ?? listings.length
      listingsTotalPages = listingsMeta.totalPages ?? (listings.length > 0 ? Math.max(1, Math.ceil(listingsTotal / listingsLimit)) : 0)

      // Use averageRating directly from API response
      // Also ensure reviewsCount and bookingsCount are available from _count
      processedListings = listings.map((listing: any) => ({
        ...listing,
        // averageRating is already in the API response, use it as-is
        // If not present, default to null
        averageRating: listing.averageRating ?? null,
        // Support both _count.reviews (from API) and reviewsCount (if already transformed)
        reviewsCount: listing._count?.reviews ?? listing.reviewsCount ?? 0,
        // Support both _count.bookings (from API) and bookingsCount (if already transformed)
        bookingsCount: listing._count?.bookings ?? listing.bookingsCount ?? 0,
      }))
    }

    // Process upcoming bookings with pagination
    // Booking service returns: { success: true, data: { data: [...bookings], meta: {...} } } or { success: true, data: [...bookings] }
    const upcomingBookings: GuideBooking[] = upcomingBookingsResult.success && upcomingBookingsResult.data
      ? (Array.isArray(upcomingBookingsResult.data) 
          ? upcomingBookingsResult.data 
          : (upcomingBookingsResult.data.data || []))
      : []
    
    const upcomingBookingsMeta = upcomingBookingsResult.success && upcomingBookingsResult.data && !Array.isArray(upcomingBookingsResult.data)
      ? upcomingBookingsResult.data.meta || {}
      : {}
    
    const upcomingBookingsTotal = upcomingBookingsMeta.total ?? upcomingBookings.length
    const upcomingBookingsTotalPages = upcomingBookingsMeta.totalPages ?? (upcomingBookings.length > 0 ? Math.max(1, Math.ceil(upcomingBookingsTotal / bookingsLimit)) : 0)

    // Process pending bookings with pagination
    const pendingRequests: GuideBooking[] = pendingBookingsResult.success && pendingBookingsResult.data
      ? (Array.isArray(pendingBookingsResult.data) 
          ? pendingBookingsResult.data 
          : (pendingBookingsResult.data.data || []))
      : []
    
    const pendingBookingsMeta = pendingBookingsResult.success && pendingBookingsResult.data && !Array.isArray(pendingBookingsResult.data)
      ? pendingBookingsResult.data.meta || {}
      : {}
    
    const pendingBookingsTotal = pendingBookingsMeta.total ?? pendingRequests.length
    const pendingBookingsTotalPages = pendingBookingsMeta.totalPages ?? (pendingRequests.length > 0 ? Math.max(1, Math.ceil(pendingBookingsTotal / bookingsLimit)) : 0)

    // Process completed bookings with pagination
    const completedBookings: GuideBooking[] = completedBookingsResult.success && completedBookingsResult.data
      ? (Array.isArray(completedBookingsResult.data) 
          ? completedBookingsResult.data 
          : (completedBookingsResult.data.data || []))
      : []
    
    const completedBookingsMeta = completedBookingsResult.success && completedBookingsResult.data && !Array.isArray(completedBookingsResult.data)
      ? completedBookingsResult.data.meta || {}
      : {}
    
    const completedBookingsTotal = completedBookingsMeta.total ?? completedBookings.length
    const completedBookingsTotalPages = completedBookingsMeta.totalPages ?? (completedBookings.length > 0 ? Math.max(1, Math.ceil(completedBookingsTotal / bookingsLimit)) : 0)

    // Get guide stats from API
    const guideStatsData = guideStatsResult.success && guideStatsResult.data
      ? guideStatsResult.data
      : {
          totalEarnings: 0,
          totalCompletedBookings: 0,
          averageRating: 0,
          totalActiveTours: 0,
        }

    // Process profile for badges
    let badges: GuideBadge[] = []
    let guideId: string | null = null

    if (profileResult.success && profileResult.data) {
      const profile = profileResult.data
      if (profile.role === "GUIDE") {
        guideId = (profile as any).guide?.id || null

        // Fetch badges if we have guide ID
        if (guideId) {
          const badgesResult = await getGuideBadges(guideId)
          if (badgesResult.success && badgesResult.data) {
            badges = badgesResult.data.data || []
          }
        }
      }
    }

    // Build stats from API response
    const stats: GuideStats = {
      totalEarnings: guideStatsData.totalEarnings || 0,
      thisMonthEarnings: 0, // Not provided by API, keeping for compatibility
      upcomingTours: 0, // Not used anymore, keeping for compatibility
      totalReviews: 0, // Not provided by API, keeping for compatibility
      averageRating: guideStatsData.averageRating || 0,
      totalTours: processedListings.length,
      activeTours: guideStatsData.totalActiveTours || 0,
      totalCompletedBookings: guideStatsData.totalCompletedBookings || 0,
    }

    // Process reviews
    const reviews: GuideReview[] = reviewsResult.success && reviewsResult.data
      ? reviewsResult.data.data || []
      : []

    const reviewsMeta = reviewsResult.success && reviewsResult.data
      ? reviewsResult.data.meta || {}
      : {}

    const reviewsTotal = reviewsMeta.total ?? reviews.length
    const reviewsTotalPages = reviewsMeta.totalPages ?? (reviews.length > 0 ? Math.max(1, Math.ceil(reviewsTotal / reviewsLimit)) : 0)

    const initialData = {
      listings: processedListings,
      listingsTotal,
      listingsTotalPages,
      upcomingBookings,
      upcomingBookingsTotal,
      upcomingBookingsTotalPages,
      pendingRequests,
      pendingBookingsTotal,
      pendingBookingsTotalPages,
      completedBookings,
      completedBookingsTotal,
      completedBookingsTotalPages,
      stats,
      badges,
      reviews,
      reviewsTotal,
      reviewsTotalPages,
      activeTab,
      currentPage: page,
      currentLimit: limit,
    }
   // console.log("[SERVER] Initial data:", initialData)

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
        <GuideDashboardClient initialData={initialData} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
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
