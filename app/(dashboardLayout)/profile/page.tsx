import { getUserInfo } from "@/services/auth/getUserInfo"
import { getMyProfile } from "@/services/user/user.service"
import { getOverviewStats } from "@/services/stats/stats.service"
import { getPayments } from "@/services/payment/payment.service"
import { getMyListings } from "@/services/listing/listing.service"
import { getMyBookings } from "@/services/booking/booking.service"
import { getReviews } from "@/services/review/review.service"
import { redirect } from "next/navigation"
import { AdminProfile } from "@/components/profile/admin-profile"
import { GuideProfile } from "@/components/profile/guide-profile"
import { TouristProfile } from "@/components/profile/tourist-profile"
import type { AdminProfile as AdminProfileType, GuideProfile as GuideProfileType, TouristProfile as TouristProfileType } from "@/types/profile"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
    const userInfo = await getUserInfo()

    // Redirect if not logged in
    if (!userInfo?.role) {
        redirect("/login?redirect=/profile")
    }

    // Fetch real profile data from API
    const profileResult = await getMyProfile()
    
    if (!profileResult.success || !profileResult.data) {
        redirect("/login?redirect=/profile")
    }

    const profileData = profileResult.data
    const baseProfile = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        bio: profileData.bio || null,
        profilePic: profileData.profilePic || null,
        languages: profileData.languages || [],
        isActive: profileData.isActive || "ACTIVE",
        isVerified: profileData.isVerified || false,
        createdAt: new Date(profileData.createdAt),
        updatedAt: new Date(profileData.updatedAt),
    }

    // Render appropriate profile based on role
    if (userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN") {
        // Fetch admin stats
        const statsResult = await getOverviewStats()
        const stats = statsResult.success ? statsResult.data : null

        const adminProfile: AdminProfileType = {
            ...baseProfile,
            role: userInfo.role as "ADMIN" | "SUPER_ADMIN",
            admin: {
                id: baseProfile.id,
            },
        }

        return (
            <div className="min-h-screen bg-muted/30 py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <AdminProfile profile={adminProfile} stats={stats} />
                </div>
            </div>
        )
    }

    if (userInfo.role === "GUIDE") {
        // Fetch real data from APIs
        const [listingsResult, bookingsResult, paymentsResult] = await Promise.all([
            getMyListings({ page: 1, limit: 100 }),
            getMyBookings({ page: 1, limit: 100 }),
            getPayments({ page: 1, limit: 100 }),
        ])

        // Calculate listings count
        const listings = listingsResult.success && listingsResult.data ? listingsResult.data.data || [] : []
        const activeListings = listings.filter((l: any) => l.isActive)
        const listingsCount = activeListings.length

        // Calculate bookings count
        const bookings = bookingsResult.success && bookingsResult.data ? bookingsResult.data.data || [] : []
        const bookingsCount = bookings.length

        // Calculate reviews and average rating from all listings
        let allReviews: any[] = []
        for (const listing of listings) {
            const listingReviewsResult = await getReviews({ listingId: listing.id, page: 1, limit: 100 })
            if (listingReviewsResult.success && listingReviewsResult.data) {
                allReviews.push(...(listingReviewsResult.data.data || []))
            }
        }
        const reviewsCount = allReviews.length
        const averageRating = allReviews.length > 0
            ? allReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / allReviews.length
            : 0

        // Calculate total earnings from payments
        let totalEarnings = 0
        if (paymentsResult.success && paymentsResult.data) {
            const payments = paymentsResult.data.data || []
            totalEarnings = payments
                .filter((p: any) => p.status === "COMPLETED" || p.status === "RELEASED")
                .reduce((sum: number, p: any) => sum + p.amount, 0)
        }

        // Get badges from profile data or fetch from badges API
        const badges = (profileData.badges || []).map((badge: string, index: number) => ({
            id: `badge-${index}`,
            badge: badge as any,
            createdAt: new Date(),
        }))

        const guideProfile: GuideProfileType = {
            ...baseProfile,
            role: "GUIDE",
            guide: {
                id: baseProfile.id,
                expertise: profileData.expertise || [],
                dailyRate: profileData.dailyRate || 0,
                stripeAccountId: profileData.stripeAccountId || null,
                listingsCount: listingsCount,
                bookingsCount: bookingsCount,
                reviewsCount: reviewsCount,
                averageRating: averageRating,
                totalEarnings: totalEarnings,
                badges: badges,
            },
        }

        return (
            <div className="min-h-screen bg-muted/30 py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <GuideProfile profile={guideProfile} />
                </div>
            </div>
        )
    }

    if (userInfo.role === "TOURIST") {
        // For tourist, we need to fetch additional stats (bookings, reviews, wishlist)
        // These would ideally come from the API, but for now we'll use defaults
        const touristProfile: TouristProfileType = {
            ...baseProfile,
            role: "TOURIST",
            tourist: {
                id: baseProfile.id,
                travelPreferences: profileData.travelPreferences || [],
                bookingsCount: 0, // Would need to fetch from bookings API
                reviewsCount: 0, // Would need to fetch from reviews API
                wishlistCount: 0, // Would need to fetch from wishlist API
            },
        }

        return (
            <div className="min-h-screen bg-muted/30 py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <TouristProfile profile={touristProfile} />
                </div>
            </div>
        )
    }

    // Fallback - should not reach here
    redirect("/")
}
