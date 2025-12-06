"use client"

import { useState } from "react"
import { Footer } from "@/components/layout/footer"
import { StatCard } from "@/components/dashboard/stat-card"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, MapPin, Heart, Star, MessageCircle, MoreHorizontal, Eye, Loader2, Trash2, Users } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Link from "next/link"
import { removeFromWishlist } from "@/services/wishlist/wishlist.service"
import { BookingDetailsModal } from "@/components/modals/booking-details-modal"
import { getBookingById } from "@/services/booking/booking.service"
import { toast } from "sonner"

// Types
type Booking = {
  id: string
  tourTitle: string
  tourImage: string
  guide: string
  guideImage: string | null
  location: string
  city: string
  date: string
  guests: number
  price: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  createdAt: string
  paymentStatus: string
  rating?: number
  reviewed?: boolean
}

type WishlistTableItem = {
  id: string
  tourTitle: string
  tourImage: string
  guide: string
  location: string
  category: string
  price: number
  durationDays: number
  bookingsCount: number
  reviewsCount: number
  listingId: string
}

type TouristReview = {
  id: string
  rating: number
  comment: string
  createdAt: string
  listing: {
    title: string
  } | null
  guide: {
    user: {
      name: string
    }
  } | null
}

type Stats = {
  upcomingTrips: number
  completedTrips: number
  wishlist: number
  totalSpent: number
}

interface TouristDashboardClientProps {
  upcomingBookings: Booking[]
  pendingBookings: Booking[]
  pastBookings: Booking[]
  wishlistItems: WishlistTableItem[]
  reviews: TouristReview[]
  stats: Stats
}

