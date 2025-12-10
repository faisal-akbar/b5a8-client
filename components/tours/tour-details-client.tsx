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
  Share2,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";
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
  const serviceFee = Math.round(totalPrice * 0.1);
  const finalTotal = totalPrice + serviceFee + guideProfile?.dailyRate! || 0;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-2 sm:grid-cols-4"
        >
          <button
            onClick={() => {
              setCurrentImageIndex(0);
              setGalleryOpen(true);
            }}
            className="group relative h-[400px] overflow-hidden rounded-lg sm:col-span-2 sm:row-span-2 shadow-md transition-all hover:shadow-xl"
          >
            <img
              src={images[0] || "/placeholder.svg"}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </button>
          {images.slice(1, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index + 1);
                setGalleryOpen(true);
              }}
              className="group relative h-[196px] overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${listing.title} ${index + 2}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
          ))}
          {images.length > 4 && (
            <button
              onClick={() => setGalleryOpen(true)}
              className="group relative flex h-[196px] items-center justify-center overflow-hidden rounded-lg bg-slate-900/10 backdrop-blur-sm transition-colors hover:bg-slate-900/20"
            >
              <span className="font-medium text-slate-900">
                View All {images.length} Photos
              </span>
            </button>
          )}
        </motion.div>
      </section>

      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setGalleryOpen(false)}
          >
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[currentImageIndex]}
              alt={`${listing.title} ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
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

            <div className="flex flex-wrap gap-6 border-y border-border/50 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {listing.durationDays}{" "}
                    {listing.durationDays === 1 ? "day" : "days"}
                  </div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Up to {listing.maxGroupSize}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Group size
                  </div>
                </div>
              </div>
              {guideProfile?.languages && guideProfile.languages.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {guideProfile.languages.join(", ")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Languages
                    </div>
                  </div>
                </div>
              )}
              {bookingsCount > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {bookingsCount}{" "}
                      {bookingsCount === 1 ? "booking" : "bookings"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total bookings
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide Card */}
            {listing.guide && guideProfile && (
              <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-slate-100">
                      <AvatarImage
                        src={guideProfile.profilePic || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {guideProfile.name[0] || "G"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {guideProfile.name}
                        </h3>
                        {guideProfile.verified && (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-emerald-50 text-emerald-700"
                          >
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {guideProfile.rating &&
                        guideProfile.reviewsCount !== undefined && (
                          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              {guideProfile.rating.toFixed(1)} (
                              {guideProfile.reviewsCount} reviews)
                            </div>
                            {bookingsCount > 0 && (
                              <>
                                <span>•</span>
                                <span>{bookingsCount} bookings</span>
                              </>
                            )}
                          </div>
                        )}
                      {guideProfile.bio && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {guideProfile.bio}
                        </p>
                      )}
                      {guideProfile.expertise &&
                        guideProfile.expertise.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {guideProfile.expertise.map((exp, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        )}
                      <div className="mt-4 flex gap-2">
                        <Link href={`/profile/${listing.guide.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-slate-50 bg-transparent"
                          >
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <h2 className="text-2xl font-semibold text-foreground">
                Itinerary
              </h2>
              <div className="mt-4">
                <Card className="border-slate-200 transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <p className="text-pretty whitespace-pre-line leading-relaxed text-muted-foreground">
                      {itineraryText || "Itinerary details coming soon."}
                    </p>
                  </CardContent>
                </Card>
              </div>
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
              <h2 className="text-2xl font-semibold text-foreground">
                Reviews
              </h2>
              {reviews.length === 0 ? (
                <div className="mt-6 text-center py-12">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to review this tour!
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="border-2 border-slate-100">
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
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-foreground">
                                  {review.tourist?.user?.name || "Anonymous"}
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="mt-1 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.comment && (
                                <p className="text-pretty mt-3 leading-relaxed text-muted-foreground">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
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
              className="sticky top-24"
            >
              <Card className="border-2 border-slate-200 shadow-lg transition-all hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      ${listing.tourFee}
                    </span>
                    <span className="text-muted-foreground">per person</span>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-slate-50"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
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
