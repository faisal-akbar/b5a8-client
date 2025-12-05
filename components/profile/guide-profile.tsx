"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStatsCard } from "@/components/profile/profile-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuideProfile as GuideProfileType } from "@/types/profile"
import { MapPin, Star, DollarSign, Calendar, Award, TrendingUp, Briefcase, Loader2, LayoutDashboard, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getMyListings } from "@/services/listing/listing.service"
import { getMyBookings } from "@/services/booking/booking.service"
import { getPayments } from "@/services/payment/payment.service"
import type { GuideListing, GuideBooking } from "@/types/guide"
import { Skeleton } from "@/components/ui/skeleton"

interface GuideProfileProps {
    profile: GuideProfileType
}

export function GuideProfile({ profile }: GuideProfileProps) {
    const { guide } = profile
    const [isLoading, setIsLoading] = useState(true)
    const [myTours, setMyTours] = useState<GuideListing[]>([])
    const [upcomingBookings, setUpcomingBookings] = useState<GuideBooking[]>([])
    const [totalEarnings, setTotalEarnings] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const [listingsResult, bookingsResult, paymentsResult] = await Promise.all([
                    getMyListings({ page: 1, limit: 10 }),
                    getMyBookings({ status: "CONFIRMED", type: "upcoming" }),
                    getPayments({ page: 1, limit: 100 }),
                ])

                if (listingsResult.success && listingsResult.data) {
                    setMyTours(listingsResult.data.data || [])
                }

                if (bookingsResult.success && bookingsResult.data) {
                    setUpcomingBookings(bookingsResult.data.data || [])
                }

                if (paymentsResult.success && paymentsResult.data) {
                    const payments = paymentsResult.data.data || []
                    const earnings = payments
                        .filter((p: any) => p.status === "COMPLETED" || p.status === "RELEASED")
                        .reduce((sum: number, p: any) => sum + p.amount, 0)
                    setTotalEarnings(earnings)
                }
            } catch (error) {
                console.error("Error fetching profile data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="flex gap-2 justify-end">
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsLoading(true)
                        const fetchData = async () => {
                            try {
                                const [listingsResult, bookingsResult, paymentsResult] = await Promise.all([
                                    getMyListings({ page: 1, limit: 10 }),
                                    getMyBookings({ status: "CONFIRMED", type: "upcoming" }),
                                    getPayments({ page: 1, limit: 100 }),
                                ])

                                if (listingsResult.success && listingsResult.data) {
                                    setMyTours(listingsResult.data.data || [])
                                }

                                if (bookingsResult.success && bookingsResult.data) {
                                    setUpcomingBookings(bookingsResult.data.data || [])
                                }

                                if (paymentsResult.success && paymentsResult.data) {
                                    const payments = paymentsResult.data.data || []
                                    const earnings = payments
                                        .filter((p: any) => p.status === "COMPLETED" || p.status === "RELEASED")
                                        .reduce((sum: number, p: any) => sum + p.amount, 0)
                                    setTotalEarnings(earnings)
                                }
                            } catch (error) {
                                console.error("Error fetching profile data:", error)
                            } finally {
                                setIsLoading(false)
                            }
                        }
                        fetchData()
                    }}
                    disabled={isLoading}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
                <Link href="/guide/dashboard">
                    <Button>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Go to Dashboard
                    </Button>
                </Link>
            </div>

            {/* Profile Header */}
            <ProfileHeader
                name={profile.name}
                email={profile.email}
                bio={profile.bio}
                profilePic={profile.profilePic}
                joinedDate={profile.createdAt}
                isVerified={profile.isVerified}
                languages={profile.languages}
                profileId={profile.id}
                role={profile.role}
                expertise={profile.guide.expertise}
                dailyRate={profile.guide.dailyRate}
            />

            {/* Guide Stats */}
            <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Performance Overview</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <ProfileStatsCard
                        title="Total Tours"
                        value={guide.listingsCount}
                        description="Active listings"
                        icon={MapPin}
                        index={0}
                    />
                    <ProfileStatsCard
                        title="Total Bookings"
                        value={guide.bookingsCount}
                        description="All time"
                        icon={Calendar}
                        index={1}
                    />
                    <ProfileStatsCard
                        title="Average Rating"
                        value={guide.averageRating.toFixed(1)}
                        description={`${guide.reviewsCount} reviews`}
                        icon={Star}
                        index={2}
                    />
                    <ProfileStatsCard
                        title="Total Earnings"
                        value={`$${(totalEarnings || guide.totalEarnings).toLocaleString()}`}
                        description="Lifetime"
                        icon={DollarSign}
                        index={3}
                    />
                </div>
            </div>

            {/* Expertise & Badges */}
            <div className="grid gap-6 md:grid-cols-2">
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
                                {guide.expertise && guide.expertise.length > 0 ? (
                                    guide.expertise.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No expertise listed</p>
                                )}
                            </div>
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Daily Rate</p>
                                    <p className="text-2xl font-bold text-foreground">${guide.dailyRate}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

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
                                {guide.badges && guide.badges.length > 0 ? (
                                    guide.badges.map((badgeData) => (
                                        <div
                                            key={badgeData.id}
                                            className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <Award className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {badgeData.badge.replace(/_/g, " ")}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Earned {new Date(badgeData.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Complete more tours to earn badges!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Tabs for Tours, Bookings, etc. */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
            >
                <Tabs defaultValue="tours" className="w-full">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="tours">My Tours ({isLoading ? "..." : myTours.length})</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings ({isLoading ? "..." : upcomingBookings.length})</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tours" className="mt-6">
                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2">
                                {[1, 2].map((i) => (
                                    <Card key={i}>
                                        <Skeleton className="h-48 w-full" />
                                        <CardContent className="p-4">
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : myTours.length > 0 ? (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {myTours.map((tour, index) => (
                                        <motion.div
                                            key={tour.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <Link href={`/tours/${tour.id}`}>
                                                <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                                                    <div className="relative h-48 overflow-hidden">
                                                        {tour.images && tour.images.length > 0 ? (
                                                            <img
                                                                src={tour.images[0]}
                                                                alt={tour.title}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                                <MapPin className="h-12 w-12 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <Badge
                                                            className={`absolute right-3 top-3 ${
                                                                tour.isActive
                                                                    ? "bg-green-500 text-white"
                                                                    : "bg-slate-500 text-white"
                                                            }`}
                                                        >
                                                            {tour.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <h3 className="font-semibold text-foreground group-hover:text-primary">
                                                            {tour.title}
                                                        </h3>
                                                        <div className="mt-2 flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                                <span className="font-medium text-foreground">
                                                                    {tour.averageRating ? tour.averageRating.toFixed(1) : "N/A"}
                                                                </span>
                                                            </div>
                                                            <span className="font-medium text-foreground">${tour.tourFee}</span>
                                                        </div>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {tour.bookingsCount || 0} bookings
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <Link href="/guide/dashboard/listings/new">
                                        <Button className="w-full sm:w-auto">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Create New Tour
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No tours yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first tour listing to get started</p>
                                <Link href="/guide/dashboard/listings/new">
                                    <Button>
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Create New Tour
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="bookings" className="mt-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <Card key={i}>
                                        <CardContent className="p-6">
                                            <Skeleton className="h-6 w-1/3 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : upcomingBookings.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <Card key={booking.id}>
                                        <CardContent className="flex items-center justify-between p-6">
                                            <div>
                                                <h3 className="font-semibold text-foreground">
                                                    {booking.listing?.title || "N/A"}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.tourist?.user?.name || "N/A"} •{" "}
                                                    {new Date(booking.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    booking.status === "CONFIRMED"
                                                        ? "default"
                                                        : booking.status === "PENDING"
                                                          ? "secondary"
                                                          : "outline"
                                                }
                                            >
                                                {booking.status}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                                <p className="text-muted-foreground">Bookings will appear here when tourists book your tours</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="earnings" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Earnings Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Lifetime Earnings</p>
                                            <p className="text-3xl font-bold text-foreground">
                                                ${(totalEarnings || guide.totalEarnings).toLocaleString()}
                                            </p>
                                        </div>
                                        <DollarSign className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href="/guide/dashboard/payments" className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                View Payments
                                            </Button>
                                        </Link>
                                        <Button variant="outline" disabled>
                                            {guide.stripeAccountId ? "Manage Stripe Account" : "Connect Stripe"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    )
}
