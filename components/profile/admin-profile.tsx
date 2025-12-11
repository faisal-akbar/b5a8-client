"use client";

import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStatsCard } from "@/components/profile/profile-stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminProfile as AdminProfileType } from "@/types/profile";
import { motion } from "framer-motion";
import { MapPin, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface AdminProfileProps {
  profile: AdminProfileType;
  stats?: {
    totalUsers?: number;
    totalGuides?: number;
    totalTours?: number;
    totalTourists?: number;
    totalBookings?: number;
    pendingVerifications?: number;
  } | null;
}

export function AdminProfile({ profile, stats }: AdminProfileProps) {
  console.log("stats", stats);
  // Use real stats if available, otherwise show defaults
  const displayStats = {
    totalUsers: stats?.totalUsers ?? 0,
    totalGuides: stats?.totalGuides ?? 0,
    totalTours: stats?.totalTours ?? 0,
    pendingVerifications: stats?.pendingVerifications ?? 0,
  };

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
      />

      {/* Admin Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Administrator Access
              </h3>
              <p className="text-sm text-muted-foreground">
                You have full platform management privileges
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Platform Stats */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Platform Overview
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProfileStatsCard
            title="Total Users"
            value={displayStats.totalUsers.toLocaleString()}
            description="Platform members"
            icon={Users}
            index={0}
          />
          <ProfileStatsCard
            title="Active Guides"
            value={displayStats.totalGuides.toLocaleString()}
            description="Verified guides"
            icon={Shield}
            index={1}
          />
          <ProfileStatsCard
            title="Total Tours"
            value={displayStats.totalTours.toLocaleString()}
            description="Active listings"
            icon={MapPin}
            index={2}
          />
          <ProfileStatsCard
            title="Pending Reviews"
            value={displayStats.pendingVerifications}
            description="Awaiting approval"
            icon={TrendingUp}
            index={3}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/admin/dashboard/users-management">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/dashboard/listings-management">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Manage Tours
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
