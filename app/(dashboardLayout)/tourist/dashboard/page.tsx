"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatCard } from "@/components/stat-card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Heart, Star, MessageCircle, MoreHorizontal, Eye } from "lucide-react"
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

type Booking = {
  id: string
  tourTitle: string
  guide: string
  location: string
  date: string
  guests: number
  price: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  rating?: number
  reviewed?: boolean
}

export default function TouristDashboardPage() {
  const stats = {
    upcomingTrips: 3,
    completedTrips: 12,
    wishlist: 8,
    totalSpent: 4250,
  }

  const upcomingBookings: Booking[] = [
    {
      id: "BK001",
      tourTitle: "Tokyo Street Food Adventure",
      guide: "Yuki Tanaka",
      location: "Tokyo, Japan",
      date: "2024-01-20",
      guests: 2,
      price: 240,
      status: "confirmed",
    },
    {
      id: "BK002",
      tourTitle: "Paris Photography Walk",
      guide: "Sophie Chen",
      location: "Paris, France",
      date: "2024-02-05",
      guests: 1,
      price: 95,
      status: "confirmed",
    },
    {
      id: "BK003",
      tourTitle: "Ancient Rome History Tour",
      guide: "Marco Rossi",
      location: "Rome, Italy",
      date: "2024-02-15",
      guests: 3,
      price: 330,
      status: "confirmed",
    },
  ]

  const pendingBookings: Booking[] = [
    {
      id: "BK004",
      tourTitle: "Barcelona Tapas & Wine",
      guide: "Elena Garcia",
      location: "Barcelona, Spain",
      date: "2024-03-10",
      guests: 2,
      price: 180,
      status: "pending",
    },
  ]

  const pastBookings: Booking[] = [
    {
      id: "BK005",
      tourTitle: "Dubai Architecture Tour",
      guide: "Ahmed Al Maktoum",
      location: "Dubai, UAE",
      date: "2023-12-01",
      guests: 4,
      price: 600,
      status: "completed",
      rating: 5,
      reviewed: true,
    },
    {
      id: "BK006",
      tourTitle: "NYC Street Art Tour",
      guide: "Marcus Johnson",
      location: "New York, USA",
      date: "2023-11-15",
      guests: 2,
      price: 150,
      status: "completed",
      rating: 4.8,
      reviewed: false,
    },
  ]

  const upcomingColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
    },
    {
      accessorKey: "tourTitle",
      header: "Tour",
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.getValue("tourTitle")}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {row.original.location}
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
        return <Badge variant={status === "confirmed" ? "default" : "secondary"}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
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
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact guide
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Cancel booking</DropdownMenuItem>
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
    },
    {
      accessorKey: "tourTitle",
      header: "Tour",
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.getValue("tourTitle")}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {row.original.location}
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
            {rating}
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

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
                    <Badge className="ml-2" variant="secondary">
                      {upcomingBookings.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    {pendingBookings.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {pendingBookings.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="past">Past Trips</TabsTrigger>
                </TabsList>
                <Link href="/explore">
                  <Button>Discover More Tours</Button>
                </Link>
              </div>

              <TabsContent value="upcoming">
                <DataTable
                  columns={upcomingColumns}
                  data={upcomingBookings}
                  searchKey="tourTitle"
                  searchPlaceholder="Search tours..."
                />
              </TabsContent>

              <TabsContent value="pending">
                <DataTable
                  columns={upcomingColumns}
                  data={pendingBookings}
                  searchKey="tourTitle"
                  searchPlaceholder="Search tours..."
                />
              </TabsContent>

              <TabsContent value="past">
                <DataTable
                  columns={pastColumns}
                  data={pastBookings}
                  searchKey="tourTitle"
                  searchPlaceholder="Search tours..."
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
