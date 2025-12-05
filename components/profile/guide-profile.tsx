"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStatsCard } from "@/components/profile/profile-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuideProfile as GuideProfileType } from "@/types/profile"
import { MapPin, Star, DollarSign, Calendar, Award, TrendingUp, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface GuideProfileProps {
    profile: GuideProfileType
}

export function GuideProfile({ profile }: GuideProfileProps) {
    const { guide } = profile

    // Mock data - in real app, fetch from API
    const upcomingBookings = [
        {
            id: "1",
            tourTitle: "Hidden Jazz Bars Tour",
            date: new Date("2024-02-15"),
            touristName: "John Doe",
            status: "confirmed" as const,
        },
        {
            id: "2",
            tourTitle: "Food Walking Tour",
            date: new Date("2024-02-18"),
            touristName: "Jane Smith",
            status: "pending" as const,
        },
    ]

    const myTours = [
        {
            id: "1",
            title: "Hidden Jazz Bars of New Orleans",
            image: "/new-orleans-jazz-bar.jpg",
            price: 85,
            bookings: 127,
            rating: 4.9,
            isActive: true,
        },
        {
            id: "2",
            title: "French Quarter Culinary History",
            image: "/new-orleans-food-tour.jpg",
            price: 75,
            bookings: 94,
            rating: 4.8,
            isActive: true,
        },
    ]

    return (
        <div className="space-y-8">
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
                        value={`$${guide.totalEarnings.toLocaleString()}`}
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
                                {guide.expertise.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                                        {skill}
                                    </Badge>
                                ))}
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
                                {guide.badges.length > 0 ? (
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
                        <TabsTrigger value="tours">My Tours ({myTours.length})</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings ({upcomingBookings.length})</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tours" className="mt-6">
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
                                                <img
                                                    src={tour.image}
                                                    alt={tour.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <Badge
                                                    className={`absolute right-3 top-3 ${tour.isActive
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
                                                        <span className="font-medium text-foreground">{tour.rating}</span>
                                                    </div>
                                                    <span className="font-medium text-foreground">${tour.price}</span>
                                                </div>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {tour.bookings} bookings
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
                    </TabsContent>

                    <TabsContent value="bookings" className="mt-6">
                        <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                                <Card key={booking.id}>
                                    <CardContent className="flex items-center justify-between p-6">
                                        <div>
                                            <h3 className="font-semibold text-foreground">{booking.tourTitle}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.touristName} • {booking.date.toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                                        >
                                            {booking.status}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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
                                                ${guide.totalEarnings.toLocaleString()}
                                            </p>
                                        </div>
                                        <DollarSign className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Connect your Stripe account to receive payments
                                    </p>
                                    <Button variant="outline">
                                        {guide.stripeAccountId ? "Manage Stripe Account" : "Connect Stripe"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    )
}
