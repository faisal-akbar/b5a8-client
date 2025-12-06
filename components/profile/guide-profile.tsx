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
    

    return (
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="flex gap-2 justify-end">
                
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

    
        </div>
    )
}
