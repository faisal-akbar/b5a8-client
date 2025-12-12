"use client";

import { DashboardPagination } from "@/components/dashboard/dashboard-pagination";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  DollarSign,
  MapPin,
  Percent,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardClientProps {
  initialData: {
    stats: {
      overview: any;
      users: any;
      guides: any;
      tourists: any;
      listings: any;
      bookings: any;
      revenue: any;
      profit: any;
    };
    recentUsers: any[];
    recentListings: any[];
    recentBookings: any[];
    usersMeta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    listingsMeta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    bookingsMeta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    activeTab: string;
    currentPage: number;
    currentLimit: number;
    usersPage: number;
    usersLimit: number;
    listingsPage: number;
    listingsLimit: number;
    bookingsPage: number;
    bookingsLimit: number;
  };
}

export function AdminDashboardClient({
  initialData,
}: AdminDashboardClientProps) {
  const {
    stats,
    recentUsers,
    recentListings,
    recentBookings,
    usersMeta,
    listingsMeta,
    bookingsMeta,
  } = initialData;

  // Extract stats safely - prioritize overview stats, fallback to individual stats
  const totalUsers = stats.users?.totalUsers || 0;
  const totalGuides = stats.guides?.count || 0;
  const totalTourists = stats.tourists?.count || 0;
  const totalListings = stats.listings?.activeListings || 0;
  const totalBookings = stats.bookings?.totalBookings || 0;
  const totalRevenue = stats.revenue?.totalRevenue || 0;
  const totalProfit = stats.profit?.totalProfit || 0;
  const platformFee = stats.overview?.profit?.applicationFeePercentage || 10;

  const usersColumns: ColumnDef<any>[] = [
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
        const role = row.getValue("role") as string;
        return (
          <Badge
            variant={
              role === "ADMIN"
                ? "default"
                : role === "GUIDE"
                ? "secondary"
                : "outline"
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as string;
        return (
          <Badge variant={isActive === "ACTIVE" ? "default" : "destructive"}>
            {isActive === "ACTIVE" ? "Active" : "Blocked"}
          </Badge>
        );
      },
    },
  ];

  const listingsColumns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Tour Title",
      cell: ({ row }) => {
        return (
          <div className="max-w-[200px] truncate font-medium">
            {row.getValue("title")}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("category")}</Badge>;
      },
    },
    {
      accessorKey: "tourFee",
      header: "Price",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("tourFee"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
  ];

  const bookingsColumns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>;
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

          <div
            className="mb-8 animate-in fade-in slide-in-from-top-4"
            style={{ animationDuration: "300ms" }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    Admin
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Dashboard Overview
                </h1>
                <p className="text-lg text-muted-foreground">
                  Platform analytics and management
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Users"
              value={totalUsers.toLocaleString()}
              description={`Total active users`}
              icon={Users}
              index={0}
            />
            <StatCard
              title="Total Listings"
              value={totalListings.toLocaleString()}
              description="Active tour listings"
              icon={MapPin}
              index={1}
            />
            <StatCard
              title="Total Bookings"
              value={totalBookings.toLocaleString()}
              description="All time bookings"
              icon={CalendarDays}
              index={2}
            />
            <StatCard
              title="Platform Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              description="Total platform earnings"
              icon={DollarSign}
              index={3}
            />
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Platform Profit"
              value={`$${totalProfit.toLocaleString()}`}
              description={`${platformFee}% commission from bookings`}
              icon={Wallet}
              index={4}
            />
            <StatCard
              title="Active Guides"
              value={totalGuides.toLocaleString()}
              description="Active guides"
              icon={Activity}
              index={5}
            />
            <StatCard
              title="Active Tourists"
              value={totalTourists.toLocaleString()}
              description="Active tourists"
              icon={TrendingUp}
              index={6}
            />
            <StatCard
              title="Commission Rate"
              value={`${platformFee}%`}
              description="Platform fee per booking"
              icon={Percent}
              index={7}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="group relative overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 ring-1 ring-blue-500/20">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-bold">User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Manage all platform users, view profiles, and handle
                  user-related actions
                </p>
                <Link href="/admin/dashboard/users-management">
                  <Button className="group/btn w-full gap-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    Manage Users
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 ring-1 ring-purple-500/20">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-bold">Listings Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Review and moderate all tour listings, activate or deactivate
                  listings
                </p>
                <Link href="/admin/dashboard/listings-management">
                  <Button className="group/btn w-full gap-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    Manage Listings
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 ring-1 ring-green-500/20">
                    <CalendarDays className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-bold">Bookings Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  View all bookings, track booking status, and manage
                  booking-related issues
                </p>
                <Link href="/admin/dashboard/booking-management">
                  <Button className="group/btn w-full gap-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    Manage Bookings
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={usersColumns}
                  data={recentUsers}
                  searchKey="name"
                  searchPlaceholder="Search users..."
                  disablePagination={true}
                />
                <DashboardPagination
                  currentPage={usersMeta.page}
                  totalPages={usersMeta.totalPages}
                  total={usersMeta.total}
                  limit={usersMeta.limit}
                  paramPrefix="users"
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Recent Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={listingsColumns}
                  data={recentListings}
                  searchKey="title"
                  searchPlaceholder="Search listings..."
                  disablePagination={true}
                />
                <DashboardPagination
                  currentPage={listingsMeta.page}
                  totalPages={listingsMeta.totalPages}
                  total={listingsMeta.total}
                  limit={listingsMeta.limit}
                  paramPrefix="listings"
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={bookingsColumns}
                  data={recentBookings}
                  searchKey="id"
                  searchPlaceholder="Search bookings..."
                  disablePagination={true}
                />
                <DashboardPagination
                  currentPage={bookingsMeta.page}
                  totalPages={bookingsMeta.totalPages}
                  total={bookingsMeta.total}
                  limit={bookingsMeta.limit}
                  paramPrefix="bookings"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
