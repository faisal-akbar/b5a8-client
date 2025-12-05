"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatCard } from "@/components/stat-card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, DollarSign, Star, TrendingUp, Eye, Check, X, Edit, MoreHorizontal } from "lucide-react"
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
import { useState } from "react"
import { BookingDetailsModal } from "@/components/booking-details-modal"

type Booking = {
  id: string
  tourTitle: string
  tourist: string
  date: string
  time: string
  guests: number
  price: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
}

type Tour = {
  id: string
  title: string
  status: "active" | "inactive" | "draft"
  bookings: number
  revenue: number
  rating: number
  reviews: number
}

export default function GuideDashboardPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const stats = {
    totalEarnings: 12450,
    thisMonth: 2340,
    upcomingTours: 8,
    totalReviews: 127,
    averageRating: 4.9,
    totalTours: 24,
  }

  const upcomingBookings: Booking[] = [
    {
      id: "BK001",
      tourTitle: "Hidden Jazz Bars of New Orleans",
      tourist: "Michael Brown",
      date: "2024-01-15",
      time: "7:00 PM",
      guests: 4,
      price: 340,
      status: "confirmed",
    },
    {
      id: "BK002",
      tourTitle: "Hidden Jazz Bars of New Orleans",
      tourist: "Sarah Davis",
      date: "2024-01-18",
      time: "7:00 PM",
      guests: 2,
      price: 170,
      status: "confirmed",
    },
    {
      id: "BK003",
      tourTitle: "Culinary Walking Tour",
      tourist: "James Wilson",
      date: "2024-01-20",
      time: "11:00 AM",
      guests: 6,
      price: 510,
      status: "confirmed",
    },
    {
      id: "BK004",
      tourTitle: "Architecture & History",
      tourist: "Emily Chen",
      date: "2024-01-22",
      time: "2:00 PM",
      guests: 3,
      price: 255,
      status: "confirmed",
    },
  ]

  const pendingRequests: Booking[] = [
    {
      id: "BK005",
      tourTitle: "Hidden Jazz Bars of New Orleans",
      tourist: "Emma Thompson",
      date: "2024-01-22",
      time: "7:00 PM",
      guests: 3,
      price: 255,
      status: "pending",
    },
    {
      id: "BK006",
      tourTitle: "Culinary Walking Tour",
      tourist: "David Martinez",
      date: "2024-01-25",
      time: "11:00 AM",
      guests: 5,
      price: 425,
      status: "pending",
    },
  ]

  const myListings: Tour[] = [
    {
      id: "T001",
      title: "Hidden Jazz Bars of New Orleans",
      status: "active",
      bookings: 45,
      revenue: 3825,
      rating: 4.9,
      reviews: 127,
    },
    {
      id: "T002",
      title: "Culinary Walking Tour",
      status: "active",
      bookings: 32,
      revenue: 2720,
      rating: 4.8,
      reviews: 89,
    },
    {
      id: "T003",
      title: "Architecture & History",
      status: "active",
      bookings: 28,
      revenue: 2380,
      rating: 5.0,
      reviews: 45,
    },
  ]

  const bookingsColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
    },
    {
      accessorKey: "tourTitle",
      header: "Tour",
    },
    {
      accessorKey: "tourist",
      header: "Tourist",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.getValue("date")).toLocaleDateString()
      },
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "guests",
      header: "Guests",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === "confirmed"
                ? "default"
                : status === "pending"
                  ? "secondary"
                  : status === "completed"
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBooking({
                    ...booking,
                    location: "New Orleans, LA",
                    meetingPoint: "Jackson Square, 700 Decatur St",
                    guidePhone: "+1 (555) 123-4567",
                    confirmationNumber: booking.id,
                  } as any)
                  setIsDetailsModalOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Contact tourist</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancel booking</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const pendingColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Request ID",
    },
    {
      accessorKey: "tourTitle",
      header: "Tour",
    },
    {
      accessorKey: "tourist",
      header: "Tourist",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.getValue("date")).toLocaleDateString()
      },
    },
    {
      accessorKey: "guests",
      header: "Guests",
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
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button size="sm" className="h-8">
              <Check className="mr-1 h-3 w-3" />
              Accept
            </Button>
            <Button size="sm" variant="outline" className="h-8 bg-transparent">
              <X className="mr-1 h-3 w-3" />
              Decline
            </Button>
          </div>
        )
      },
    },
  ]

  const toursColumns: ColumnDef<Tour>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Tour Title",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : status === "inactive" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "bookings",
      header: "Bookings",
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("revenue"))
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
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {row.getValue("rating")} ({row.original.reviews})
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tour = row.original
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
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View tour
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit tour
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete tour</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-in fade-in slide-in-from-top-4" style={{ animationDuration: "300ms" }}>
            <h1 className="text-3xl font-bold text-foreground">Guide Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your tours and bookings</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Earnings"
              value={`$${stats.totalEarnings.toLocaleString()}`}
              description={`+$${stats.thisMonth} this month`}
              icon={DollarSign}
              trend={{ value: 12.5, isPositive: true }}
              index={0}
            />
            <StatCard
              title="Upcoming Tours"
              value={stats.upcomingTours}
              description="Next 30 days"
              icon={CalendarDays}
              index={1}
            />
            <StatCard
              title="Average Rating"
              value={stats.averageRating}
              description={`From ${stats.totalReviews} reviews`}
              icon={Star}
              trend={{ value: 2.3, isPositive: true }}
              index={2}
            />
            <StatCard
              title="Active Tours"
              value={stats.totalTours}
              description="Published listings"
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
                </TabsList>
                <Link href="/dashboard/listings/new">
                  <Button>Create New Tour</Button>
                </Link>
              </div>

              <TabsContent value="upcoming">
                <DataTable
                  columns={bookingsColumns}
                  data={upcomingBookings}
                  searchKey="tourist"
                  searchPlaceholder="Search by tourist name..."
                />
              </TabsContent>

              <TabsContent value="pending">
                <DataTable
                  columns={pendingColumns}
                  data={pendingRequests}
                  searchKey="tourist"
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
                id: Number.parseInt(selectedBooking.id.replace("BK", "")),
                tourTitle: selectedBooking.tourTitle,
                guide: "You (Guide)",
                date: selectedBooking.date,
                time: selectedBooking.time,
                guests: selectedBooking.guests,
                price: selectedBooking.price,
                status: selectedBooking.status,
                location: (selectedBooking as any).location,
                meetingPoint: (selectedBooking as any).meetingPoint,
                guidePhone: (selectedBooking as any).guidePhone,
                confirmationNumber: (selectedBooking as any).confirmationNumber,
              }
            : undefined
        }
      />
    </div>
  )
}
