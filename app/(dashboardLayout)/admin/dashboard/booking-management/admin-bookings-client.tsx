"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { updateBookingStatus } from "@/services/booking/booking.service";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  MoreHorizontal,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface AdminBookingsClientProps {
  initialData: {
    bookings: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    stats: {
      total: number;
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
    };
    currentPage: number;
    currentLimit: number;
    statusFilter: string;
  };
}

export function AdminBookingsClient({ initialData }: AdminBookingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [bookingToUpdate, setBookingToUpdate] = useState<{
    id: string;
    currentStatus: string;
    newStatus: string;
  } | null>(null);

  const { bookings, meta, stats, currentPage, currentLimit, statusFilter } =
    initialData;

  const updatePagination = useCallback(
    (page: number, limit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      router.push(`/admin/dashboard/booking-management?${params.toString()}`);
      router.refresh();
    },
    [router, searchParams]
  );

  const updateStatusFilter = useCallback(
    (status: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (status !== "all") {
        params.set("status", status);
      } else {
        params.delete("status");
      }
      params.set("page", "1");
      router.push(`/admin/dashboard/booking-management?${params.toString()}`);
      router.refresh();
    },
    [router, searchParams]
  );

  const handleUpdateStatus = async () => {
    if (!bookingToUpdate) return;

    try {
      const result = await updateBookingStatus({
        id: bookingToUpdate.id,
        status: bookingToUpdate.newStatus as
          | "PENDING"
          | "CONFIRMED"
          | "COMPLETED"
          | "CANCELLED",
      });
      if (result.success) {
        toast.success(
          `Booking status updated to ${bookingToUpdate.newStatus} successfully`
        );
        setIsStatusDialogOpen(false);
        setBookingToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update booking status");
      }
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "PENDING":
        return "secondary";
      case "COMPLETED":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<any>[] = [
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
      header: "Booking Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return (
          <div>
            <div className="font-medium">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "numberOfGuests",
      header: "Guests",
      cell: ({ row }) => {
        const guests = row.getValue("numberOfGuests") as number;
        return <div className="font-medium">{guests || 0}</div>;
      },
    },
    {
      id: "tourist",
      header: "Tourist",
      cell: ({ row }) => {
        const tourist = row.original.tourist;
        return (
          <div>
            <div className="font-medium">{tourist?.user?.name || "N/A"}</div>
            <div className="text-xs text-muted-foreground">
              {tourist?.user?.email || ""}
            </div>
          </div>
        );
      },
    },
    {
      id: "guide",
      header: "Guide",
      cell: ({ row }) => {
        const guide = row.original.guide;
        return (
          <div>
            <div className="font-medium">{guide?.user?.name || "N/A"}</div>
            <div className="text-xs text-muted-foreground">
              {guide?.user?.email || ""}
            </div>
          </div>
        );
      },
    },
    {
      id: "listing",
      header: "Tour",
      cell: ({ row }) => {
        const listing = row.original.listing;
        return (
          <div className="max-w-[200px]">
            <div className="truncate font-medium">
              {listing?.title || "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">
              {listing?.city || ""}
            </div>
            {listing?.tourFee && (
              <div className="text-xs text-muted-foreground">
                ${listing.tourFee}/person
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "payment",
      header: "Payment",
      cell: ({ row }) => {
        const payment = row.original.payment;
        if (!payment) {
          return <span className="text-muted-foreground">No payment</span>;
        }
        const amount = payment.amount;
        const paymentStatus = payment.status;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount / 100); // Amount is in cents
        return (
          <div>
            <div className="font-medium">{formatted}</div>
            <Badge
              variant={
                paymentStatus === "PAID"
                  ? "default"
                  : paymentStatus === "UNPAID"
                  ? "secondary"
                  : "destructive"
              }
              className="text-xs mt-1"
            >
              {paymentStatus}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return (
          <div className="text-sm">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        const currentStatus = booking.status;

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
              {booking.listing?.id && (
                <DropdownMenuItem asChild>
                  <Link href={`/tours/${booking.listing.id}`}>
                    <User className="mr-2 h-4 w-4" />
                    View Tour
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {currentStatus !== "CONFIRMED" && (
                <DropdownMenuItem
                  onClick={() => {
                    setBookingToUpdate({
                      id: booking.id,
                      currentStatus,
                      newStatus: "CONFIRMED",
                    });
                    setIsStatusDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Confirm Booking
                </DropdownMenuItem>
              )}
              {currentStatus !== "COMPLETED" &&
                currentStatus !== "CANCELLED" && (
                  <DropdownMenuItem
                    onClick={() => {
                      setBookingToUpdate({
                        id: booking.id,
                        currentStatus,
                        newStatus: "COMPLETED",
                      });
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                    Mark as Completed
                  </DropdownMenuItem>
                )}
              {currentStatus !== "CANCELLED" &&
                currentStatus !== "COMPLETED" && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setBookingToUpdate({
                        id: booking.id,
                        currentStatus,
                        newStatus: "CANCELLED",
                      });
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Use stats from server
  const totalBookings = stats.total;
  const pendingBookings = stats.pending;
  const confirmedBookings = stats.confirmed;
  const completedBookings = stats.completed;
  const cancelledBookings = stats.cancelled;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div
            className="mb-8 animate-in fade-in slide-in-from-top-4"
            style={{ animationDuration: "300ms" }}
          >
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Bookings Management
                </h1>
                <p className="mt-2 text-muted-foreground">
                  View and manage all platform bookings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={updateStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  All time bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Bookings
                </CardTitle>
                <Activity className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Confirmed Bookings
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{confirmedBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Confirmed bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Bookings
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedBookings}</div>
                <p className="text-xs text-muted-foreground">Completed tours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cancelled Bookings
                </CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cancelledBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Cancelled bookings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={bookings}
                searchKey="id"
                searchPlaceholder="Search bookings by ID..."
                disablePagination={true}
                initialColumnVisibility={{
                  id: false,
                  createdAt: false,
                }}
              />

              {/* Pagination */}
              {bookings.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * currentLimit + 1} to{" "}
                      {Math.min(currentPage * currentLimit, meta.total)} of{" "}
                      {meta.total} bookings
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
                            { length: meta.totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => (
                            <SelectItem key={pageNum} value={`${pageNum}`}>
                              {pageNum}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">
                        of {meta.totalPages}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">Rows per page</p>
                      <Select
                        value={`${currentLimit}`}
                        onValueChange={(value) => {
                          updatePagination(1, Number(value));
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={currentLimit} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the booking status from{" "}
              <strong>{bookingToUpdate?.currentStatus}</strong> to{" "}
              <strong>{bookingToUpdate?.newStatus}</strong>? This action will
              update the booking status.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
