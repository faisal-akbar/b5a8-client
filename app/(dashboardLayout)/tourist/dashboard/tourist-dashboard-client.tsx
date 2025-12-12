"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { BookingDetailsModal } from "@/components/modals/booking-details-modal";
import { ReviewModal } from "@/components/modals/review-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBookingById } from "@/services/booking/booking.service";
import { removeFromWishlist } from "@/services/wishlist/wishlist.service";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
    CalendarDays,
    Compass,
    CreditCard,
    Eye,
    Heart,
    Loader2,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Sparkles,
    Star,
    Trash2,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Types
type Booking = {
  id: string;
  tourTitle: string;
  tourImage: string;
  guide: string;
  guideImage: string | null;
  guideId?: string;
  listingId?: string;
  location: string;
  city: string;
  date: string;
  guests: number;
  price: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
  paymentStatus: string;
  paymentAmount?: number;
  paymentProvider?: string;
  stripePaymentIntentId?: string | null;
  rating?: number;
  reviewed?: boolean;
  meetingPoint?: string;
  category?: string;
  durationDays?: number;
  guideEmail?: string;
  totalPrice?: number;
};

type WishlistTableItem = {
  id: string;
  tourTitle: string;
  tourImage: string;
  guide: string;
  location: string;
  category: string;
  price: number;
  durationDays: number;
  bookingsCount: number;
  reviewsCount: number;
  listingId: string;
};

type TouristReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  listing: {
    title: string;
  } | null;
  guide: {
    user: {
      name: string;
    };
  } | null;
};

type Stats = {
  upcomingTrips: number;
  completedTrips: number;
  wishlist: number;
  totalSpent: number;
};

interface TouristDashboardClientProps {
  upcomingBookings: Booking[];
  upcomingBookingsTotal: number;
  upcomingBookingsTotalPages: number;
  pendingBookings: Booking[];
  pendingBookingsTotal: number;
  pendingBookingsTotalPages: number;
  pastBookings: Booking[];
  pastBookingsTotal: number;
  pastBookingsTotalPages: number;
  wishlistItems: WishlistTableItem[];
  wishlistTotal: number;
  wishlistTotalPages: number;
  reviews: TouristReview[];
  reviewsTotal: number;
  reviewsTotalPages: number;
  stats: Stats;
  activeTab: string;
  currentPage: number;
  currentLimit: number;
}

