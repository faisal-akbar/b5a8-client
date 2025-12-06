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
  searchParams: {
    page?: string
    limit?: string
    refresh?: string
  }
}

export default async function GuideDashboardPage({ searchParams }: PageProps) {
  // Get pagination from URL
  const reviewsPage = parseInt(searchParams.page || "1", 10)
  const reviewsLimit = parseInt(searchParams.limit || "5", 10)

  try {
    // Fetch all data in parallel
    const [listingsResult, upcomingBookingsResult, pendingBookingsResult, paymentsResult, profileResult, reviewsResult] = await Promise.all([
      getMyListings({ page: 1, limit: 100 }),
      getMyBookings({ status: "CONFIRMED", type: "upcoming" }),
      getMyBookings({ status: "PENDING" }),
      getPayments({ page: 1, limit: 100 }),
      getMyProfile(),
      getMyReviews({ page: reviewsPage, limit: reviewsLimit }),
    ])

    // Process listings - fetch reviews for each to calculate average rating
    let processedListings: GuideListing[] = []
    if (listingsResult.success && listingsResult.data) {
      const listings = listingsResult.data.data || []
      
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

    // Process upcoming bookings
    const upcomingBookings: GuideBooking[] = upcomingBookingsResult.success && upcomingBookingsResult.data
      ? upcomingBookingsResult.data.data || []
      : []

    // Process pending bookings
    const pendingRequests: GuideBooking[] = pendingBookingsResult.success && pendingBookingsResult.data
      ? pendingBookingsResult.data.data || []
      : []

    // Process payments for earnings
    const payments: GuidePayment[] = paymentsResult.success && paymentsResult.data
      ? paymentsResult.data.data || []
      : []

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
      upcomingBookings,
      pendingRequests,
      payments,
      stats,
      badges,
      reviews,
      reviewsTotal,
      reviewsTotalPages,
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
