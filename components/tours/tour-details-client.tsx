"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SERVICE_FEE } from "@/constants/service-fee";
import { useAuth } from "@/lib/auth-context";
import { createBooking } from "@/services/booking/booking.service";
import {
  addToWishlist,
  checkWishlistStatus,
  removeFromWishlist,
} from "@/services/wishlist/wishlist.service";
import type { GuideListing, GuideReview } from "@/types/guide";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Heart,
  MapPin,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Availability {
  id: string;
  startDateTime: string;
  endDateTime: string;
  _count?: {
    bookings: number;
  };
}

interface TourDetailsClientProps {
  listing: GuideListing;
  reviews: GuideReview[];
  guideProfile?: {
    name: string;
    profilePic?: string | null;
    bio?: string | null;
    rating?: number;
    reviewsCount?: number;
    languages?: string[];
    expertise?: string[];
    dailyRate?: number | null;
    verified?: boolean;
  };
  availabilities?: Availability[];
}

export function TourDetailsClient({
  listing,
  reviews,
  guideProfile,
  availabilities = [],
}: TourDetailsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : ["/placeholder.svg"];
  const averageRating = listing.averageRating || 0;
  const reviewsCount = listing.reviewsCount || reviews.length || 0;
  const bookingsCount = listing.bookingsCount || 0;

  // Get available dates from availabilities
  const availableDates = availabilities
    .map((avail) => new Date(avail.startDateTime))
    .filter((date) => !isNaN(date.getTime()));

  // Booking mode: "available" for pre-set dates, "custom" for traveler's custom date/time
  const [bookingMode, setBookingMode] = useState<"available" | "custom">(
    availableDates.length > 0 ? "available" : "custom"
  );

  // Initialize selected date with first available date if exists
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    availableDates.length > 0 ? availableDates[0] : undefined
  );

  // Time selection for custom booking mode
  const [selectedHour, setSelectedHour] = useState<string>("09");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");

  const [guests, setGuests] = useState("1");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);

  // Itinerary is a plain string, display as-is
  const itineraryText = listing.itinerary || "";

  // Check wishlist status when user is logged in
  useEffect(() => {
    const checkWishlist = async () => {
      if (isLoading) {
        return; // Wait for auth to load
      }

      if (!user || !user.role) {
        setIsCheckingWishlist(false);
        setIsInWishlist(false);
        return; // User not logged in, no need to check
      }

      try {
        setIsCheckingWishlist(true);
        const result = await checkWishlistStatus(listing.id);
        if (result.success && result.data) {
          setIsInWishlist(result.data.isInWishlist || false);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setIsInWishlist(false);
      } finally {
        setIsCheckingWishlist(false);
      }
    };

    checkWishlist();
  }, [user, isLoading, listing.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") previousImage();
      if (e.key === "Escape") setGalleryOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryOpen, images.length]); // Dependencies for closure freshness

  const handleBooking = async () => {
    // Check if user is logged in
    if (isLoading) {
      // Still loading auth state, wait a bit
      return;
    }

    if (!user || !user.role) {
      // User is not logged in, redirect to login with current tour URL as redirect
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      toast.info("Please login to book a tour");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      setIsBooking(true);

      // For custom mode, combine date with selected time
      let bookingDateTime: string;
      if (bookingMode === "custom") {
        const dateWithTime = new Date(selectedDate);
        dateWithTime.setHours(
          parseInt(selectedHour),
          parseInt(selectedMinute),
          0,
          0
        );
        bookingDateTime = dateWithTime.toISOString();
      } else {
        // For available dates mode, find the matching availability and use its exact startDateTime
        const selectedDateStr = selectedDate.toISOString().split("T")[0];
        const matchingAvailability = availabilities.find((avail) => {
          const availDateStr = new Date(avail.startDateTime)
            .toISOString()
            .split("T")[0];
          return availDateStr === selectedDateStr;
        });

        if (matchingAvailability) {
          bookingDateTime = matchingAvailability.startDateTime;
        } else {
          toast.error("Selected date is not available");
          setIsBooking(false);
          return;
        }
      }

      const result = await createBooking({
        listingId: listing.id,
        date: bookingDateTime,
      });

      if (result.success) {
        toast.success("Booking request sent successfully!");
        router.push("/tourist/dashboard");
      } else {
        toast.error(result.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("An error occurred while creating the booking");
    } finally {
      setIsBooking(false);
    }
  };

  const handleWishlistToggle = async () => {
    // Check if user is logged in
    if (isLoading) {
      return; // Still loading auth state
    }

    if (!user || !user.role) {
      // User is not logged in, redirect to login with current tour URL as redirect
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      toast.info("Please login to save to wishlist");
      return;
    }

    try {
      setIsWishlistLoading(true);

      if (isInWishlist) {
        // Remove from wishlist
        const result = await removeFromWishlist(listing.id);
        if (result.success) {
          setIsInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error(result.message || "Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const result = await addToWishlist({ listingId: listing.id });
        if (result.success) {
          setIsInWishlist(true);
          toast.success("Added to wishlist");
        } else {
          toast.error(result.message || "Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("An error occurred while updating wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = listing.tourFee * Number.parseInt(guests);
  const serviceFee = Math.round(totalPrice * SERVICE_FEE);
  const finalTotal = totalPrice + serviceFee + guideProfile?.dailyRate! || 0;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative grid gap-4 sm:grid-cols-4 h-[500px]"
        >
          <button
            onClick={() => {
              setCurrentImageIndex(0);
              setGalleryOpen(true);
            }}
            className="group relative h-full overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2 shadow-lg transition-all hover:shadow-2xl ring-1 ring-black/5"
          >
            <Image
              src={images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized={images[0]?.startsWith("http")}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
          </button>
          <div className="flex flex-col gap-4 sm:col-span-1 sm:row-span-2 h-full">
            {images.slice(1, 3).map((image, index) => {
              const actualIndex = index + 1;
              return (
                <button
                  key={actualIndex}
                  onClick={() => {
                    if (actualIndex < images.length) {
                      setCurrentImageIndex(actualIndex);
                      setGalleryOpen(true);
                    }
                  }}
                  className="group relative flex-1 overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-xl ring-1 ring-black/5"
                >
                  <Image
                    src={image}
                    alt={`${listing.title} ${actualIndex + 1}`}
                    fill
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={image?.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-4 sm:col-span-1 sm:row-span-2 h-full">
            {images.slice(3, 5).map((image, index) => {
              const actualIndex = index + 3;
              return (
                <button
                  key={actualIndex}
                  onClick={() => {
                    if (actualIndex < images.length) {
                      setCurrentImageIndex(actualIndex);
                      setGalleryOpen(true);
                    }
                  }}
                  className="group relative flex-1 overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-xl ring-1 ring-black/5"
                >
                  <Image
                    src={image}
                    alt={`${listing.title} ${actualIndex + 1}`}
                    fill
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={image?.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <Button
              size="sm"
              variant="secondary"
              className="gap-2 shadow-lg backdrop-blur-md bg-white/90 hover:bg-white text-slate-900 border border-slate-200/50"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(0);
                setGalleryOpen(true);
              }}
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-1 w-1 rounded-[1px] bg-slate-900" />
                <div className="h-1 w-1 rounded-[1px] bg-slate-900" />
                <div className="h-1 w-1 rounded-[1px] bg-slate-900" />
                <div className="h-1 w-1 rounded-[1px] bg-slate-900" />
              </div>
              View all {images.length} photos
            </Button>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setGalleryOpen(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGalleryOpen(false);
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 top-1/2 -translate-y-1/2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-video w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentImageIndex]}
                alt={`${listing.title} ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                unoptimized={images[currentImageIndex]?.startsWith("http")}
                priority
              />
            </motion.div>

            <div
              className="absolute bottom-8 left-0 right-0 z-50 mx-auto max-w-4xl px-4 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center gap-2 p-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                      currentImageIndex === idx
                        ? "ring-2 ring-white scale-110 opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={img?.startsWith("http")}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute top-4 left-4 text-white/80 font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column - Tour Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {listing.category}
                </Badge>
                {averageRating > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({reviewsCount} reviews)
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-balance mt-3 text-3xl font-bold text-foreground lg:text-4xl">
                {listing.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{listing.city}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-8">
              <div className="flex items-center gap-4 rounded-2xl bg-muted/50 px-6 py-4 transition-all hover:bg-muted/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Duration
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {listing.durationDays}{" "}
                    {listing.durationDays === 1 ? "day" : "days"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-muted/50 px-6 py-4 transition-all hover:bg-muted/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Group Size
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Up to {listing.maxGroupSize} people
                  </div>
                </div>
              </div>
              {guideProfile?.languages && guideProfile.languages.length > 0 && (
                <div className="flex items-center gap-4 rounded-2xl bg-muted/50 px-6 py-4 transition-all hover:bg-muted/80">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Languages
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {guideProfile.languages.join(", ")}
                    </div>
                  </div>
                </div>
              )}
              {bookingsCount > 0 && (
                <div className="flex items-center gap-4 rounded-2xl bg-muted/50 px-6 py-4 transition-all hover:bg-muted/80">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Popularity
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bookingsCount} bookings so far
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide Card */}
            {listing.guide && guideProfile && (
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Meet Your Guide
                </h2>
                <Card className="overflow-hidden border-border/50 shadow-md transition-all hover:shadow-xl hover:border-primary/20 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <CardContent className="p-8 relative">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-2 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                          <AvatarImage
                            src={guideProfile.profilePic || "/placeholder.svg"}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                            {guideProfile.name[0] || "G"}
                          </AvatarFallback>
                        </Avatar>
                        {guideProfile.verified && (
                          <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm">
                            <Badge
                              variant="secondary"
                              className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
                              title="Verified Guide"
                            >
                              <Shield className="h-3.5 w-3.5 fill-current" />
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            {guideProfile.name}
                          </h3>
                          {guideProfile.rating &&
                            guideProfile.reviewsCount !== undefined && (
                              <div className="mt-1 flex items-center gap-2 text-sm">
                                <span className="flex items-center font-medium text-foreground">
                                  <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
                                  {guideProfile.rating.toFixed(1)}
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground hover:text-foreground transition-colors underline decoration-dotted underline-offset-4">
                                  {guideProfile.reviewsCount} reviews
                                </span>
                                {bookingsCount > 0 && (
                                  <>
                                    <span className="text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-muted-foreground">
                                      {bookingsCount} bookings hosted
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                        </div>

                        {guideProfile.bio && (
                          <p className="text-muted-foreground leading-relaxed text-pretty">
                            {guideProfile.bio}
                          </p>
                        )}

                        {guideProfile.expertise &&
                          guideProfile.expertise.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {guideProfile.expertise.map((exp, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-secondary/50 hover:bg-secondary text-xs font-normal"
                                >
                                  {exp}
                                </Badge>
                              ))}
                            </div>
                          )}

                        <div className="pt-2">
                          <Link href={`/profile/${listing.guide.id}`}>
                            <Button variant="outline" className="group/btn">
                              View Full Profile
                              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                About This Tour
              </h2>
              <p className="text-pretty mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Itinerary
              </h2>
              <Card className="border-border/50 shadow-sm transition-all hover:shadow-md bg-card/50">
                <CardContent className="p-8">
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    <p className="text-pretty whitespace-pre-line leading-relaxed text-muted-foreground">
                      {itineraryText || "Itinerary details coming soon."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Meeting Point */}
            <Card className="border-primary/30 bg-primary/5 transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary shadow-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      Meeting Point
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {listing.meetingPoint}
                    </p>
                    {/* <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                      View on map →
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Guest Reviews
                </h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(averageRating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      ({reviewsCount})
                    </span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <Card className="border-dashed border-2 bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Star className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      This tour is new and waiting for its first adventurer!
                      Book now and be the first to share your experience.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-border/50 shadow-sm transition-all hover:shadow-md bg-card/50">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                              <AvatarImage
                                src={
                                  review.tourist?.user?.profilePic ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                {review.tourist?.user?.name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <h4 className="font-semibold text-foreground text-lg">
                                  {review.tourist?.user?.name ||
                                    "Anonymous Traveler"}
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-primary text-primary"
                                        : "fill-muted text-muted-foreground/30"
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.comment && (
                                <p className="text-pretty leading-relaxed text-muted-foreground">
                                  "{review.comment}"
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {reviews.length > 5 && (
                    <Button variant="outline" className="w-full">
                      View all {reviews.length} reviews
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Booking Card */}
          <div className="lg:w-96">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-28"
            >
              <Card className="overflow-hidden border-2 border-primary/10 shadow-xl transition-all hover:shadow-2xl hover:border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600" />
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      ${listing.tourFee}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      per person
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Booking Mode Toggle - only show if guide has available dates */}
                    {availableDates.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Booking Option
                        </Label>
                        <Tabs
                          value={bookingMode}
                          onValueChange={(value) =>
                            setBookingMode(value as "available" | "custom")
                          }
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="available">
                              Available Dates
                            </TabsTrigger>
                            <TabsTrigger value="custom">
                              Request Custom Date
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    )}

                    {/* Date Selection */}
                    <div className="space-y-2">
                      {availableDates.length === 0 && (
                        <Card className="my-3 border-amber-200 bg-amber-50/50 p-1 rounded-md">
                          <CardContent className="p-2">
                            <div className="flex gap-3">
                              <CalendarIcon className="h-5 w-5 flex-shrink-0 text-amber-600" />
                              <div>
                                <p className="text-xs text-amber-700">
                                  No available dates from guide, request your
                                  preferred date and time
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      <Label className="text-sm font-medium">
                        {bookingMode === "custom"
                          ? "Select Your Preferred Date"
                          : "Select Date"}
                      </Label>

                      {bookingMode === "available" &&
                      availableDates.length > 0 ? (
                        <>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-lg border-slate-200"
                            disabled={(date) => {
                              // Only allow dates in the past to be disabled, plus dates not in availableDates
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              if (date < today) return true;

                              const dateStr = date.toISOString().split("T")[0];
                              return !availableDates.some(
                                (availDate) =>
                                  availDate.toISOString().split("T")[0] ===
                                  dateStr
                              );
                            }}
                            classNames={{
                              day_selected:
                                "bg-primary text-white hover:bg-primary hover:text-white",
                              day_today: "bg-slate-100 text-slate-900",
                            }}
                          />

                          {/* Show selected date time details */}
                          {selectedDate &&
                            (() => {
                              const selectedDateStr = selectedDate
                                .toISOString()
                                .split("T")[0];
                              const matchingAvailability = availabilities.find(
                                (avail) => {
                                  const availDateStr = new Date(
                                    avail.startDateTime
                                  )
                                    .toISOString()
                                    .split("T")[0];
                                  return availDateStr === selectedDateStr;
                                }
                              );

                              if (matchingAvailability) {
                                const startTime = format(
                                  new Date(matchingAvailability.startDateTime),
                                  "h:mm a"
                                );
                                const endTime = format(
                                  new Date(matchingAvailability.endDateTime),
                                  "h:mm a"
                                );

                                return (
                                  <Card className="mt-3 border-blue-200 bg-blue-50/50 p-1 rounded-md">
                                    <CardContent className="p-2">
                                      <div className="flex gap-3">
                                        <Clock className="h-5 w-5 flex-shrink-0 text-blue-800" />
                                        <div>
                                          <p className="text-xs font-semibold text-blue-900">
                                            Tour Time for{" "}
                                            {format(
                                              selectedDate,
                                              "MMM d, yyyy"
                                            )}
                                          </p>
                                          <p className="mt-1 text-xs text-blue-800">
                                            Start: {startTime} • End: {endTime}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              }
                              return null;
                            })()}

                          <Card className="mt-2 border-emerald-200 bg-emerald-50/50 p-1 rounded-md">
                            <CardContent className="p-2">
                              <div className="flex gap-3">
                                <CalendarIcon className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                                <div>
                                  <p className="mt-1 text-xs text-emerald-700">
                                    {availableDates.length} available date
                                    {availableDates.length !== 1
                                      ? "s"
                                      : ""}{" "}
                                    from guide
                                    {availableDates.length > 0 && (
                                      <>
                                        {" "}
                                        in{" "}
                                        {Array.from(
                                          new Set(
                                            availableDates.map((date) =>
                                              format(date, "MMM yyyy")
                                            )
                                          )
                                        ).join(", ")}
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-lg border-slate-200"
                            disabled={(date) => {
                              // Only disable past dates for custom requests
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            classNames={{
                              day_selected:
                                "bg-primary text-white hover:bg-primary hover:text-white",
                              day_today: "bg-slate-100 text-slate-900",
                            }}
                          />
                        </>
                      )}
                    </div>

                    {/* Time Picker - only show in custom mode */}
                    {bookingMode === "custom" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Preferred Time
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={selectedHour}
                            onValueChange={setSelectedHour}
                          >
                            <SelectTrigger className="flex-1 border-slate-200">
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, "0");
                                return (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}:00
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <span className="flex items-center text-2xl font-bold text-muted-foreground">
                            :
                          </span>
                          <Select
                            value={selectedMinute}
                            onValueChange={setSelectedMinute}
                          >
                            <SelectTrigger className="flex-1 border-slate-200">
                              <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                            <SelectContent>
                              {["00", "15", "30", "45"].map((min) => (
                                <SelectItem key={min} value={min}>
                                  {min}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your requested time: {selectedHour}:{selectedMinute}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="guests" className="text-sm font-medium">
                        Number of Guests
                      </Label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger id="guests" className="border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(listing.maxGroupSize)].map((_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1} {i === 0 ? "guest" : "guests"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${listing.tourFee} × {guests}{" "}
                          {guests === "1" ? "guest" : "guests"}
                        </span>
                        <span className="font-semibold text-foreground">
                          ${totalPrice}
                        </span>
                      </div>
                      {guideProfile?.dailyRate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Guide Daily rate
                          </span>
                          <span className="font-semibold text-foreground">
                            ${guideProfile.dailyRate}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Service fee
                        </span>
                        <span className="font-semibold text-foreground">
                          ${serviceFee}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                        <span className="font-semibold text-foreground">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                          ${finalTotal}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full shadow-lg transition-transform hover:scale-105"
                      onClick={handleBooking}
                      disabled={isBooking || !selectedDate}
                    >
                      {isBooking
                        ? "Processing..."
                        : bookingMode === "custom"
                        ? "Request Custom Date & Time"
                        : "Request to Book"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      {bookingMode === "custom"
                        ? "Guide will review your custom date/time request"
                        : "You won't be charged yet"}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-200 pt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-slate-50"
                      onClick={handleWishlistToggle}
                      disabled={isWishlistLoading || isCheckingWishlist}
                    >
                      <Heart
                        className={`mr-2 h-4 w-4 ${
                          isInWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      {isWishlistLoading
                        ? "Loading..."
                        : isInWishlist
                        ? "Saved"
                        : "Save"}
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-slate-50"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
