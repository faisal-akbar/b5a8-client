"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DataTable } from "@/components/data-table"
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
import { MoreHorizontal, Eye, Edit, Ban, Trash, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

type User = {
  id: string
  name: string
  email: string
  role: "tourist" | "guide" | "admin"
  status: "active" | "suspended" | "pending"
  joinedDate: string
  lastActive: string
  bookings?: number
  tours?: number
  revenue?: number
}

export default function AdminUsersPage() {
  const users: User[] = [
    {
      id: "U001",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "guide",
      status: "active",
      joinedDate: "2023-06-15",
      lastActive: "2024-01-14",
      tours: 12,
      revenue: 15420,
    },
    {
      id: "U002",
      name: "Michael Brown",
      email: "michael.b@email.com",
      role: "tourist",
      status: "active",
      joinedDate: "2023-08-20",
      lastActive: "2024-01-13",
      bookings: 8,
    },
    {
      id: "U003",
      name: "Emma Wilson",
      email: "emma.w@email.com",
      role: "guide",
      status: "pending",
      joinedDate: "2024-01-10",
      lastActive: "2024-01-14",
      tours: 0,
    },
    {
      id: "U004",
      name: "David Lee",
      email: "david.l@email.com",
      role: "tourist",
      status: "suspended",
      joinedDate: "2023-05-03",
      lastActive: "2023-12-28",
      bookings: 15,
    },
    {
      id: "U005",
      name: "Sophie Chen",
      email: "sophie.c@email.com",
      role: "guide",
      status: "active",
      joinedDate: "2023-07-12",
      lastActive: "2024-01-14",
      tours: 8,
      revenue: 9680,
    },
  ]

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "User ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return <Badge variant={role === "admin" ? "default" : role === "guide" ? "secondary" : "outline"}>{role}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : status === "suspended" ? "destructive" : "secondary"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "joinedDate",
      header: "Joined",
      cell: ({ row }) => {
        return new Date(row.getValue("joinedDate")).toLocaleDateString()
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => {
        return new Date(row.getValue("lastActive")).toLocaleDateString()
      },
    },
    {
      id: "activity",
      header: "Activity",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="text-sm">
            {user.role === "guide" ? (
              <div>
                <div>{user.tours} tours</div>
                <div className="text-muted-foreground">${user.revenue?.toLocaleString()}</div>
              </div>
            ) : (
              <div>{user.bookings} bookings</div>
            )}
          </div>
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
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Ban className="mr-2 h-4 w-4" />
                Suspend user
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

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
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="mt-2 text-muted-foreground">View and manage all platform users</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <DataTable columns={columns} data={users} searchKey="name" searchPlaceholder="Search users..." />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
