"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStatsCard } from "@/components/profile/profile-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TouristProfile as TouristProfileType } from "@/types/profile"
import { Calendar, Star, Heart, MapPin, Plane, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface TouristProfileProps {
    profile: TouristProfileType
}

export function TouristProfile({ profile }: TouristProfileProps) {
    const { tourist } = profile

    // Mock data - in real app, fetch from API
    const upcomingBookings = [
        {
            id: "1",
            tourTitle: "Hidden Jazz Bars of New Orleans",
            guide: "Sarah Johnson",
            date: new Date("2024-02-20"),
            status: "confirmed" as const,
            image: "/new-orleans-jazz-bar.jpg",
        },
    ]

    const pastBookings = [
        {
            id: "2",
            tourTitle: "Tokyo Street Food Adventure",
            guide: "Yuki Tanaka",
            date: new Date("2024-01-15"),
            status: "completed" as const,
            image: "/tokyo-food.jpg",
            hasReview: true,
        },
    ]

    const wishlist = [
        {
            id: "1",
            title: "Paris Architecture Walk",
            city: "Paris, France",
            price: 95,
            image: "/paris-architecture.jpg",
            guide: "Sophie Chen",
        },
        {
            id: "2",
            title: "Barcelona Tapas Tour",
            city: "Barcelona, Spain",
            price: 110,
            image: "/barcelona-tapas.jpg",
            guide: "Carlos Rodriguez",
        },
    ]

    const completedBookings = pastBookings.filter((b) => b.status === "completed").length

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
                travelPreferences={profile.tourist.travelPreferences}
            />

            {/* Tourist Stats */}
            <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Travel Overview</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <ProfileStatsCard
                        title="Total Bookings"
                        value={tourist.bookingsCount}
                        description="All time"
                        icon={Calendar}
                        index={0}
                    />
                    <ProfileStatsCard
                        title="Tours Completed"
                        value={completedBookings}
                        description="Experiences"
                        icon={CheckCircle}
                        index={1}
                    />
                    <ProfileStatsCard
                        title="Reviews Written"
                        value={tourist.reviewsCount}
                        description="Shared feedback"
                        icon={Star}
                        index={2}
                    />
                    <ProfileStatsCard
                        title="Wishlist"
                        value={tourist.wishlistCount}
                        description="Saved tours"
                        icon={Heart}
                        index={3}
                    />
                </div>
            </div>

            {/* Travel Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plane className="h-5 w-5" />
                            Travel Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {tourist.travelPreferences.length > 0 ? (
                                tourist.travelPreferences.map((pref) => (
                                    <Badge key={pref} variant="secondary" className="px-3 py-1">
                                        {pref}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Add your travel preferences to get personalized recommendations
                                </p>
                            )}
                        </div>
                        <Button variant="outline" className="mt-4" size="sm">
                            Edit Preferences
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tabs for Bookings, Wishlist, Reviews */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="upcoming">
                            Upcoming ({upcomingBookings.length})
                        </TabsTrigger>
                        <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist ({wishlist.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-6">
                        <div className="space-y-4">
                            {upcomingBookings.length > 0 ? (
                                upcomingBookings.map((booking) => (
                                    <Card key={booking.id} className="overflow-hidden">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="relative h-48 w-full sm:h-auto sm:w-48">
                                                <img
                                                    src={booking.image}
                                                    alt={booking.tourTitle}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <CardContent className="flex-1 p-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">
                                                            {booking.tourTitle}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Guide: {booking.guide}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {booking.date.toLocaleDateString("en-US", {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </div>
                                                    </div>
                                                    <Badge variant="default">{booking.status}</Badge>
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <Button size="sm">View Details</Button>
                                                    <Button size="sm" variant="outline">
                                                        Contact Guide
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <Calendar className="h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-center text-muted-foreground">
                                            No upcoming bookings
                                        </p>
                                        <Link href="/explore">
                                            <Button className="mt-4">Explore Tours</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="past" className="mt-6">
                        <div className="space-y-4">
                            {pastBookings.map((booking) => (
                                <Card key={booking.id} className="overflow-hidden">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="relative h-48 w-full sm:h-auto sm:w-48">
                                            <img
                                                src={booking.image}
                                                alt={booking.tourTitle}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <CardContent className="flex-1 p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        {booking.tourTitle}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Guide: {booking.guide}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        {booking.date.toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{booking.status}</Badge>
                                            </div>
                                            <div className="mt-4">
                                                {booking.hasReview ? (
                                                    <Button size="sm" variant="outline">
                                                        View Review
                                                    </Button>
                                                ) : (
                                                    <Button size="sm">
                                                        <Star className="mr-2 h-4 w-4" />
                                                        Write Review
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="wishlist" className="mt-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {wishlist.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute right-3 top-3 h-8 w-8"
                                            >
                                                <Heart className="h-4 w-4 fill-current text-red-500" />
                                            </Button>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-foreground group-hover:text-primary">
                                                {item.title}
                                            </h3>
                                            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                {item.city}
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">by {item.guide}</span>
                                                <span className="font-semibold text-foreground">${item.price}</span>
                                            </div>
                                            <Button className="mt-4 w-full" size="sm">
                                                Book Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    )
}