export function TouristDashboardClient({
  upcomingBookings: initialUpcoming,
  pendingBookings: initialPending,
  pastBookings: initialPast,
  wishlistItems: initialWishlist,
  reviews,
  stats,
}: TouristDashboardClientProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistTableItem[]>(initialWishlist)
  const [removingWishlistId, setRemovingWishlistId] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Handle removing item from wishlist
  const handleRemoveFromWishlist = async (listingId: string) => {
    setRemovingWishlistId(listingId)
    const result = await removeFromWishlist(listingId)
    if (result.success) {
      setWishlistItems(prev => prev.filter(item => item.listingId !== listingId))
    }
    setRemovingWishlistId(null)
  }

  // Handle viewing booking details
  const handleViewBookingDetails = async (booking: Booking) => {
    try {
      const result = await getBookingById(booking.id)
      if (result.success && result.data) {
        // Transform the API data to match the Booking type
        const transformedBooking: Booking = {
          id: result.data.id,
          tourTitle: result.data.listing?.title || "N/A",
          tourImage: result.data.listing?.images?.[0] || "",
          guide: result.data.listing?.guide?.user?.name || "N/A",
          guideImage: result.data.listing?.guide?.user?.image || null,
          location: result.data.listing?.location || "N/A",
          city: result.data.listing?.city || "N/A",
          date: result.data.date,
          guests: result.data.numberOfGuests || 0,
          price: result.data.listing?.tourFee || 0,
          status: result.data.status.toLowerCase() as "confirmed" | "pending" | "completed" | "cancelled",
          createdAt: result.data.createdAt,
          paymentStatus: result.data.paymentStatus || "Pending",
          rating: booking.rating,
          reviewed: booking.reviewed,
        }
        setSelectedBooking(transformedBooking)
        setIsDetailsModalOpen(true)
      } else {
        toast.error("Failed to load booking details")
      }
    } catch (error) {
      toast.error("Failed to load booking details")
    }
  }

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
              <img
                src={row.original.tourImage || "/placeholder.svg"}
                alt={row.getValue("tourTitle")}
                className="h-full w-full object-cover"
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
        )
      },
    },
    {
      accessorKey: "guide",
      header: "Guide",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original.guideImage ? (
              <img
                src={row.original.guideImage}
                alt={row.getValue("guide")}
                className="h-8 w-8 rounded-full object-cover"
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
        )
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
      accessorKey: "guests",
      header: "Guests",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            {row.getValue("guests")}
          </div>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string
        return (
          <Badge variant={status === "Paid" ? "default" : "secondary"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge variant={status === "confirmed" ? "default" : "secondary"}>{status}</Badge>
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
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact guide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const pastColumns: ColumnDef<Booking>[] = [
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
              <img
                src={row.original.tourImage || "/placeholder.svg"}
                alt={row.getValue("tourTitle")}
                className="h-full w-full object-cover"
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
        )
      },
    },
    {
      accessorKey: "guide",
      header: "Guide",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original.guideImage ? (
              <img
                src={row.original.guideImage}
                alt={row.getValue("guide")}
                className="h-8 w-8 rounded-full object-cover"
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
        )
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
      accessorKey: "guests",
      header: "Guests",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            {row.getValue("guests")}
          </div>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.original.rating

        return rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Not rated</span>
        )
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
              variant="outline"
              className="h-8 bg-transparent"
              onClick={() => handleViewBookingDetails(booking)}
            >
              <Eye className="mr-1 h-3 w-3" />
              View Details
            </Button>
            {!booking.reviewed ? (
              <Button size="sm" className="h-8">
                <Star className="mr-1 h-3 w-3" />
                Write Review
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="h-8 bg-transparent">
                View Review
              </Button>
            )}
          </div>
        )
      },
    },
  ]

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
              <img
                src={row.original.tourImage || "/placeholder.svg"}
                alt={row.getValue("tourTitle")}
                className="h-full w-full object-cover"
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
        )
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
        return <Badge variant="outline">{row.getValue("category")}</Badge>
      },
    },
    {
      accessorKey: "durationDays",
      header: "Duration",
      cell: ({ row }) => {
        const days = row.getValue("durationDays") as number
        return `${days} ${days === 1 ? "day" : "days"}`
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "bookingsCount",
      header: "Bookings",
      cell: ({ row }) => {
        return <span className="text-sm">{row.getValue("bookingsCount")}</span>
      },
    },
    {
      accessorKey: "reviewsCount",
      header: "Reviews",
      cell: ({ row }) => {
        const reviews = row.getValue("reviewsCount") as number
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{reviews}</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
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
        )
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
            <p className="mt-2 text-muted-foreground">View and manage your bookings</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Upcoming Trips"
              value={stats.upcomingTrips}
              description="Next 3 months"
              icon={CalendarDays}
              index={0}
            />
            <StatCard
              title="Completed Trips"
              value={stats.completedTrips}
              description="All time adventures"
              icon={MapPin}
              index={1}
            />
            <StatCard title="Wishlist" value={stats.wishlist} description="Saved experiences" icon={Heart} index={2} />
            <StatCard
              title="Total Spent"
              value={`$${stats.totalSpent.toLocaleString()}`}
              description="On experiences"
              icon={Star}
              index={3}
            />
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
            <Tabs defaultValue="upcoming" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="upcoming">
                    Upcoming
                    {initialUpcoming.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {initialUpcoming.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    {initialPending.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {initialPending.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="past">Past Trips</TabsTrigger>
                  <TabsTrigger value="wishlist">
                    <Heart className="mr-1 h-4 w-4" />
                    Wishlist
                    {wishlistItems.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {wishlistItems.length}
                      </Badge>
                    )}
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
                <DataTable
                  columns={upcomingColumns}
                  data={initialUpcoming}
                  searchKey="tourTitle"
                  searchPlaceholder="Search tours..."
                  initialColumnVisibility={{ id: false }}
                />
              </TabsContent>

              <TabsContent value="pending">
                <DataTable
                  columns={upcomingColumns}
                  data={initialPending}
                  searchKey="tourTitle"
                  searchPlaceholder="Search tours..."
                  initialColumnVisibility={{ id: false }}
                />
              </TabsContent>

              <TabsContent value="past">
                <DataTable
                  columns={pastColumns}
                  data={initialPast}
                  searchKey="tourTitle"
                  searchPlaceholder="Search tours..."
                  initialColumnVisibility={{ id: false }}
                />
              </TabsContent>

              <TabsContent value="wishlist">
                <DataTable
                  columns={wishlistColumns}
                  data={wishlistItems}
                  searchKey="tourTitle"
                  searchPlaceholder="Search wishlist..."
                  initialColumnVisibility={{ id: false }}
                />
              </TabsContent>

              <TabsContent value="reviews">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">Complete a trip and leave a review to see it here</p>
                  </div>
                ) : (
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
                                      className={`h-4 w-4 ${i < review.rating
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
                              {review.guide?.user?.name && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  Guide: {review.guide.user.name}
                                </p>
                              )}
                              {review.comment && (
                                <p className="text-foreground">{review.comment}</p>
                              )}
                              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
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
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
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
              id: selectedBooking.id,
              tourTitle: selectedBooking.tourTitle,
              guide: selectedBooking.guide,
              date: selectedBooking.date,
              time: new Date(selectedBooking.date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
              guests: selectedBooking.guests,
              numberOfGuests: selectedBooking.guests,
              price: selectedBooking.price,
              status: selectedBooking.status,
              location: selectedBooking.location,
              meetingPoint: selectedBooking.location, // Using location as fallback
              confirmationNumber: selectedBooking.id.slice(0, 8),
            }
            : undefined
        }
      />
    </div>
  )
}

