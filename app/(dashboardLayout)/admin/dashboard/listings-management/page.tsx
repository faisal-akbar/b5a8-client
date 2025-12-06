"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Ban, Trash, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

type Tour = {
  id: string
  title: string
  guide: string
  guideEmail: string
  category: string
  price: number
  bookings: number
  revenue: number
  status: "active" | "inactive" | "pending" | "flagged"
  rating: number
  reviews: number
  createdDate: string
}

export default function AdminListingsPage() {
  const tours: Tour[] = [
    {
      id: "T001",
      title: "Hidden Jazz Bars of New Orleans",
      guide: "Marcus Thompson",
      guideEmail: "marcus.t@email.com",
      category: "Nightlife",
      price: 85,
      bookings: 127,
      revenue: 10795,
      status: "active",
      rating: 4.9,
      reviews: 89,
      createdDate: "2023-05-10",
    },
    {
      id: "T002",
      title: "Tokyo Street Food Adventure",
      guide: "Yuki Tanaka",
      guideEmail: "yuki.t@email.com",
      category: "Food",
      price: 120,
      bookings: 98,
      revenue: 11760,
      status: "active",
      rating: 5.0,
      reviews: 67,
      createdDate: "2023-06-15",
    },
    {
      id: "T003",
      title: "Paris Architecture Walk",
      guide: "Sophie Chen",
      guideEmail: "sophie.c@email.com",
      category: "History",
      price: 95,
      bookings: 45,
      revenue: 4275,
      status: "pending",
      rating: 4.7,
      reviews: 23,
      createdDate: "2024-01-05",
    },
    {
      id: "T004",
      title: "Suspicious Tour Activity",
      guide: "Unknown User",
      guideEmail: "unknown@email.com",
      category: "Other",
      price: 999,
      bookings: 2,
      revenue: 1998,
      status: "flagged",
      rating: 2.1,
      reviews: 2,
      createdDate: "2024-01-12",
    },
  ]

  const columns: ColumnDef<Tour>[] = [
    {
      accessorKey: "id",
      header: "Tour ID",
    },
    {
      accessorKey: "title",
      header: "Tour Title",
      cell: ({ row }) => {
        return <div className="max-w-[200px] truncate font-medium">{row.getValue("title")}</div>
      },
    },
    {
      accessorKey: "guide",
      header: "Guide",
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.getValue("guide")}</div>
            <div className="text-xs text-muted-foreground">{row.original.guideEmail}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "flagged"
                  ? "destructive"
                  : status === "pending"
                    ? "secondary"
                    : "outline"
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
              <DropdownMenuItem>
                <Ban className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Link href="/admin">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Tour Listings Management</h1>
              <p className="mt-2 text-muted-foreground">Review and moderate all tour listings</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <DataTable columns={columns} data={tours} searchKey="title" searchPlaceholder="Search tours..." />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
