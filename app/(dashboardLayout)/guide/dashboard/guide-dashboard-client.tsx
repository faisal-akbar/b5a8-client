"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookingDetailsModal } from "@/components/modals/booking-details-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  getBookingById,
  updateBookingStatus,
} from "@/services/booking/booking.service";
import { deleteListing } from "@/services/listing/listing.service";
import type {
  GuideBadge,
  GuideBooking,
  GuideListing,
  GuideReview,
  GuideStats,
} from "@/types/guide";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  CalendarDays,
  Check,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface GuideDashboardClientProps {
  initialData: {
    listings: GuideListing[];
    listingsTotal: number;
    listingsTotalPages: number;
    upcomingBookings: GuideBooking[];
    upcomingBookingsTotal: number;
    upcomingBookingsTotalPages: number;
    pendingRequests: GuideBooking[];
    pendingBookingsTotal: number;
    pendingBookingsTotalPages: number;
    completedBookings: GuideBooking[];
    completedBookingsTotal: number;
    completedBookingsTotalPages: number;
    stats: GuideStats;
    badges: GuideBadge[];
    reviews: GuideReview[];
    reviewsTotal: number;
    reviewsTotalPages: number;
    activeTab: string;
    currentPage: number;
    currentLimit: number;
  };
}

export function GuideDashboardClient({
  initialData,
}: GuideDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial tab from URL or initialData
  const initialTab =
    searchParams.get("tab") || initialData.activeTab || "upcoming";

  // Use local state for active tab to update immediately on click
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync local state with URL params when they change (e.g., browser back/forward)
  useEffect(() => {
    const urlTab =
      searchParams.get("tab") || initialData.activeTab || "upcoming";
    setActiveTab(urlTab);
  }, [searchParams, initialData.activeTab]);

  // Get pagination from URL or initialData
  const currentPage = parseInt(
    searchParams.get("page") || initialData.currentPage.toString(),
    10
  );
  const currentLimit = parseInt(
    searchParams.get("limit") || initialData.currentLimit.toString(),
    10
  );

  const [selectedBooking, setSelectedBooking] = useState<GuideBooking | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [bookingToUpdate, setBookingToUpdate] = useState<string | null>(null);

  // Update URL with tab and pagination params
  const updateTabAndPagination = useCallback(
    (tab: string, page: number, limit: number) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      const url = `/guide/dashboard?${params.toString()}`;
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

  // Refresh data when refresh query param is present (e.g., after creating a listing)
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh) {
      // Clean up the URL and trigger server re-fetch
      const params = new URLSearchParams(searchParams.toString());
      params.delete("refresh");
      router.replace(`/guide/dashboard?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [searchParams, router]);

  const handleViewBookingDetails = async (booking: GuideBooking) => {
    try {
      const result = await getBookingById(booking.id);
      if (result.success && result.data) {
        setSelectedBooking(result.data);
        setIsDetailsModalOpen(true);
      } else {
        toast.error("Failed to load booking details");
      }
    } catch (error) {
      toast.error("Failed to load booking details");
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const result = await updateBookingStatus({
        id: bookingId,
        status: "CONFIRMED",
      });
      if (result.success) {
        toast.success("Booking accepted successfully");
        setIsAcceptDialogOpen(false);
        setBookingToUpdate(null);
        // Refresh the page to get updated data from server
        router.refresh();
      } else {
        toast.error(result.message || "Failed to accept booking");
      }
    } catch (error) {
      toast.error("Failed to accept booking");
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      const result = await updateBookingStatus({
        id: bookingId,
        status: "CANCELLED",
      });
      if (result.success) {
        toast.success("Booking declined successfully");
        setIsDeclineDialogOpen(false);
        setBookingToUpdate(null);
        // Refresh the page to get updated data from server
        router.refresh();
      } else {
        toast.error(result.message || "Failed to decline booking");
      }
    } catch (error) {
      toast.error("Failed to decline booking");
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      const result = await updateBookingStatus({
        id: bookingId,
        status: "COMPLETED",
      });
      if (result.success) {
        toast.success(
          "Booking marked as completed. You can now release the payment."
        );
        setIsCompleteDialogOpen(false);
        setBookingToUpdate(null);
        // Refresh the page to get updated data from server
        router.refresh();
      } else {
        toast.error(result.message || "Failed to mark booking as completed");
      }
    } catch (error) {
      toast.error("Failed to mark booking as completed");
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    try {
      const result = await deleteListing(listingToDelete);
      if (result.success) {
        toast.success("Listing deleted successfully");
        setIsDeleteDialogOpen(false);
        setListingToDelete(null);
        // Refresh the page to get updated data from server
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const bookingsColumns: ColumnDef<GuideBooking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>;
      },
    },
    {
      accessorKey: "listing.title",
      header: "Tour",
      cell: ({ row }) => {
        return row.original.listing?.title || "N/A";
      },
    },
    {
      id: "tourist.user.name",
      accessorKey: "tourist.user.name",
      accessorFn: (row) => {
        return row.tourist?.user?.name || "";
      },
      header: "Tourist",
      cell: ({ row }) => {
        return row.original.tourist?.user?.name || "N/A";
      },
      filterFn: (row, id, value) => {
        const touristName = row.original.tourist?.user?.name || "";
        return touristName.toLowerCase().includes(value.toLowerCase());
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
      id: "time",
      header: "Time",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
      },
    },
    {
      id: "guests",
      accessorKey: "numberOfGuests",
      header: "Guests",
      cell: ({ row }) => {
        const numberOfGuests = row.original.numberOfGuests || 0;
        return numberOfGuests > 0
          ? `${numberOfGuests} ${numberOfGuests === 1 ? "guest" : "guests"}`
          : "N/A";
      },
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const tourFee = row.original.listing?.tourFee || 0;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(tourFee);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "CONFIRMED"
                ? "default"
                : status === "PENDING"
                ? "secondary"
                : status === "COMPLETED"
                ? "outline"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        const bookingDate = new Date(booking.date);
        const now = new Date();
        // Allow completion if date is today or in the past
        const isTodayOrPast = bookingDate <= now;
        // Allow completion for any CONFIRMED booking (guides can mark as completed anytime)
        const canComplete = booking.status === "CONFIRMED";
        // Only allow cancel for future bookings
        const canCancel = booking.status === "CONFIRMED" && !isTodayOrPast;

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
              {canComplete && (
                <DropdownMenuItem
                  onClick={() => {
                    setBookingToUpdate(booking.id);
                    setIsCompleteDialogOpen(true);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              {canCancel && (
                <DropdownMenuItem
                  onClick={() => {
                    setBookingToUpdate(booking.id);
                    setIsDeclineDialogOpen(true);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Booking
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const completedBookingsColumns: ColumnDef<GuideBooking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>;
      },
    },
    {
      accessorKey: "listing.title",
      header: "Tour",
      cell: ({ row }) => {
        return row.original.listing?.title || "N/A";
      },
    },
    {
      id: "tourist.user.name",
      accessorKey: "tourist.user.name",
      accessorFn: (row) => {
        return row.tourist?.user?.name || "";
      },
      header: "Tourist",
      cell: ({ row }) => {
        return row.original.tourist?.user?.name || "N/A";
      },
      filterFn: (row, id, value) => {
        const touristName = row.original.tourist?.user?.name || "";
        return touristName.toLowerCase().includes(value.toLowerCase());
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
      id: "time",
      header: "Time",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
      },
    },
    {
      id: "guests",
      accessorKey: "numberOfGuests",
      header: "Guests",
      cell: ({ row }) => {
        const numberOfGuests = row.original.numberOfGuests || 0;
        return numberOfGuests > 0
          ? `${numberOfGuests} ${numberOfGuests === 1 ? "guest" : "guests"}`
          : "N/A";
      },
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const tourFee = row.original.listing?.tourFee || 0;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(tourFee);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant="outline">{status}</Badge>;
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

  const pendingColumns: ColumnDef<GuideBooking>[] = [
    {
      accessorKey: "id",
      header: "Request ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>;
      },
    },
    {
      accessorKey: "listing.title",
      header: "Tour",
      cell: ({ row }) => {
        return row.original.listing?.title || "N/A";
      },
    },
    {
      id: "tourist.user.name",
      accessorKey: "tourist.user.name",
      accessorFn: (row) => {
        return row.tourist?.user?.name || "";
      },
      header: "Tourist",
      cell: ({ row }) => {
        return row.original.tourist?.user?.name || "N/A";
      },
      filterFn: (row, id, value) => {
        const touristName = row.original.tourist?.user?.name || "";
        return touristName.toLowerCase().includes(value.toLowerCase());
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
      id: "guests",
      accessorKey: "numberOfGuests",
      header: "Guests",
      cell: ({ row }) => {
        const numberOfGuests = row.original.numberOfGuests || 0;
        return numberOfGuests > 0
          ? `${numberOfGuests} ${numberOfGuests === 1 ? "guest" : "guests"}`
          : "N/A";
      },
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const tourFee = row.original.listing?.tourFee || 0;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(tourFee);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8"
              onClick={() => {
                setBookingToUpdate(booking.id);
                setIsAcceptDialogOpen(true);
              }}
            >
              <Check className="mr-1 h-3 w-3" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 bg-transparent"
              onClick={() => {
                setBookingToUpdate(booking.id);
                setIsDeclineDialogOpen(true);
              }}
            >
              <X className="mr-1 h-3 w-3" />
              Decline
            </Button>
          </div>
        );
      },
    },
  ];

  const toursColumns: ColumnDef<GuideListing>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>;
      },
    },
    {
      accessorKey: "title",
      header: "Tour Title",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return <Badge variant="outline">{category}</Badge>;
      },
    },
    {
      accessorKey: "city",
      header: "City",
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
      accessorKey: "tourFee",
      header: "Tour Fee",
      cell: ({ row }) => {
        const fee = row.getValue("tourFee") as number;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(fee);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "meetingPoint",
      header: "Meeting Point",
      cell: ({ row }) => {
        const meetingPoint = row.getValue("meetingPoint") as string;
        return (
          <span className="text-sm text-muted-foreground">{meetingPoint}</span>
        );
      },
    },
    {
      accessorKey: "maxGroupSize",
      header: "Max Group",
      cell: ({ row }) => {
        const maxGroupSize = row.getValue("maxGroupSize") as number;
        return `${maxGroupSize} ${maxGroupSize === 1 ? "person" : "people"}`;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "active" : "inactive"}
          </Badge>
        );
      },
    },
    {
      id: "bookings",
      header: "Bookings",
      cell: ({ row }) => {
        // Support both _count.bookings (from API) and bookingsCount (transformed)
        const bookings =
          row.original._count?.bookings ?? row.original.bookingsCount ?? 0;
        return bookings;
      },
    },
    {
      id: "revenue",
      header: "Revenue",
      cell: ({ row }) => {
        // Calculate revenue from bookings count and tour fee
        // Support both _count.bookings (from API) and bookingsCount (transformed)
        const bookingsCount =
          row.original._count?.bookings ?? row.original.bookingsCount ?? 0;
        const tourFee = row.original.tourFee || 0;
        const revenue = bookingsCount * tourFee;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(revenue);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "averageRating",
      header: "Rating",
      cell: ({ row }) => {
        // averageRating can be null, undefined, or a number from API
        // Server sets averageRating: 0 when there are no reviews
        // Server sets averageRating: <calculated value> when there are reviews
        const rating = row.original.averageRating;
        // Support both _count.reviews (from API) and reviewsCount (transformed)
        const reviews =
          row.original._count?.reviews ?? row.original.reviewsCount ?? 0;
        // Show rating if it's a valid number > 0, or if it's 0 but there are reviews (edge case)
        // Otherwise show N/A (no reviews or invalid rating)
        const hasValidRating =
          typeof rating === "number" &&
          !isNaN(rating) &&
          (rating > 0 || (rating === 0 && reviews > 0));
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {hasValidRating ? rating.toFixed(1) : "N/A"} ({reviews})
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const listing = row.original;
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
              <DropdownMenuItem asChild>
                <Link href={`/tours/${listing.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View tour
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/guide/dashboard/listings/${listing.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit tour
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setListingToDelete(listing.id);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete tour
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div
            className="mb-8 animate-in fade-in slide-in-from-top-4"
            style={{ animationDuration: "300ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Guide Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your tours and bookings
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.refresh()
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button> */}
                {/* {initialData.badges.length > 0 && (
                  <div className="flex gap-2">
                    {initialData.badges.map((badge) => (
                      <Badge key={badge.id} variant="outline" className="text-sm">
                        {badge.badge.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Earnings"
              value={`$${initialData.stats.totalEarnings.toLocaleString()}`}
              description="Total earnings from all completed bookings"
              icon={DollarSign}
              index={0}
            />
            <StatCard
              title="Completed Bookings"
              value={initialData.stats.totalCompletedBookings.toString()}
              description="Total completed bookings"
              icon={CalendarDays}
              index={1}
            />
            <StatCard
              title="Average Rating"
              value={
                initialData.stats.averageRating > 0
                  ? initialData.stats.averageRating.toFixed(1)
                  : "0.0"
              }
              description="Average rating from all reviews"
              icon={Star}
              index={2}
            />
            <StatCard
              title="Active Tours"
              value={initialData.stats.activeTours.toString()}
              description={`${initialData.stats.totalTours} total listings`}
              icon={TrendingUp}
              index={3}
            />
          </div>

          <div
            className="animate-in fade-in"
            style={{
              animationDuration: "300ms",
              animationDelay: "400ms",
              animationFillMode: "backwards",
            }}
          >
            <Tabs
              value={activeTab}
              onValueChange={updateTab}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
                  <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed Bookings
                  </TabsTrigger>
                  <TabsTrigger value="listings">My Tours</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Link href="/guide/dashboard/availability">
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Availability
                    </Button>
                  </Link>
                  <Link href="/guide/dashboard/payments">
                    <Button variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payments
                    </Button>
                  </Link>
                  <Link href="/guide/dashboard/listings/new">
                    <Button>Create New Tour</Button>
                  </Link>
                </div>
              </div>

              <TabsContent value="upcoming">
                <DataTable
                  columns={bookingsColumns}
                  data={initialData.upcomingBookings}
                  searchKey="tourist.user.name"
                  searchPlaceholder="Search by tourist name..."
                  initialColumnVisibility={{
                    id: false,
                    paymentProvider: false,
                  }}
                />
                {/* Pagination for upcoming bookings */}
                {activeTab === "upcoming" &&
                  initialData.upcomingBookings.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {initialData.upcomingBookingsTotal} total
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
                                {
                                  length:
                                    initialData.upcomingBookingsTotalPages,
                                },
                                (_, i) => i + 1
                              ).map((pageNum) => (
                                <SelectItem key={pageNum} value={`${pageNum}`}>
                                  {pageNum}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            of {initialData.upcomingBookingsTotalPages}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">Rows per page</p>
                          <Select
                            value={`${currentLimit}`}
                            onValueChange={(value) => {
                              updatePagination(1, Number(value)); // Reset to page 1 when limit changes
                            }}
                          >
                            <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue placeholder={currentLimit} />
                            </SelectTrigger>
                            <SelectContent side="top">
                              {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                  key={pageSize}
                                  value={`${pageSize}`}
                                >
                                  {pageSize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
              </TabsContent>

              <TabsContent value="pending">
                <DataTable
                  columns={pendingColumns}
                  data={initialData.pendingRequests}
                  searchKey="tourist.user.name"
                  searchPlaceholder="Search by tourist name..."
                  initialColumnVisibility={{
                    id: false,
                    paymentProvider: false,
                  }}
                />
                {/* Pagination for pending bookings */}
                {activeTab === "pending" &&
                  initialData.pendingRequests.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {initialData.pendingBookingsTotal} total
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
                                {
                                  length: initialData.pendingBookingsTotalPages,
                                },
                                (_, i) => i + 1
                              ).map((pageNum) => (
                                <SelectItem key={pageNum} value={`${pageNum}`}>
                                  {pageNum}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            of {initialData.pendingBookingsTotalPages}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">Rows per page</p>
                          <Select
                            value={`${currentLimit}`}
                            onValueChange={(value) => {
                              updatePagination(1, Number(value)); // Reset to page 1 when limit changes
                            }}
                          >
                            <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue placeholder={currentLimit} />
                            </SelectTrigger>
                            <SelectContent side="top">
                              {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                  key={pageSize}
                                  value={`${pageSize}`}
                                >
                                  {pageSize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
              </TabsContent>

              <TabsContent value="completed">
                <DataTable
                  columns={completedBookingsColumns}
                  data={initialData.completedBookings}
                  searchKey="tourist.user.name"
                  searchPlaceholder="Search by tourist name..."
                  initialColumnVisibility={{
                    id: false,
                    paymentProvider: false,
                  }}
                />
                {/* Pagination for completed bookings */}
                {activeTab === "completed" &&
                  initialData.completedBookings.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {initialData.completedBookingsTotal} total
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
                                {
                                  length:
                                    initialData.completedBookingsTotalPages,
                                },
                                (_, i) => i + 1
                              ).map((pageNum) => (
                                <SelectItem key={pageNum} value={`${pageNum}`}>
                                  {pageNum}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            of {initialData.completedBookingsTotalPages}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">Rows per page</p>
                          <Select
                            value={`${currentLimit}`}
                            onValueChange={(value) => {
                              updatePagination(1, Number(value)); // Reset to page 1 when limit changes
                            }}
                          >
                            <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue placeholder={currentLimit} />
                            </SelectTrigger>
                            <SelectContent side="top">
                              {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                  key={pageSize}
                                  value={`${pageSize}`}
                                >
                                  {pageSize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
              </TabsContent>

              <TabsContent value="listings">
                <DataTable
                  columns={toursColumns}
                  data={initialData.listings}
                  searchKey="title"
                  searchPlaceholder="Search tours..."
                  disablePagination={true}
                  initialColumnVisibility={{
                    id: false,
                    meetingPoint: false,
                  }}
                />
                {/* Pagination for listings */}
                {activeTab === "listings" &&
                  initialData.listings.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {initialData.listingsTotal} total
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
                                { length: initialData.listingsTotalPages },
                                (_, i) => i + 1
                              ).map((pageNum) => (
                                <SelectItem key={pageNum} value={`${pageNum}`}>
                                  {pageNum}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            of {initialData.listingsTotalPages}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">Rows per page</p>
                          <Select
                            value={`${currentLimit}`}
                            onValueChange={(value) => {
                              updatePagination(1, Number(value)); // Reset to page 1 when limit changes
                            }}
                          >
                            <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue placeholder={currentLimit} />
                            </SelectTrigger>
                            <SelectContent side="top">
                              {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                  key={pageSize}
                                  value={`${pageSize}`}
                                >
                                  {pageSize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
              </TabsContent>

              <TabsContent value="reviews">
                {initialData.reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted-foreground">
                      Reviews from tourists will appear here
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {initialData.reviews.map((review) => (
                        <Card key={review.id}>
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
                                {review.comment && (
                                  <p className="text-foreground">
                                    {review.comment}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                  <span>
                                    {review.tourist?.user?.name || "Anonymous"}
                                  </span>
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
                    {activeTab === "reviews" &&
                      initialData.reviews.length > 0 && (
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
                                  <SelectItem
                                    key={size}
                                    value={size.toString()}
                                  >
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              Page {currentPage} of{" "}
                              {initialData.reviewsTotalPages || 1} (
                              {initialData.reviewsTotal ||
                                initialData.reviews.length}{" "}
                              total)
                            </p>
                            {initialData.reviewsTotalPages > 1 && (
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
                                        initialData.reviewsTotalPages,
                                        currentPage + 1
                                      ),
                                      currentLimit
                                    )
                                  }
                                  disabled={
                                    currentPage ===
                                    initialData.reviewsTotalPages
                                  }
                                >
                                  Next
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updatePagination(
                                      initialData.reviewsTotalPages,
                                      currentLimit
                                    )
                                  }
                                  disabled={
                                    currentPage ===
                                    initialData.reviewsTotalPages
                                  }
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
          </div>
        </div>
      </main>

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        userRole="GUIDE"
        onMarkAsCompleted={(bookingId) => {
          setBookingToUpdate(bookingId);
          setIsCompleteDialogOpen(true);
        }}
        booking={
          selectedBooking
            ? {
                id: selectedBooking.id, // Pass the actual booking ID string
                tourTitle: selectedBooking.listing?.title || "N/A",
                guide: "You (Guide)",
                date: selectedBooking.date,
                time: new Date(selectedBooking.date).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                  }
                ),
                guests: selectedBooking.listing?.maxGroupSize || 1,
                numberOfGuests: selectedBooking.numberOfGuests || 0,
                price: selectedBooking.listing?.tourFee || 0,
                status: selectedBooking.status.toLowerCase(),
                location: selectedBooking.listing?.city || "N/A",
                meetingPoint: selectedBooking.listing?.meetingPoint || "N/A",
                category: selectedBooking.listing?.category,
                durationDays: selectedBooking.listing?.durationDays,
                touristName: selectedBooking.tourist?.user?.name,
                touristEmail: selectedBooking.tourist?.user?.email,
                createdAt: selectedBooking.createdAt,
                updatedAt: selectedBooking.updatedAt,
                guidePhone: undefined,
                confirmationNumber: selectedBooking.id.slice(0, 8),
                paymentStatus: selectedBooking.payment?.status,
              }
            : undefined
        }
        onSuccess={() => {
          // Refresh the page to get updated data from server
          router.refresh();
        }}
      />

      {/* Delete Listing Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteListing}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept Booking Dialog */}
      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this booking request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAcceptDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                bookingToUpdate && handleAcceptBooking(bookingToUpdate)
              }
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline/Cancel Booking Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone and the tourist will be notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeclineDialogOpen(false);
                setBookingToUpdate(null);
              }}
            >
              No, Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                bookingToUpdate && handleDeclineBooking(bookingToUpdate)
              }
            >
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Booking Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Booking as Completed</DialogTitle>
            <DialogDescription>
              Mark this booking as completed? Once completed, you will be able
              to release the payment for this tour.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCompleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                bookingToUpdate && handleCompleteBooking(bookingToUpdate)
              }
            >
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
