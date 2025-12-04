import { getUserInfo } from "@/services/auth/getUserInfo"
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

    // Mock profile data - in real app, fetch from API based on user ID and role
    const mockBaseProfile = {
        id: userInfo.id || "1",
        email: userInfo.email || "user@example.com",
        name: userInfo.name || "User Name",
        bio: "Passionate about exploring new cultures and sharing experiences with travelers from around the world.",
        profilePic: userInfo.profilePic || null,
        languages: ["English", "Spanish"],
        isActive: "ACTIVE" as const,
        isVerified: true,
        createdAt: new Date("2023-06-15"),
        updatedAt: new Date(),
    }

    // Render appropriate profile based on role
    if (userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN") {
        const adminProfile: AdminProfileType = {
            ...mockBaseProfile,
            role: userInfo.role as "ADMIN" | "SUPER_ADMIN",
            admin: {
                id: mockBaseProfile.id,
            },
        }

        return (
            <div className="min-h-screen bg-muted/30 py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <AdminProfile profile={adminProfile} />
                </div>
            </div>
        )
    }

    if (userInfo.role === "GUIDE") {
        const guideProfile: GuideProfileType = {
            ...mockBaseProfile,
            role: "GUIDE",
            guide: {
                id: mockBaseProfile.id,
                expertise: ["History", "Food & Drink", "Music", "Architecture"],
                dailyRate: 150,
                stripeAccountId: "acct_123456789",
                listingsCount: 8,
                bookingsCount: 127,
                reviewsCount: 94,
                averageRating: 4.9,
                totalEarnings: 18500,
                badges: [
                    {
                        id: "1",
                        badge: "SUPER_GUIDE" as const,
                        createdAt: new Date("2023-12-01"),
                    },
                    {
                        id: "2",
                        badge: "HIGHLY_RATED" as const,
                        createdAt: new Date("2024-01-15"),
                    },
                ],
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
        const touristProfile: TouristProfileType = {
            ...mockBaseProfile,
            role: "TOURIST",
            tourist: {
                id: mockBaseProfile.id,
                travelPreferences: ["Culture", "Food", "History", "Adventure"],
                bookingsCount: 12,
                reviewsCount: 8,
                wishlistCount: 5,
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
