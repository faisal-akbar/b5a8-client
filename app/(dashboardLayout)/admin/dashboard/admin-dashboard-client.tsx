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
  CalendarDays,
  DollarSign,
  MapPin,
  Percent,
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

  // Extract stats safely
  const totalUsers = stats.overview?.totalUsers || stats.users?.totalUsers || 0;
  const totalGuides = stats.guides?.totalGuides || 0;
  const totalTourists = stats.tourists?.totalTourists || 0;
  const totalListings = stats.listings?.totalListings || 0;
  const totalBookings = stats.bookings?.totalBookings || 0;
  const totalRevenue = stats.revenue?.totalRevenue || 0;
  const totalProfit = stats.revenue?.totalProfit || 0;
  const platformFee = stats.revenue?.platformFeePercentage || 10;

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
          <div
            className="mb-8 animate-in fade-in slide-in-from-top-4"
            style={{ animationDuration: "300ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Platform overview and management
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Users"
              value={totalUsers.toLocaleString()}
              description={`${totalGuides.toLocaleString()} guides • ${totalTourists.toLocaleString()} tourists`}
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
              value={stats.guides?.activeGuides?.toLocaleString() || "0"}
              description="Currently active guides"
              icon={Activity}
              index={5}
            />
            <StatCard
              title="Active Tourists"
              value={stats.tourists?.activeTourists?.toLocaleString() || "0"}
              description="Currently active tourists"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage all platform users, view profiles, and handle
                  user-related actions
                </p>
                <Link href="/admin/dashboard/users-management">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Listings Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Review and moderate all tour listings, activate or deactivate
                  listings
                </p>
                <Link href="/admin/dashboard/listings-management">
                  <Button className="w-full">Manage Listings</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Bookings Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View all bookings, track booking status, and manage
                  booking-related issues
                </p>
                <Link href="/admin/dashboard/booking-management">
                  <Button className="w-full">Manage Bookings</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Listings</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
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
