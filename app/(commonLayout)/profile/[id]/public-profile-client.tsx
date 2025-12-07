"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProfileHeader } from "@/components/profile/profile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Briefcase, DollarSign, Star, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

interface Review {
    id: string
    rating: number
    comment: string
    touristId: string
    guideId: string
    listingId: string
    bookingId: string
    createdAt: string
    updatedAt: string
}

interface ReviewsData {
    success: boolean
    data?: {
        meta: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
        data: Review[]
    }
    message?: string
}

interface PublicProfileClientProps {
    userData: any
    reviewsData: ReviewsData
}

export function PublicProfileClient({ userData, reviewsData }: PublicProfileClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Get pagination from URL
    const currentPage = parseInt(searchParams.get("page") || "1", 10)
    const currentLimit = parseInt(searchParams.get("limit") || "10", 10)
    
    // Build base profile data
    const baseProfile = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        bio: userData.bio || null,
        profilePic: userData.profilePic || null,
        languages: userData.languages || [],
        isActive: userData.isActive || "ACTIVE",
        isVerified: userData.isVerified || false,
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
    }

    // Extract reviews from the data structure
    const reviews = reviewsData?.data?.data || []
    const reviewsMeta = reviewsData?.data?.meta

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length
        : 0

    // Helper function to render star rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${
                    index < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                }`}
            />
        ))
    }

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    }

    // Update pagination
    const updatePagination = useCallback((page: number, limit: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        params.set("limit", limit.toString())
        router.push(`?${params.toString()}`)
        router.refresh()
    }, [router, searchParams])

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1 bg-muted/30 py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Profile Header - Without Edit Button */}
                        <div className="[&_button]:hidden">
                            <ProfileHeader
                                name={baseProfile.name}
                                email={baseProfile.email}
                                bio={baseProfile.bio}
                                profilePic={baseProfile.profilePic}
                                joinedDate={baseProfile.createdAt}
                                isVerified={baseProfile.isVerified}
                                languages={baseProfile.languages}
                                expertise={userData.expertise || []}
                                dailyRate={userData.dailyRate}
                                travelPreferences={userData.travelPreferences}
                            />
                        </div>

                        {/* Role-Specific Content */}
                        {userData.role === "GUIDE" && (
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Expertise Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Briefcase className="h-5 w-5" />
                                                Expertise
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {userData.expertise && userData.expertise.length > 0 ? (
                                                    userData.expertise.map((skill: string) => (
                                                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                                                            {skill}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">No expertise listed</p>
                                                )}
                                            </div>
                                            {userData.dailyRate && (
                                                <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Daily Rate</p>
                                                        <p className="text-2xl font-bold text-foreground">${userData.dailyRate}</p>
                                                    </div>
                                                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Badges Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="h-5 w-5" />
                                                Badges & Achievements
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {userData.badges && userData.badges.length > 0 ? (
                                                    userData.badges.map((badge: string, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3"
                                                        >
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                                <Award className="h-5 w-5 text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">
                                                                    {badge.replace(/_/g, " ")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        No badges earned yet
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        )}

                        {userData.role === "TOURIST" && userData.travelPreferences && userData.travelPreferences.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Award className="h-5 w-5" />
                                            Travel Preferences
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {userData.travelPreferences.map((pref: string) => (
                                                <Badge key={pref} variant="secondary" className="px-3 py-1">
                                                    {pref}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <MessageSquare className="h-5 w-5" />
                                                Reviews & Ratings
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-lg font-bold">
                                                        {averageRating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    ({reviewsMeta?.total} {reviewsMeta?.total === 1 ? "review" : "reviews"})
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {reviews.map((review: Review, index: number) => (
                                                <motion.div
                                                    key={review.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className="rounded-lg border bg-card p-4"
                                                >
                                                    <div className="space-y-2">
                                                        {/* Rating and Date */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDate(review.createdAt)}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Comment */}
                                                        <p className="text-sm text-foreground leading-relaxed">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {reviewsMeta && reviewsMeta.totalPages > 0 && (
                                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        {reviewsMeta.total} total
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-6 lg:space-x-8">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-sm font-medium">Page</p>
                                                        <Select
                                                            value={`${currentPage}`}
                                                            onValueChange={(value) => {
                                                                updatePagination(Number(value), currentLimit)
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 w-[70px]">
                                                                <SelectValue placeholder={currentPage} />
                                                            </SelectTrigger>
                                                            <SelectContent side="top">
                                                                {Array.from({ length: reviewsMeta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                                    <SelectItem key={pageNum} value={`${pageNum}`}>
                                                                        {pageNum}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <span className="text-sm text-muted-foreground">of {reviewsMeta.totalPages}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-sm font-medium">Rows per page</p>
                                                        <Select
                                                            value={`${currentLimit}`}
                                                            onValueChange={(value) => {
                                                                updatePagination(1, Number(value)) // Reset to page 1 when limit changes
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 w-[70px]">
                                                                <SelectValue placeholder={currentLimit} />
                                                            </SelectTrigger>
                                                            <SelectContent side="top">
                                                                {[5, 10, 20, 30].map((pageSize) => (
                                                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                                                        {pageSize}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
