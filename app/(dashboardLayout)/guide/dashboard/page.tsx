import { Suspense } from "react"
import { GuideDashboardClient } from "./guide-dashboard-client"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { Footer } from "@/components/layout/footer"
import { getMyListings } from "@/services/listing/listing.service"
import { getMyBookings } from "@/services/booking/booking.service"
import { getPayments } from "@/services/payment/payment.service"
import { getMyProfile } from "@/services/user/user.service"
import { getMyReviews } from "@/services/review/review.service"
import { getGuideBadges } from "@/services/badge/badge.service"
import { getReviews } from "@/services/review/review.service"
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
  const bookingsLimit = (activeTab === "upcoming" || activeTab === "pending") ? limit : 100

  try {
    // Fetch all data in parallel with pagination based on active tab
    const [listingsResult, upcomingBookingsResult, pendingBookingsResult, paymentsResult, profileResult, reviewsResult] = await Promise.all([
      getMyListings({ page: activeTab === "listings" ? page : 1, limit: listingsLimit }),
      getMyBookings({ status: "CONFIRMED", type: "upcoming", page: activeTab === "upcoming" ? page : 1, limit: bookingsLimit }),
      getMyBookings({ status: "PENDING", page: activeTab === "pending" ? page : 1, limit: bookingsLimit }),
      getPayments({ page: 1, limit: 100 }),
      getMyProfile(),
      getMyReviews({ page: activeTab === "reviews" ? page : 1, limit: reviewsLimit }),
    ])

    // Process listings - fetch reviews for each to calculate average rating
    let processedListings: GuideListing[] = []
    let listingsTotal = 0
    let listingsTotalPages = 0
    
    if (listingsResult.success && listingsResult.data) {
      // Listing service returns: { success: true, data: { data: [...listings], meta: {...} } }
      const listings = Array.isArray(listingsResult.data)
        ? listingsResult.data
        : (listingsResult.data.data || [])
      const listingsMeta = Array.isArray(listingsResult.data)
        ? {}
        : (listingsResult.data.meta || {})
      
      listingsTotal = listingsMeta.total ?? listings.length
      listingsTotalPages = listingsMeta.totalPages ?? (listings.length > 0 ? Math.max(1, Math.ceil(listingsTotal / listingsLimit)) : 0)

      // Debug logging for listings pagination
      console.log("[SERVER] Listings pagination:", {
        activeTab,
        page,
        listingsLimit,
        listingsResultSuccess: listingsResult.success,
        listingsDataStructure: listingsResult.data ? (Array.isArray(listingsResult.data) ? "array" : "object") : "null",
        listingsCount: listings.length,
        listingsTotal,
        listingsTotalPages,
        listingsMeta,
        firstListing: listings[0]?.id,
      })
      
      // Fetch reviews for each listing to calculate average rating
      const listingsWithRatings = await Promise.all(
        listings.map(async (listing: any) => {
          try {
            // Fetch reviews for this specific listing
            const reviewsResult = await getReviews({ listingId: listing.id, page: 1, limit: 100 })
            if (reviewsResult.success && reviewsResult.data) {
              const listingReviews = reviewsResult.data.data || []

              if (listingReviews.length > 0) {
                const totalRating = listingReviews.reduce(
                  (sum: number, review: any) => sum + (review.rating || 0),
                  0
                )
                const averageRating = totalRating / listingReviews.length
                return {
                  ...listing,
                  averageRating: Math.round(averageRating * 10) / 10,
                  reviewsCount: listingReviews.length,
                  bookingsCount: listing._count?.bookings || 0,
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching reviews for listing ${listing.id}:`, error)
          }
          // Return listing with reviewsCount from _count if no reviews found
          return {
            ...listing,
            averageRating: 0,
            reviewsCount: listing._count?.reviews || 0,
            bookingsCount: listing._count?.bookings || 0,
          }
        })
      )
      
      processedListings = listingsWithRatings
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

    // Process payments for earnings
    // Payment service returns: { success: true, data: { data: [...payments], meta: {...} } }
    const payments: GuidePayment[] = paymentsResult.success && paymentsResult.data
      ? (Array.isArray(paymentsResult.data)
          ? paymentsResult.data
          : (Array.isArray(paymentsResult.data.data)
              ? paymentsResult.data.data
              : []))
      : []

    // Debug logging for payments
    console.log("[SERVER] Dashboard payments:", {
      paymentsResultSuccess: paymentsResult.success,
      paymentsDataStructure: paymentsResult.data ? (Array.isArray(paymentsResult.data) ? "array" : "object") : "null",
      paymentsCount: payments.length,
      firstPayment: payments[0]?.id,
      samplePayment: payments[0],
    })

    const totalEarnings = payments
      .filter((p: GuidePayment) => p.status === "COMPLETED" || p.status === "RELEASED")
      .reduce((sum: number, p: GuidePayment) => sum + p.amount, 0)

    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const thisMonthEarnings = payments
      .filter((p: GuidePayment) => {
        const paymentDate = new Date(p.createdAt)
        return (
          (p.status === "COMPLETED" || p.status === "RELEASED") &&
          paymentDate.getMonth() === thisMonth &&
          paymentDate.getFullYear() === thisYear
        )
      })
      .reduce((sum: number, p: GuidePayment) => sum + p.amount, 0)

    // Count upcoming tours (next 30 days)
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const upcomingCount = upcomingBookings.filter((b: GuideBooking) => {
      const bookingDate = new Date(b.date)
      return bookingDate >= now && bookingDate <= thirtyDaysFromNow
    }).length

    // Process profile for ratings and badges
    let stats: GuideStats = {
      totalEarnings,
      thisMonthEarnings,
      upcomingTours: upcomingCount,
      totalReviews: 0,
      averageRating: 0,
      totalTours: processedListings.length,
      activeTours: processedListings.filter((l) => l.isActive).length,
    }

    let badges: GuideBadge[] = []
    let guideId: string | null = null

    if (profileResult.success && profileResult.data) {
      const profile = profileResult.data
      if (profile.role === "GUIDE") {
        const profileStats = (profile as any).stats || {}
        guideId = (profile as any).guide?.id || null

        const averageRating = profileStats.averageRating ?? 0
        const reviewsCount = profileStats.reviewsCount ?? 0

        stats = {
          ...stats,
          totalReviews: reviewsCount,
          averageRating: averageRating,
        }

        // Fetch badges if we have guide ID
        if (guideId) {
          const badgesResult = await getGuideBadges(guideId)
          if (badgesResult.success && badgesResult.data) {
            badges = badgesResult.data.data || []
          }
        }
      }
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
      payments,
      stats,
      badges,
      reviews,
      reviewsTotal,
      reviewsTotalPages,
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
          <Footer />
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
        <Footer />
      </div>
    )
  }
}
