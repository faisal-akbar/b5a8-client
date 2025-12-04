// Type definitions based on Prisma schema
export type Role = "TOURIST" | "GUIDE" | "ADMIN" | "SUPER_ADMIN"
export type Badge = "SUPER_GUIDE" | "NEWCOMER" | "FOODIE_EXPERT" | "HIGHLY_RATED" | "POPULAR"
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
export type Category = "CULTURE" | "HISTORY" | "FOOD" | "ADVENTURE" | "NATURE" | "ART" | "ARCHITECTURE" | "BEACH" | "WILDLIFE" | "SHOPPING" | "NIGHTLIFE" | "PHOTOGRAPHY" | "MUSIC" | "RELIGION" | "SPORTS" | "WELLNESS" | "FAMILY" | "HERITAGE" | "WATER_SPORTS" | "HIKING" | "CYCLING" | "MARKETS" | "FESTIVALS" | "LOCAL_LIFE" | "HIDDEN_GEMS" | "MUSEUM" | "ENTERTAINMENT" | "CULINARY" | "SPIRITUAL" | "ECO_TOURISM" | "URBAN_EXPLORATION" | "COUNTRYSIDE" | "MOUNTAIN" | "CAMPING" | "DIVING" | "SURFING" | "FOOD_TOUR" | "STREET_FOOD"


// Base User Profile
export interface BaseProfile {
    id: string
    email: string
    name: string
    bio?: string | null
    profilePic?: string | null
    languages: string[]
    isActive: string
    isVerified: boolean
    role: Role
    createdAt: Date
    updatedAt: Date
}

// Tourist Profile
export interface TouristProfile extends BaseProfile {
    role: "TOURIST"
    tourist: {
        id: string
        travelPreferences: string[]
        bookingsCount: number
        reviewsCount: number
        wishlistCount: number
    }
}

// Guide Profile
export interface GuideProfile extends BaseProfile {
    role: "GUIDE"
    guide: {
        id: string
        expertise: string[]
        dailyRate: number
        stripeAccountId?: string | null
        listingsCount: number
        bookingsCount: number
        reviewsCount: number
        averageRating: number
        totalEarnings: number
        badges: GuideBadgeData[]
    }
}

// Admin Profile
export interface AdminProfile extends BaseProfile {
    role: "ADMIN" | "SUPER_ADMIN"
    admin: {
        id: string
    }
}

// Union type for all profiles
export type UserProfile = TouristProfile | GuideProfile | AdminProfile

// Supporting types
export interface GuideBadgeData {
    id: string
    badge: Badge
    createdAt: Date
}

export interface BookingData {
    id: string
    date: Date
    status: BookingStatus
    listing: {
        id: string
        title: string
        city: string
        category: Category
        tourFee: number
        images: string[]
    }
    guide?: {
        id: string
        user: {
            name: string
            profilePic?: string | null
        }
    }
    tourist?: {
        id: string
        user: {
            name: string
            profilePic?: string | null
        }
    }
}

export interface ReviewData {
    id: string
    rating: number
    comment?: string | null
    createdAt: Date
    tourist?: {
        user: {
            name: string
            profilePic?: string | null
        }
    }
    guide?: {
        user: {
            name: string
            profilePic?: string | null
        }
    }
    listing: {
        title: string
    }
}

export interface ListingData {
    id: string
    title: string
    description: string
    tourFee: number
    durationDays: number
    city: string
    category: Category
    images: string[]
    isActive: boolean
    bookingsCount: number
    averageRating: number
    reviewsCount: number
}

export interface WishlistData {
    id: string
    listing: {
        id: string
        title: string
        city: string
        category: Category
        tourFee: number
        images: string[]
        guide: {
            user: {
                name: string
            }
        }
    }
    createdAt: Date
}

// Profile stats
export interface ProfileStats {
    totalBookings?: number
    totalTours?: number
    totalReviews?: number
    averageRating?: number
    totalEarnings?: number
    wishlistCount?: number
    completedBookings?: number
}
