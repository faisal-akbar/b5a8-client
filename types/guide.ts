// Guide-specific type definitions based on API responses

import type { BookingStatus, Category } from "./profile"

// Guide Listing (from API response)
export interface GuideListing {
  id: string
  title: string
  description: string
  itinerary: string
  tourFee: number
  durationDays: number
  meetingPoint: string
  maxGroupSize: number
  city: string
  category: Category
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  guide: {
    id: string
    user: {
      id: string
      name: string
    }
  }
  bookingsCount?: number
  averageRating?: number
  reviewsCount?: number
}

// Guide Booking (from API response)
export interface GuideBooking {
  id: string
  date: string
  status: BookingStatus
  listing: {
    id: string
    title: string
    city: string
    category: Category
    tourFee: number
    images: string[]
    meetingPoint: string
    maxGroupSize: number
  }
  tourist: {
    id: string
    user: {
      id: string
      name: string
      email: string
      profilePic?: string | null
    }
  }
  createdAt: string
  updatedAt: string
}

// Guide Availability (from API response)
export interface GuideAvailability {
  id: string
  listingId: string
  startDateTime: string
  endDateTime: string
  isAvailable: boolean
  listing?: {
    id: string
    title: string
  }
  createdAt: string
  updatedAt: string
}

// Guide Payment (from API response)
export interface GuidePayment {
  id: string
  amount: number
  status: "PENDING" | "COMPLETED" | "RELEASED" | "REFUNDED"
  paymentIntentId?: string | null
  booking: {
    id: string
    date: string
    status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
    listing: {
      id: string
      title: string
    }
    tourist: {
      user: {
        name: string
        email: string
      }
    }
  }
  createdAt: string
  updatedAt: string
  releasedAt?: string | null
}

// Guide Review (from API response)
export interface GuideReview {
  id: string
  rating: number
  comment?: string | null
  listing: {
    id: string
    title: string
  }
  tourist: {
    user: {
      name: string
      profilePic?: string | null
    }
  }
  createdAt: string
}

// Guide Badge (from API response)
export interface GuideBadge {
  id: string
  badge: "SUPER_GUIDE" | "NEWCOMER" | "FOODIE_EXPERT" | "HIGHLY_RATED" | "POPULAR"
  createdAt: string
}

// Guide Stats (computed from API data)
export interface GuideStats {
  totalEarnings: number
  thisMonthEarnings: number
  upcomingTours: number
  totalReviews: number
  averageRating: number
  totalTours: number
  activeTours: number
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

