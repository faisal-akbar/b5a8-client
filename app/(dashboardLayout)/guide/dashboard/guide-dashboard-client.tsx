"use client"

import { Footer } from "@/components/layout/footer"
import { StatCard } from "@/components/dashboard/stat-card"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarDays, DollarSign, Star, TrendingUp, Eye, Check, X, Edit, MoreHorizontal, Trash2, Calendar, CreditCard, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect, useCallback } from "react"
import { BookingDetailsModal } from "@/components/modals/booking-details-modal"
import { toast } from "sonner"
import { getMyListings } from "@/services/listing/listing.service"
import { getMyBookings, updateBookingStatus, getBookingById } from "@/services/booking/booking.service"
import { getPayments } from "@/services/payment/payment.service"
import { getMyProfile } from "@/services/user/user.service"
import { deleteListing } from "@/services/listing/listing.service"
import { getGuideBadges } from "@/services/badge/badge.service"
import type { GuideListing, GuideBooking, GuideStats, GuideReview, GuideBadge, GuidePayment } from "@/types/guide"
import { useRouter, useSearchParams } from "next/navigation"

interface GuideDashboardClientProps {
  initialData: {
    listings: GuideListing[]
    upcomingBookings: GuideBooking[]
    pendingRequests: GuideBooking[]
    payments: GuidePayment[]
    stats: GuideStats
    badges: GuideBadge[]
    reviews: GuideReview[]
    reviewsTotal: number
    reviewsTotalPages: number
  }
}