export function TouristDashboardClient({
  upcomingBookings: initialUpcoming,
  upcomingBookingsTotal,
  upcomingBookingsTotalPages,
  pendingBookings: initialPending,
  pendingBookingsTotal,
  pendingBookingsTotalPages,
  pastBookings: initialPast,
  pastBookingsTotal,
  pastBookingsTotalPages,
  wishlistItems: initialWishlist,
  wishlistTotal,
  wishlistTotalPages,
  reviews,
  reviewsTotal,
  reviewsTotalPages,
  stats,
  activeTab: initialActiveTab,
  currentPage: initialCurrentPage,
  currentLimit: initialCurrentLimit,
}: TouristDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial tab from URL or initialData
  const initialTab = searchParams.get("tab") || initialActiveTab || "upcoming";

  // Use local state for active tab to update immediately on click
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync local state with URL params when they change (e.g., browser back/forward)
  useEffect(() => {
    const urlTab = searchParams.get("tab") || initialActiveTab || "upcoming";
    setActiveTab(urlTab);
  }, [searchParams, initialActiveTab]);

  // Get pagination from URL or initialData
  const currentPage = parseInt(
    searchParams.get("page") || initialCurrentPage.toString(),
    10
  );
  const currentLimit = parseInt(
    searchParams.get("limit") || initialCurrentLimit.toString(),
    10
  );

  const [removingWishlistId, setRemovingWishlistId] = useState<string | null>(
    null
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [bookingToReview, setBookingToReview] = useState<Booking | null>(null);
  const [reviewMode, setReviewMode] = useState<"create" | "edit">("create");

  // Update URL with tab and pagination params
  const updateTabAndPagination = useCallback(
    (tab: string, page: number, limit: number) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      const url = `/tourist/dashboard?${params.toString()}`;
      // Update URL without adding to history and refresh server component
      router.replace(url, { scroll: false });
      // Force server component to re-fetch with new params
      router.refresh();
    },
    [router]
  );

  // Update pagination for current tab
  const updatePagination = useCallback(
    (page: number, limit: number) => {
      updateTabAndPagination(activeTab, page, limit);
    },
    [activeTab, updateTabAndPagination]
  );

  // Update tab (resets to page 1)
  const updateTab = useCallback(
    (tab: string) => {
      // Update local state immediately for instant UI feedback
      setActiveTab(tab);
      const defaultLimit = tab === "reviews" ? 5 : 10;
      updateTabAndPagination(tab, 1, defaultLimit);
    },
    [updateTabAndPagination]
  );

  // Refresh data when refresh query param is present
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh) {
      // Clean up the URL and trigger server re-fetch
      const params = new URLSearchParams(searchParams.toString());
      params.delete("refresh");
      router.replace(`/tourist/dashboard?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [searchParams, router]);

  // Handle removing item from wishlist
  const handleRemoveFromWishlist = async (listingId: string) => {
    setRemovingWishlistId(listingId);
    const result = await removeFromWishlist(listingId);
    if (result.success) {
      toast.success("Removed from wishlist");
      // Refresh the page to get updated data from server
      router.refresh();
    } else {
      toast.error("Failed to remove from wishlist");
    }
    setRemovingWishlistId(null);
  };

  // Handle viewing booking details
  const handleViewBookingDetails = async (booking: Booking) => {
    try {
      const result = await getBookingById(booking.id);
      if (result.success && result.data) {
        // Transform the API data to match the Booking type with full details
        const transformedBooking: Booking = {
          id: result.data.id,
          tourTitle: result.data.listing?.title || "N/A",
          tourImage: result.data.listing?.images?.[0] || "",
          guide: result.data.guide?.user?.name || "N/A",
          guideImage: result.data.guide?.user?.profilePic || null,
          guideId: result.data.guide?.id || result.data.guideId,
          listingId: result.data.listing?.id || result.data.listingId,
          location: result.data.listing?.city || "N/A",
          city: result.data.listing?.city || "N/A",
          date: result.data.date,
          guests: result.data.numberOfGuests || 0,
          price: result.data.listing?.tourFee || 0,
          status: result.data.status.toLowerCase() as
            | "confirmed"
            | "pending"
            | "completed"
            | "cancelled",
          createdAt: result.data.createdAt,
          paymentStatus: result.data.payment?.status || "UNPAID",
          paymentAmount: result.data.payment?.amount
            ? result.data.payment.amount
            : undefined,
          paymentProvider: result.data.payment?.provider || undefined,
          stripePaymentIntentId:
            result.data.payment?.stripePaymentIntentId || null,
          rating: booking.rating,
          reviewed: booking.reviewed,
          meetingPoint: result.data.listing?.meetingPoint || "N/A",
          category: result.data.listing?.category || undefined,
          durationDays: result.data.listing?.durationDays || undefined,
          guideEmail: result.data.guide?.user?.email || undefined,
          totalPrice: result.data.payment?.amount
            ? result.data.payment.amount
            : result.data.listing?.tourFee || 0,
        };
        setSelectedBooking(transformedBooking);
        setIsDetailsModalOpen(true);
      } else {
        toast.error("Failed to load booking details");
      }
    } catch (error) {
      toast.error("Failed to load booking details");
    }
  };

  // Handle opening write review modal
  const handleWriteReview = (booking: Booking) => {
    setBookingToReview(booking);
    setReviewMode("create");
    setIsReviewModalOpen(true);
  };

  // Handle opening view/edit review modal
  const handleViewReview = (booking: Booking) => {
    setBookingToReview(booking);
    setReviewMode("edit");
    setIsReviewModalOpen(true);
  };

  const upcomingColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      enableHiding: true,
    },
    {
      accessorKey: "tourTitle",
      header: "Tour",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-16 overflow-hidden rounded">
              <Image
                src={row.original.tourImage || "/placeholder.svg"}
                alt={row.getValue("tourTitle")}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            </div>
            <div>
              <div className="font-medium">{row.getValue("tourTitle")}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {row.original.city}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "guide",
      header: "Guide",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original.guideImage ? (
              <Image
                src={row.original.guideImage}
                alt={row.getValue("guide")}
                className="h-8 w-8 rounded-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {(row.getValue("guide") as string).charAt(0)}
                </span>
              </div>
            )}
            <span>{row.getValue("guide")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.getValue("date")).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "guests",
      header: "Guests",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            {row.getValue("guests")}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Tour Fee",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "paymentAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = row.original.paymentAmount || row.original.price;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "paymentProvider",
      header: "Payment Method",
      cell: ({ row }) => {
        const provider = row.original.paymentProvider;
        if (!provider)
          return <span className="text-muted-foreground text-sm">N/A</span>;

        const displayName =
          {
            stripe: "Stripe",
            bank_transfer: "Bank Transfer",
            paypal: "PayPal",
          }[provider] || provider;

        return <span className="text-sm">{displayName}</span>;
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string;
        return (
          <Badge
            variant={
              status === "PAID"
                ? "default"
                : status === "UNPAID"
                ? "secondary"
                : "outline"
            }
          >
            {status}
          </Badge>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Booking Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "confirmed" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "payNow",
      header: "Payment",
      cell: ({ row }) => {
        const booking = row.original;
        const isConfirmed = booking.status === "confirmed";
        const isUnpaid =
          booking.paymentStatus?.toUpperCase() === "UNPAID" ||
          !booking.paymentStatus;

        if (isConfirmed && isUnpaid) {
          return (
            <Link href={`/payment/${booking.id}`}>
              <Button size="sm" className="h-7">
                <CreditCard className="mr-1 h-3 w-3" />
                Pay Now
              </Button>
            </Link>
          );
        }

        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleViewBookingDetails(booking)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const pastColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      enableHiding: true,
    },
    {
      accessorKey: "tourTitle",
      header: "Tour Details",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-16 overflow-hidden rounded">
              <Image
                src={row.original.tourImage || "/placeholder.svg"}
                alt={row.getValue("tourTitle")}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            </div>
            <div>
              <div className="font-medium">{row.getValue("tourTitle")}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {row.original.city}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "guide",
      header: "Guide Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original.guideImage ? (
              <Image
                src={row.original.guideImage}
                alt={row.getValue("guide")}
                className="h-8 w-8 rounded-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {(row.getValue("guide") as string).charAt(0)}
                </span>
              </div>
            )}
            <span>{row.getValue("guide")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Completed Date",
      cell: ({ row }) => {
        return new Date(row.getValue("date")).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "guests",
      header: "Guests",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            {row.getValue("guests")}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Amount Paid",
      cell: ({ row }) => {
        const amount = row.original.paymentAmount || row.original.price;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "paymentProvider",
      header: "Payment Method",
      cell: ({ row }) => {
        const provider = row.original.paymentProvider;
        if (!provider)
          return <span className="text-muted-foreground text-sm">N/A</span>;

        const displayName =
          {
            stripe: "Stripe",
            bank_transfer: "Bank Transfer",
            paypal: "PayPal",
          }[provider] || provider;

        return <span className="text-sm">{displayName}</span>;
      },
    },
    {
      accessorKey: "rating",
      header: "Review Status",
      cell: ({ row }) => {
        const rating = row.original.rating;
        const reviewed = row.original.reviewed;

        if (rating || reviewed) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1">
                <Star className="h-3 w-3 fill-white" />
                Rated
              </Badge>
              {rating && (
                <span className="font-semibold text-primary">
                  {rating.toFixed(1)}
                </span>
              )}
            </div>
          );
        }

        return (
          <Badge variant="outline" className="gap-1">
            <MessageCircle className="h-3 w-3" />
            Not Reviewed
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleViewBookingDetails(booking)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!booking.reviewed ? (
                <DropdownMenuItem onClick={() => handleWriteReview(booking)}>
                  <Star className="mr-2 h-4 w-4" />
                  Write review
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleViewReview(booking)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  View review
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const wishlistColumns: ColumnDef<WishlistTableItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableHiding: true,
    },
    {
      accessorKey: "tourTitle",
      header: "Tour",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-16 overflow-hidden rounded">
              <Image
                src={row.original.tourImage}
                alt={row.getValue("tourTitle")}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            </div>
            <div>
              <div className="font-medium">{row.getValue("tourTitle")}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {row.original.location}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "guide",
      header: "Guide",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("category")}</Badge>;
      },
    },
    {
      accessorKey: "durationDays",
      header: "Duration",
      cell: ({ row }) => {
        const days = row.getValue("durationDays") as number;
        return `${days} ${days === 1 ? "day" : "days"}`;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "bookingsCount",
      header: "Bookings",
      cell: ({ row }) => {
        return <span className="text-sm">{row.getValue("bookingsCount")}</span>;
      },
    },
    {
      accessorKey: "reviewsCount",
      header: "Reviews",
      cell: ({ row }) => {
        const reviews = row.getValue("reviewsCount") as number;
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{reviews}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handleRemoveFromWishlist(item.listingId)}
              disabled={removingWishlistId === item.listingId}
            >
              {removingWishlistId === item.listingId ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-3 w-3" />
              )}
              Remove
            </Button>
            <Link href={`/tours/${item.listingId}`}>
              <Button size="sm" className="h-8">
                Book Now
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
            <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Badge className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20">
                <Compass className="h-3.5 w-3.5" />
                Tourist Dashboard
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              My Adventures
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage your bookings and discover new experiences
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="group relative overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Trips</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 ring-1 ring-blue-500/20">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{stats.upcomingTrips}</span>
                  <span className="text-xs text-muted-foreground">trips</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Next 3 months</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Completed Trips</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 ring-1 ring-green-500/20">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{stats.completedTrips}</span>
                  <span className="text-xs text-muted-foreground">trips</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">All time adventures</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Wishlist</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 ring-1 ring-red-500/20">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{stats.wishlist}</span>
                  <span className="text-xs text-muted-foreground">items</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Saved experiences</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 ring-1 ring-purple-500/20">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">On experiences</p>
              </CardContent>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={updateTab}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="upcoming">
                    Upcoming
                    {/* {initialUpcoming.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {upcomingBookingsTotal}
                      </Badge>
                    )} */}
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    {/* {initialPending.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {pendingBookingsTotal}
                      </Badge>
                    )} */}
                  </TabsTrigger>
                  <TabsTrigger value="past">Past Trips</TabsTrigger>
                  <TabsTrigger value="wishlist">
                    <Heart className="mr-1 h-4 w-4" />
                    Wishlist
                    {/* {initialWishlist.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {wishlistTotal}
                      </Badge>
                    )} */}
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    <Star className="mr-1 h-4 w-4" />
                    Reviews
                  </TabsTrigger>
                </TabsList>
                <Link href="/explore">
                  <Button>Discover More Tours</Button>
                </Link>
              </div>

              <TabsContent value="upcoming">
                <Card className="border-2 border-border/50 shadow-lg">
                  <CardContent className="pt-6">
                    <DataTable
                      columns={upcomingColumns}
                      data={initialUpcoming}
                      searchKey="tourTitle"
                      searchPlaceholder="Search tours..."
                      initialColumnVisibility={{
                        id: false,
                        paymentProvider: false,
                      }}
                    />
                {/* Pagination for upcoming bookings */}
                {activeTab === "upcoming" && initialUpcoming.length > 0 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {upcomingBookingsTotal} total
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Page</p>
                        <Select
                          value={`${currentPage}`}
                          onValueChange={(value) => {
                            updatePagination(Number(value), currentLimit);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentPage} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {Array.from(
                              { length: upcomingBookingsTotalPages },
                              (_, i) => i + 1
                            ).map((pageNum) => (
                              <SelectItem key={pageNum} value={`${pageNum}`}>
                                {pageNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          of {upcomingBookingsTotalPages}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                          value={`${currentLimit}`}
                          onValueChange={(value) => {
                            updatePagination(1, Number(value));
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentLimit} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
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
              </TabsContent>

              <TabsContent value="pending">
                <Card className="border-2 border-border/50 shadow-lg">
                  <CardContent className="pt-6">
                    <DataTable
                      columns={upcomingColumns}
                      data={initialPending}
                      searchKey="tourTitle"
                      searchPlaceholder="Search tours..."
                      initialColumnVisibility={{
                        id: false,
                        paymentProvider: false,
                      }}
                    />
                {/* Pagination for pending bookings */}
                {activeTab === "pending" && initialPending.length > 0 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {pendingBookingsTotal} total
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Page</p>
                        <Select
                          value={`${currentPage}`}
                          onValueChange={(value) => {
                            updatePagination(Number(value), currentLimit);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentPage} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {Array.from(
                              { length: pendingBookingsTotalPages },
                              (_, i) => i + 1
                            ).map((pageNum) => (
                              <SelectItem key={pageNum} value={`${pageNum}`}>
                                {pageNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          of {pendingBookingsTotalPages}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                          value={`${currentLimit}`}
                          onValueChange={(value) => {
                            updatePagination(1, Number(value));
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentLimit} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
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
              </TabsContent>

              <TabsContent value="past">
                <Card className="border-2 border-border/50 shadow-lg">
                  <CardContent className="pt-6">
                    <DataTable
                      columns={pastColumns}
                      data={initialPast}
                      searchKey="tourTitle"
                      searchPlaceholder="Search tours..."
                      initialColumnVisibility={{
                        id: false,
                        paymentProvider: false,
                      }}
                    />
                {/* Pagination for past bookings */}
                {activeTab === "past" && initialPast.length > 0 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {pastBookingsTotal} total
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Page</p>
                        <Select
                          value={`${currentPage}`}
                          onValueChange={(value) => {
                            updatePagination(Number(value), currentLimit);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentPage} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {Array.from(
                              { length: pastBookingsTotalPages },
                              (_, i) => i + 1
                            ).map((pageNum) => (
                              <SelectItem key={pageNum} value={`${pageNum}`}>
                                {pageNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          of {pastBookingsTotalPages}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                          value={`${currentLimit}`}
                          onValueChange={(value) => {
                            updatePagination(1, Number(value));
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentLimit} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
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
              </TabsContent>

              <TabsContent value="wishlist">
                <Card className="border-2 border-border/50 shadow-lg">
                  <CardContent className="pt-6">
                    <DataTable
                      columns={wishlistColumns}
                      data={initialWishlist}
                      searchKey="tourTitle"
                      searchPlaceholder="Search wishlist..."
                      initialColumnVisibility={{ id: false }}
                    />
                {/* Pagination for wishlist */}
                {activeTab === "wishlist" && initialWishlist.length > 0 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {wishlistTotal} total
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Page</p>
                        <Select
                          value={`${currentPage}`}
                          onValueChange={(value) => {
                            updatePagination(Number(value), currentLimit);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentPage} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {Array.from(
                              { length: wishlistTotalPages },
                              (_, i) => i + 1
                            ).map((pageNum) => (
                              <SelectItem key={pageNum} value={`${pageNum}`}>
                                {pageNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          of {wishlistTotalPages}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                          value={`${currentLimit}`}
                          onValueChange={(value) => {
                            updatePagination(1, Number(value));
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentLimit} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
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
              </TabsContent>

              <TabsContent value="reviews">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted-foreground">
                      Complete a trip and leave a review to see it here
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id} className="border-2 border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-1">
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
                                  <span className="text-sm font-medium">
                                    {review.rating}/5
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {review.listing?.title || "N/A"}
                                </p>
                                {review.guide?.user?.name && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Guide: {review.guide.user.name}
                                  </p>
                                )}
                                {review.comment && (
                                  <p className="text-foreground">
                                    {review.comment}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                  <span>
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination Controls for Reviews */}
                    {activeTab === "reviews" && reviews.length > 0 && (
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Rows per page
                          </p>
                          <Select
                            value={currentLimit.toString()}
                            onValueChange={(value) => {
                              updatePagination(1, Number(value));
                            }}
                          >
                            <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[5, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Page {currentPage} of {reviewsTotalPages || 1} (
                            {reviewsTotal || reviews.length} total)
                          </p>
                          {reviewsTotalPages > 1 && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updatePagination(1, currentLimit)
                                }
                                disabled={currentPage === 1}
                              >
                                First
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updatePagination(
                                    Math.max(1, currentPage - 1),
                                    currentLimit
                                  )
                                }
                                disabled={currentPage === 1}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updatePagination(
                                    Math.min(
                                      reviewsTotalPages,
                                      currentPage + 1
                                    ),
                                    currentLimit
                                  )
                                }
                                disabled={currentPage === reviewsTotalPages}
                              >
                                Next
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updatePagination(
                                    reviewsTotalPages,
                                    currentLimit
                                  )
                                }
                                disabled={currentPage === reviewsTotalPages}
                              >
                                Last
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        userRole="TOURIST"
        booking={
          selectedBooking
            ? {
                id: selectedBooking.id,
                tourTitle: selectedBooking.tourTitle,
                guide: selectedBooking.guide,
                date: selectedBooking.date,
                time: new Date(selectedBooking.date).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                  }
                ),
                guests: selectedBooking.guests,
                numberOfGuests: selectedBooking.guests,
                price: selectedBooking.totalPrice || selectedBooking.price,
                status: selectedBooking.status,
                location: selectedBooking.city,
                meetingPoint:
                  selectedBooking.meetingPoint || selectedBooking.city,
                category: selectedBooking.category,
                durationDays: selectedBooking.durationDays,
                createdAt: selectedBooking.createdAt,
                confirmationNumber: selectedBooking.id.slice(0, 8),
                paymentStatus: selectedBooking.paymentStatus,
                stripePaymentIntentId: selectedBooking.stripePaymentIntentId,
              }
            : undefined
        }
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setBookingToReview(null);
        }}
        tourTitle={bookingToReview?.tourTitle || ""}
        guideName={bookingToReview?.guide || ""}
        bookingId={bookingToReview?.id || ""}
        mode={reviewMode}
        onSuccess={() => {
          // Refresh the page to get updated data from server
          router.refresh();
        }}
      />
    </div>
  );
}
