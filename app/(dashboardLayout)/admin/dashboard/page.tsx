"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatCard } from "@/components/stat-card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  Eye,
  Edit,
  Trash,
  MoreHorizontal,
  Check,
  X,
  Ban,
} from "lucide-react"
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

type User = {
  id: string
  name: string
  email: string
  role: "tourist" | "guide" | "admin" | "super_admin"
  status: "active" | "suspended" | "pending"
  joinedDate: string
  bookings?: number
  tours?: number
}

type Tour = {
  id: string
  title: string
  guide: string
  category: string
  price: number
  bookings: number
  status: "active" | "inactive" | "pending" | "flagged"
  rating: number
}

type Verification = {
  id: string
  guideName: string
  email: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  documents: number
}

export default function AdminDashboardPage() {
  const stats = {
    totalUsers: 12847,
    totalGuides: 3421,
    totalTourists: 9426,
    totalTours: 8934,
    totalBookings: 15623,
    totalRevenue: 1847320,
    pendingVerifications: 23,
    reportedIssues: 8,
  }

  const users: User[] = [
    {
      id: "U001",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "guide",
      status: "active",
      joinedDate: "2023-06-15",
      tours: 12,
    },
    {
      id: "U002",
      name: "Michael Brown",
      email: "michael.b@email.com",
      role: "tourist",
      status: "active",
      joinedDate: "2023-08-20",
      bookings: 8,
    },
    {
      id: "U003",
      name: "Emma Wilson",
      email: "emma.w@email.com",
      role: "guide",
      status: "pending",
      joinedDate: "2024-01-10",
      tours: 0,
    },
    {
      id: "U004",
      name: "David Lee",
      email: "david.l@email.com",
      role: "tourist",
      status: "suspended",
      joinedDate: "2023-05-03",
      bookings: 15,
    },
  ]

  const tours: Tour[] = [
    {
      id: "T001",
      title: "Hidden Jazz Bars of New Orleans",
      guide: "Marcus Thompson",
      category: "Nightlife",
      price: 85,
      bookings: 127,
      status: "active",
      rating: 4.9,
    },
    {
      id: "T002",
      title: "Tokyo Street Food Adventure",
      guide: "Yuki Tanaka",
      category: "Food",
      price: 120,
      bookings: 98,
      status: "active",
      rating: 5.0,
    },
    {
      id: "T003",
      title: "Paris Architecture Walk",
      guide: "Sophie Chen",
      category: "History",
      price: 95,
      bookings: 45,
      status: "pending",
      rating: 4.7,
    },
    {
      id: "T004",
      title: "Suspicious Tour Activity",
      guide: "Unknown User",
      category: "Other",
      price: 999,
      bookings: 2,
      status: "flagged",
      rating: 2.1,
    },
  ]

  const verifications: Verification[] = [
    {
      id: "V001",
      guideName: "Elena Garcia",
      email: "elena.g@email.com",
      submittedDate: "2024-01-12",
      status: "pending",
      documents: 3,
    },
    {
      id: "V002",
      guideName: "Marco Rossi",
      email: "marco.r@email.com",
      submittedDate: "2024-01-11",
      status: "pending",
      documents: 4,
    },
    {
      id: "V003",
      guideName: "Ahmed Al Maktoum",
      email: "ahmed.a@email.com",
      submittedDate: "2024-01-10",
      status: "pending",
      documents: 3,
    },
  ]

  const usersColumns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
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
      id: "activity",
      header: "Activity",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="text-sm text-muted-foreground">
            {user.role === "guide" ? `${user.tours} tours` : `${user.bookings} bookings`}
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
      accessorKey: "guide",
      header: "Guide",
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
      accessorKey: "rating",
      header: "Rating",
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

  const verificationsColumns: ColumnDef<Verification>[] = [
    {
      accessorKey: "id",
      header: "Request ID",
    },
    {
      accessorKey: "guideName",
      header: "Guide Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "submittedDate",
      header: "Submitted",
      cell: ({ row }) => {
        return new Date(row.getValue("submittedDate")).toLocaleDateString()
      },
    },
    {
      accessorKey: "documents",
      header: "Documents",
      cell: ({ row }) => {
        return <div>{row.getValue("documents")} files</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "secondary"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button size="sm" className="h-8">
              <Check className="mr-1 h-3 w-3" />
              Approve
            </Button>
            <Button size="sm" variant="outline" className="h-8 bg-transparent">
              <Eye className="mr-1 h-3 w-3" />
              Review
            </Button>
            <Button size="sm" variant="destructive" className="h-8">
              <X className="mr-1 h-3 w-3" />
              Reject
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Platform overview and management</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              description={`${stats.totalGuides.toLocaleString()} guides • ${stats.totalTourists.toLocaleString()} tourists`}
              icon={Users}
              trend={{ value: 8.2, isPositive: true }}
              index={0}
            />
            <StatCard
              title="Total Tours"
              value={stats.totalTours.toLocaleString()}
              description="Active listings"
              icon={MapPin}
              trend={{ value: 12.5, isPositive: true }}
              index={1}
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
              description="All time"
              icon={TrendingUp}
              trend={{ value: 15.3, isPositive: true }}
              index={2}
            />
            <StatCard
              title="Platform Revenue"
              value={`$${(stats.totalRevenue / 1000000).toFixed(2)}M`}
              description="Total earnings"
              icon={DollarSign}
              trend={{ value: 23.1, isPositive: true }}
              index={3}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Pending Verifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{stats.pendingVerifications}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Guide verification requests waiting for review</p>
                  <Button className="mt-4">Review Verifications</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="border-2 border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Reported Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{stats.reportedIssues}</p>
                  <p className="mt-2 text-sm text-muted-foreground">User reports and complaints requiring attention</p>
                  <Button variant="destructive" className="mt-4">
                    Handle Reports
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }}>
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="tours">Tours</TabsTrigger>
                <TabsTrigger value="verifications">
                  Verifications
                  {verifications.length > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {verifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <DataTable columns={usersColumns} data={users} searchKey="name" searchPlaceholder="Search users..." />
              </TabsContent>

              <TabsContent value="tours">
                <DataTable columns={toursColumns} data={tours} searchKey="title" searchPlaceholder="Search tours..." />
              </TabsContent>

              <TabsContent value="verifications">
                <DataTable
                  columns={verificationsColumns}
                  data={verifications}
                  searchKey="guideName"
                  searchPlaceholder="Search by guide name..."
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
