"use client";

import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, MapPin, Settings, Shield } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  bio?: string | null;
  profilePic?: string | null;
  location?: string;
  joinedDate: Date;
  isVerified?: boolean;
  coverImage?: string;
  languages?: string[];
  onEditClick?: () => void;
  // Full profile data for edit dialog
  profileId?: string;
  role?: "TOURIST" | "GUIDE" | "ADMIN" | "SUPER_ADMIN";
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
}

export function ProfileHeader({
  name,
  email,
  bio,
  profilePic,
  location,
  joinedDate,
  isVerified,
  coverImage,
  languages,
  onEditClick,
  profileId,
  role,
  expertise,
  dailyRate,
  travelPreferences,
}: ProfileHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveProfile = () => {
    // Profile is saved in EditProfileDialog, this is just a callback
    // The dialog handles the API call and refresh
  };

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-2xl">
        {/* Modern Cover Design */}
        <div className="relative h-72 w-full overflow-hidden">
          {/* Base Gradient - Modern Mesh Style */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-primary to-cyan-500" />

          {/* Animated Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 via-transparent to-blue-500/30 animate-pulse"
            style={{ animationDuration: "8s" }}
          />

          {/* Floating Orbs - Modern Design Element */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-10 left-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.2, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/20 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Custom Image if provided */}
          {coverImage && (
            <Image
              src={coverImage}
              alt="Cover"
              className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-soft-light"
              width={100}
              height={100}
            />
          )}

          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent backdrop-blur-[2px]" />

          {/* Noise Texture for Premium Feel */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Shimmer Effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"
            style={{
              animationDuration: "3s",
              animationIterationCount: "infinite",
            }}
          />
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="-mt-16"
            >
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage
                  src={profilePic || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Edit Button */}
            <Button
              variant="outline"
              className="self-start sm:self-auto"
              onClick={handleEditClick}
            >
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Name and Verification */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{name}</h1>
              {isVerified && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-emerald-50 text-emerald-700"
                >
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>

          {/* Bio */}
          {bio && (
            <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
              {bio}
            </p>
          )}

          {/* Meta Info */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined{" "}
              {new Date(joinedDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            {languages && languages.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Languages:</span>
                <div className="flex gap-1">
                  {languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Edit Profile Dialog */}
      {profileId && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          profile={{
            id: profileId,
            name,
            email,
            bio,
            profilePic,
            languages: languages || [],
            role,
            expertise,
            dailyRate,
            travelPreferences,
          }}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}