export function GuideDashboardClient({ initialData }: GuideDashboardClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get pagination from URL
  const reviewsPage = parseInt(searchParams.get("page") || "1", 10)
  const reviewsLimit = parseInt(searchParams.get("limit") || "5", 10)
  
  const [selectedBooking, setSelectedBooking] = useState<GuideBooking | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [bookingToUpdate, setBookingToUpdate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<GuideStats>(initialData.stats)
  const [upcomingBookings, setUpcomingBookings] = useState<GuideBooking[]>(initialData.upcomingBookings)
  const [pendingRequests, setPendingRequests] = useState<GuideBooking[]>(initialData.pendingRequests)
  const [myListings, setMyListings] = useState<GuideListing[]>(initialData.listings)
  const [reviews, setReviews] = useState<GuideReview[]>(initialData.reviews)
  const [reviewsTotal, setReviewsTotal] = useState(initialData.reviewsTotal)
  const [reviewsTotalPages, setReviewsTotalPages] = useState(initialData.reviewsTotalPages)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)

  const [badges, setBadges] = useState<GuideBadge[]>(initialData.badges)
  const [guideId, setGuideId] = useState<string | null>(null)

  // Sync state when initialData changes (e.g., when URL params change and server re-fetches)
  useEffect(() => {
    setStats(initialData.stats)
    setUpcomingBookings(initialData.upcomingBookings)
    setPendingRequests(initialData.pendingRequests)
    setMyListings(initialData.listings)
    setReviews(initialData.reviews)
    setReviewsTotal(initialData.reviewsTotal)
    setReviewsTotalPages(initialData.reviewsTotalPages)
    setBadges(initialData.badges)
  }, [initialData])

  // Update URL with pagination params
  const updatePagination = useCallback((page: number, limit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    params.set("limit", limit.toString())
    router.push(`/guide/dashboard?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Fetch all data in parallel (reviews will be fetched separately with pagination)
      const [listingsResult, upcomingBookingsResult, pendingBookingsResult, paymentsResult, profileResult] = await Promise.all([
        getMyListings({ page: 1, limit: 100 }),
        getMyBookings({ status: "CONFIRMED", type: "upcoming" }),
        getMyBookings({ status: "PENDING" }),
        getPayments({ page: 1, limit: 100 }),
        getMyProfile(),
      ])

      // Process listings
      let processedListings: GuideListing[] = []
      if (listingsResult.success && listingsResult.data) {
        // Service returns: { success: true, data: { data: [...listings], meta: {...} } }
        // API response includes averageRating, _count.reviews, and _count.bookings
        processedListings = (listingsResult.data.data || []).map((listing: any) => {
          return {
            ...listing,
            reviewsCount: listing._count?.reviews || 0,
            bookingsCount: listing._count?.bookings || 0,
            averageRating: listing.averageRating || 0,
          }
        })
        
        setMyListings(processedListings)
        
        const activeListings = processedListings.filter((l) => l.isActive)
        setStats((prev: GuideStats) => ({
          ...prev,
          totalTours: processedListings.length,
          activeTours: activeListings.length,
        }))
      } else {
        // Set empty array if fetch failed
        setMyListings([])
        console.error("Failed to fetch listings:", listingsResult.message || "Unknown error")
      }

      // Process upcoming bookings
      if (upcomingBookingsResult.success && upcomingBookingsResult.data) {
        const bookings = upcomingBookingsResult.data.data || []
        setUpcomingBookings(bookings)
        
        // Count upcoming tours (next 30 days)
        const now = new Date()
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        const upcomingCount = bookings.filter((b: GuideBooking) => {
          const bookingDate = new Date(b.date)
          return bookingDate >= now && bookingDate <= thirtyDaysFromNow
        }).length
        
        setStats((prev: GuideStats) => ({
          ...prev,
          upcomingTours: upcomingCount,
        }))
      }

      // Process pending bookings
      if (pendingBookingsResult.success && pendingBookingsResult.data) {
        const bookings = pendingBookingsResult.data.data || []
        setPendingRequests(bookings)
      }

      // Process payments for earnings
      if (paymentsResult.success && paymentsResult.data) {
        const payments = paymentsResult.data.data || []
        const totalEarnings = payments
          .filter((p: GuidePayment) => p.status === "COMPLETED" || p.status === "RELEASED")
          .reduce((sum: number, p: GuidePayment) => sum + p.amount, 0)
        
        const now = new Date()
        const thisMonth = now.getMonth()
        const thisYear = now.getFullYear()
        const thisMonthEarnings = payments
          .filter((p: GuidePayment) => {
            const paymentDate = new Date(p.createdAt)
            return (
              (p.status === "COMPLETED" || p.status === "RELEASED") &&
              paymentDate.getMonth() === thisMonth &&
              paymentDate.getFullYear() === thisYear
            )
          })
          .reduce((sum: number, p: GuidePayment) => sum + p.amount, 0)
        
        setStats((prev: GuideStats) => ({
          ...prev,
          totalEarnings,
          thisMonthEarnings,
        }))
      }

      // Process profile for ratings and badges
      if (profileResult.success && profileResult.data) {
        const profile = profileResult.data
        if (profile.role === "GUIDE") {
          // Get guide ID - it might be in profile.guide.id or we need to fetch it
          // For now, we'll use stats if available, or calculate from reviews
          const stats = (profile as any).stats || {}
          const guideId = (profile as any).guide?.id || null
          
          if (guideId) {
            setGuideId(guideId)
          }

          // Get average rating and reviews count from stats (calculated by backend)
          const averageRating = stats.averageRating ?? 0
          const reviewsCount = stats.reviewsCount ?? 0
          
          setStats((prev: GuideStats) => ({
            ...prev,
            totalReviews: reviewsCount,
            averageRating: averageRating,
          }))

          // Fetch badges if we have guide ID
          if (guideId) {
            const badgesResult = await getGuideBadges(guideId)
            if (badgesResult.success && badgesResult.data) {
              setBadges(badgesResult.data.data || [])
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sync state when initialData changes (e.g., when URL params change and server re-fetches)
  useEffect(() => {
    setStats(initialData.stats)
    setUpcomingBookings(initialData.upcomingBookings)
    setPendingRequests(initialData.pendingRequests)
    setMyListings(initialData.listings)
    setReviews(initialData.reviews)
    setReviewsTotal(initialData.reviewsTotal)
    setReviewsTotalPages(initialData.reviewsTotalPages)
    setBadges(initialData.badges)
  }, [initialData])

  // Refetch data when refresh query param is present (e.g., after creating a listing)
  useEffect(() => {
    const refresh = searchParams.get("refresh")
    if (refresh) {
      // Small delay to ensure the listing is saved on the backend
      const timeoutId = setTimeout(() => {
        fetchDashboardData()
        // Clean up the URL after refresh
        const params = new URLSearchParams(searchParams.toString())
        params.delete("refresh")
        router.replace(`/guide/dashboard?${params.toString()}`, { scroll: false })
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [searchParams, router, fetchDashboardData])

  const handleViewBookingDetails = async (booking: GuideBooking) => {
    try {
      const result = await getBookingById(booking.id)
      if (result.success && result.data) {
        setSelectedBooking(result.data)
        setIsDetailsModalOpen(true)
      } else {
        toast.error("Failed to load booking details")
      }
    } catch (error) {
      toast.error("Failed to load booking details")
    }
  }

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const result = await updateBookingStatus({ id: bookingId, status: "CONFIRMED" })
      if (result.success) {
        toast.success("Booking accepted successfully")
        setIsAcceptDialogOpen(false)
        setBookingToUpdate(null)
        fetchDashboardData()
      } else {
        toast.error(result.message || "Failed to accept booking")
      }
    } catch (error) {
      toast.error("Failed to accept booking")
    }
  }

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      const result = await updateBookingStatus({ id: bookingId, status: "CANCELLED" })
      if (result.success) {
        toast.success("Booking declined successfully")
        setIsDeclineDialogOpen(false)
        setBookingToUpdate(null)
        fetchDashboardData()
      } else {
        toast.error(result.message || "Failed to decline booking")
      }
    } catch (error) {
      toast.error("Failed to decline booking")
    }
  }

  const handleDeleteListing = async () => {
    if (!listingToDelete) return
    
    try {
      const result = await deleteListing(listingToDelete)
      if (result.success) {
        toast.success("Listing deleted successfully")
        setIsDeleteDialogOpen(false)
        setListingToDelete(null)
        fetchDashboardData()
      } else {
        toast.error(result.message || "Failed to delete listing")
      }
    } catch (error) {
      toast.error("Failed to delete listing")
    }
  }

  const bookingsColumns: ColumnDef<GuideBooking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>
      },
    },
    {
      accessorKey: "listing.title",
      header: "Tour",
      cell: ({ row }) => {
        return row.original.listing?.title || "N/A"
      },
    },
    {
      accessorKey: "tourist.user.name",
      header: "Tourist",
      cell: ({ row }) => {
        return row.original.tourist?.user?.name || "N/A"
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
        })
      },
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => {
        const date = new Date(row.original.date)
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      },
    },
    {
      id: "guests",
      header: "Guests",
      cell: () => {
        // Group size info might not be in booking, using listing maxGroupSize as fallback
        return "N/A"
      },
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const tourFee = row.original.listing?.tourFee || 0
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(tourFee)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
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
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original
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
              <DropdownMenuItem onClick={() => handleViewBookingDetails(booking)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const pendingColumns: ColumnDef<GuideBooking>[] = [
    {
      accessorKey: "id",
      header: "Request ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>
      },
    },
    {
      accessorKey: "listing.title",
      header: "Tour",
      cell: ({ row }) => {
        return row.original.listing?.title || "N/A"
      },
    },
    {
      accessorKey: "tourist.user.name",
      header: "Tourist",
      cell: ({ row }) => {
        return row.original.tourist?.user?.name || "N/A"
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
        })
      },
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const tourFee = row.original.listing?.tourFee || 0
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(tourFee)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8"
              onClick={() => {
                setBookingToUpdate(booking.id)
                setIsAcceptDialogOpen(true)
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
                setBookingToUpdate(booking.id)
                setIsDeclineDialogOpen(true)
              }}
            >
              <X className="mr-1 h-3 w-3" />
              Decline
            </Button>
          </div>
        )
      },
    },
  ]

  const toursColumns: ColumnDef<GuideListing>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>
      },
    },
    {
      accessorKey: "title",
      header: "Tour Title",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "active" : "inactive"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "bookingsCount",
      header: "Bookings",
      cell: ({ row }) => {
        return row.original.bookingsCount || 0
      },
    },
    {
      id: "revenue",
      header: "Revenue",
      cell: ({ row }) => {
        // Calculate revenue from bookings count and tour fee
        const bookingsCount = row.original.bookingsCount || 0
        const tourFee = row.original.tourFee || 0
        const revenue = bookingsCount * tourFee
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(revenue)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "averageRating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.original.averageRating || 0
        const reviews = row.original.reviewsCount || 0
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {rating > 0 ? rating.toFixed(1) : "N/A"} ({reviews})
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const listing = row.original
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
                  setListingToDelete(listing.id)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete tour
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-in fade-in slide-in-from-top-4" style={{ animationDuration: "300ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Guide Dashboard</h1>
                <p className="mt-2 text-muted-foreground">Manage your tours and bookings</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsLoading(true)
                    fetchDashboardData()
                  }}
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                {badges.length > 0 && (
                  <div className="flex gap-2">
                    {badges.map((badge) => (
                      <Badge key={badge.id} variant="outline" className="text-sm">
                        {badge.badge.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Earnings"
              value={`$${stats.totalEarnings.toLocaleString()}`}
              description={stats.thisMonthEarnings > 0 ? `+$${stats.thisMonthEarnings.toLocaleString()} this month` : "No earnings this month"}
              icon={DollarSign}
              index={0}
            />
            <StatCard
              title="Upcoming Tours"
              value={stats.upcomingTours.toString()}
              description="Next 30 days"
              icon={CalendarDays}
              index={1}
            />
            <StatCard
              title="Average Rating"
              value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "0.0"}
              description={stats.totalReviews > 0 ? `From ${stats.totalReviews} review${stats.totalReviews !== 1 ? "s" : ""}` : "No reviews yet"}
              icon={Star}
              index={2}
            />
            <StatCard
              title="Active Tours"
              value={stats.activeTours.toString()}
              description={`${stats.totalTours} total listings`}
              icon={TrendingUp}
              index={3}
            />
          </div>

          <div
            className="animate-in fade-in"
            style={{ animationDuration: "300ms", animationDelay: "400ms", animationFillMode: "backwards" }}
          >
            <Tabs defaultValue="upcoming" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending Requests
                    {pendingRequests.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {pendingRequests.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="listings">My Tours</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews
                  </TabsTrigger>
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
                  data={upcomingBookings}
                  searchKey="tourist.user.name"
                  searchPlaceholder="Search by tourist name..."
                />
              </TabsContent>

              <TabsContent value="pending">
                <DataTable
                  columns={pendingColumns}
                  data={pendingRequests}
                  searchKey="tourist.user.name"
                  searchPlaceholder="Search by tourist name..."
                />
              </TabsContent>

              <TabsContent value="listings">
                <DataTable
                  columns={toursColumns}
                  data={myListings}
                  searchKey="title"
                  searchPlaceholder="Search tours..."
                />
              </TabsContent>

              <TabsContent value="reviews">
                {isLoadingReviews ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">Reviews from tourists will appear here</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {reviews.map((review) => (
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
                                  <span className="text-sm font-medium">{review.rating}/5</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {review.listing?.title || "N/A"}
                                </p>
                                {review.comment && (
                                  <p className="text-foreground">{review.comment}</p>
                                )}
                                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                  <span>{review.tourist?.user?.name || "Anonymous"}</span>
                                  <span>
                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
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
                    
                    {/* Pagination Controls */}
                    {reviews.length > 0 && (
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">Rows per page</p>
                          <Select
                            value={reviewsLimit.toString()}
                            onValueChange={(value) => {
                              updatePagination(1, Number(value))
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
                            Page {reviewsPage} of {reviewsTotalPages || 1} ({reviewsTotal || reviews.length} total)
                          </p>
                          {reviewsTotalPages > 1 && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updatePagination(1, reviewsLimit)}
                                disabled={reviewsPage === 1 || isLoadingReviews}
                              >
                                First
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updatePagination(Math.max(1, reviewsPage - 1), reviewsLimit)}
                                disabled={reviewsPage === 1 || isLoadingReviews}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updatePagination(Math.min(reviewsTotalPages, reviewsPage + 1), reviewsLimit)}
                                disabled={reviewsPage === reviewsTotalPages || isLoadingReviews}
                              >
                                Next
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updatePagination(reviewsTotalPages, reviewsLimit)}
                                disabled={reviewsPage === reviewsTotalPages || isLoadingReviews}
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

      <Footer />

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedBooking(null)
        }}
        booking={
          selectedBooking
            ? {
                id: Number.parseInt(selectedBooking.id.slice(-6), 16) || 0,
                tourTitle: selectedBooking.listing?.title || "N/A",
                guide: "You (Guide)",
                date: selectedBooking.date,
                time: new Date(selectedBooking.date).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
                guests: selectedBooking.listing?.maxGroupSize || 1,
                price: selectedBooking.listing?.tourFee || 0,
                status: selectedBooking.status.toLowerCase(),
                location: selectedBooking.listing?.city || "N/A",
                meetingPoint: selectedBooking.listing?.meetingPoint || "N/A",
                guidePhone: undefined,
                confirmationNumber: selectedBooking.id.slice(0, 8),
              }
            : undefined
        }
      />

      {/* Delete Listing Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
            <DialogDescription>Are you sure you want to accept this booking request?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => bookingToUpdate && handleAcceptBooking(bookingToUpdate)}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Booking Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Booking</DialogTitle>
            <DialogDescription>Are you sure you want to decline this booking request?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => bookingToUpdate && handleDeclineBooking(bookingToUpdate)}>
              Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

