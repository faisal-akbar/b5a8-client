import { Suspense } from "react"
import { TouristDashboardClient } from "./tourist-dashboard-client"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { getMyBookings } from "@/services/booking/booking.service"
import { getMyWishlist } from "@/services/wishlist/wishlist.service"
import { getMyReviews } from "@/services/review/review.service"

export const dynamic = "force-dynamic"

// Types for API responses
interface Listing {
  id: string
  title: string
  description?: string
  location?: string
  city: string
  price?: number
  tourFee: number
  duration?: number
  durationDays?: number
  maxGroupSize?: number
  images: string[]
  category?: string
  guide?: {
    id: string
    name: string
    email: string
    profileImage?: string
    averageRating?: number
    user?: {
      id: string
      name: string
      profilePic: string | null
    }
  }
  _count?: {
    bookings: number
    reviews: number
  }
}

interface ApiBooking {
  id: string
  listingId: string
  touristId: string
  guideId: string
  date: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  numberOfGuests: number
  totalPrice?: number
  createdAt: string
  updatedAt: string
  listing: {
    id: string
    title: string
    images: string[]
    tourFee: number
    city: string
  }
  tourist: {
    id: string
    travelPreferences: string[]
    user: {
      id: string
      name: string
      profilePic: string | null
    }
  }
  guide: {
    id: string
    expertise: string[]
    dailyRate: number
    stripeAccountId: string | null
    user: {
      id: string
      name: string
      profilePic: string | null
    }
  }
  payment: any | null
  review?: {
    id: string
    rating: number
    comment: string
  }
}

interface WishlistItem {
  id: string
  listingId: string
  touristId: string
  createdAt: string
  listing: Listing
}

type Booking = {
  id: string
  tourTitle: string
  tourImage: string
  guide: string
  guideImage: string | null
  location: string
  city: string
  date: string
  guests: number
  price: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  createdAt: string
  paymentStatus: string
  rating?: number
  reviewed?: boolean
}

type WishlistTableItem = {
  id: string
  tourTitle: string
  tourImage: string
  guide: string
  location: string
  category: string
  price: number
  durationDays: number
  bookingsCount: number
  reviewsCount: number
  listingId: string
}

type TouristReview = {
  id: string
  rating: number
  comment: string
  createdAt: string
  listing: {
    title: string
  } | null
  guide: {
    user: {
      name: string
    }
  } | null
}

// Transform API booking to table booking
function transformBooking(apiBooking: ApiBooking): Booking {
  try {
    return {
      id: apiBooking.id,
      tourTitle: apiBooking.listing?.title || "Unknown Tour",
      tourImage: apiBooking.listing?.images?.[0] || "/placeholder.svg",
      guide: apiBooking.guide?.user?.name || "Unknown Guide",
      guideImage: apiBooking.guide?.user?.profilePic || null,
      location: apiBooking.listing?.city || "Unknown Location",
      city: apiBooking.listing?.city || "Unknown City",
      date: apiBooking.date,
      guests: apiBooking.numberOfGuests || 1,
      price: apiBooking.totalPrice || apiBooking.listing?.tourFee || 0,
      status: (apiBooking.status || "PENDING").toLowerCase() as "confirmed" | "pending" | "completed" | "cancelled",
      createdAt: apiBooking.createdAt,
      paymentStatus: apiBooking.payment ? "Paid" : "Pending",
      rating: apiBooking.review?.rating,
      reviewed: !!apiBooking.review,
    }
  } catch (error) {
    console.error("Error transforming booking:", error, apiBooking)
    throw error
  }
}

// Transform wishlist item to table item
function transformWishlistItem(item: WishlistItem): WishlistTableItem {
  try {
    return {
      id: item.id,
      tourTitle: item.listing?.title || "Unknown Tour",
      tourImage: item.listing?.images?.[0] || "/placeholder.svg",
      guide: item.listing?.guide?.user?.name || "N/A",
      location: item.listing?.city || "Unknown",
      category: item.listing?.category || "General",
      price: item.listing?.tourFee || 0,
      durationDays: item.listing?.durationDays || item.listing?.duration || 0,
      bookingsCount: item.listing?._count?.bookings || 0,
      reviewsCount: item.listing?._count?.reviews || 0,
      listingId: item.listingId,
    }
  } catch (error) {
    console.error("Error transforming wishlist item:", error, item)
    throw error
  }
}

export default async function TouristDashboardPage() {
  try {
    // Fetch all data in parallel
    const [upcomingResult, pendingResult, pastResult, wishlistResult, reviewsResult] = await Promise.all([
      getMyBookings({ type: "upcoming", status: "CONFIRMED" }),
      getMyBookings({ status: "PENDING" }),
      getMyBookings({ type: "past", status: "COMPLETED" }),
      getMyWishlist({}),
      getMyReviews({ limit: 50 }),
    ])

    // Process upcoming bookings
    const upcomingBookings: Booking[] = upcomingResult.success && upcomingResult.data
      ? (upcomingResult.data.bookings || []).map(transformBooking)
      : []

    // Process pending bookings
    const pendingBookings: Booking[] = pendingResult.success && pendingResult.data
      ? (pendingResult.data.bookings || []).map(transformBooking)
      : []

    // Process past bookings
    const pastBookings: Booking[] = pastResult.success && pastResult.data
      ? (pastResult.data.bookings || []).map(transformBooking)
      : []

    // Process wishlist
    const wishlistItems: WishlistTableItem[] = wishlistResult.success && wishlistResult.data
      ? (wishlistResult.data.wishlist || []).map(transformWishlistItem)
      : []

    // Process reviews
    const reviews: TouristReview[] = reviewsResult.success && reviewsResult.data
      ? (reviewsResult.data.data || [])
      : []

    // Calculate stats from real data
    const stats = {
      upcomingTrips: upcomingBookings.length,
      completedTrips: pastBookings.filter(b => b.status === "completed").length,
      wishlist: wishlistItems.length,
      totalSpent: pastBookings.reduce((sum, b) => sum + b.price, 0),
    }

    return (
      <Suspense fallback={
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 bg-muted/30 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <DashboardSkeleton />
            </div>
          </main>
        </div>
      }>
        <TouristDashboardClient
          upcomingBookings={upcomingBookings}
          pendingBookings={pendingBookings}
          pastBookings={pastBookings}
          wishlistItems={wishlistItems}
          reviews={reviews}
          stats={stats}
        />
      </Suspense>
    )
  } catch (error) {
    console.error("Error fetching tourist dashboard data:", error)
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    )
  }
}
