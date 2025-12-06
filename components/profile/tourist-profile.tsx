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
            
        </div>
    )
}
