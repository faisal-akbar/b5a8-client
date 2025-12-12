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
import {
    deleteListing,
    updateListing,
} from "@/services/listing/listing.service";
import type { ColumnDef } from "@tanstack/react-table";
import {
    Activity,
    ArrowLeft,
    CheckCircle,
    Eye,
    Map,
    MapPin,
    MoreHorizontal,
    Star,
    Trash2,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface AdminListingsClientProps {
  initialData: {
    listings: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    stats: {
      total: number;
      active: number;
      inactive: number;
    };
    currentPage: number;
    currentLimit: number;
    statusFilter: string;
    categoryFilter: string;
    distinctCategories: {
      category: string;
      listingsCount: number;
    }[];
  };
}

export function AdminListingsClient({ initialData }: AdminListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [listingToUpdate, setListingToUpdate] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const {
    listings,
    meta,
    stats,
    currentPage,
    currentLimit,
    statusFilter,
    categoryFilter,
    distinctCategories,
  } = initialData;

  //   console.log("listings", initialData);

  const updatePagination = useCallback(
    (page: number, limit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      router.push(`/admin/dashboard/listings-management?${params.toString()}`);
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
      router.push(`/admin/dashboard/listings-management?${params.toString()}`);
      router.refresh();
    },
    [router, searchParams]
  );

  const updateCategoryFilter = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category !== "all") {
        params.set("category", category);
      } else {
        params.delete("category");
      }
      params.set("page", "1");
      router.push(`/admin/dashboard/listings-management?${params.toString()}`);
      router.refresh();
    },
    [router, searchParams]
  );

  const handleActivateListing = async () => {
    if (!listingToUpdate) return;

    try {
      const result = await updateListing({
        id: listingToUpdate.id,
        isActive: true,
      });
      if (result.success) {
        toast.success(
          `Listing "${listingToUpdate.title}" has been activated successfully`
        );
        setIsActivateDialogOpen(false);
        setListingToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to activate listing");
      }
    } catch (error) {
      toast.error("Failed to activate listing");
    }
  };

  const handleDeactivateListing = async () => {
    if (!listingToUpdate) return;

    try {
      const result = await updateListing({
        id: listingToUpdate.id,
        isActive: false,
      });
      if (result.success) {
        toast.success(
          `Listing "${listingToUpdate.title}" has been deactivated successfully`
        );
        setIsDeactivateDialogOpen(false);
        setListingToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to deactivate listing");
      }
    } catch (error) {
      toast.error("Failed to deactivate listing");
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToUpdate) return;

    try {
      console.log("listingToUpdate", listingToUpdate);
      const result = await deleteListing(listingToUpdate.id);
      if (result.success) {
        toast.success(
          `Listing "${listingToUpdate.title}" has been deleted successfully`
        );
        setIsDeleteDialogOpen(false);
        setListingToUpdate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Listing ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>;
      },
    },
    {
      accessorKey: "title",
      header: "Tour Title",
      cell: ({ row }) => {
        return (
          <div className="max-w-[250px] truncate font-medium">
            {row.getValue("title")}
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("category")}</Badge>;
      },
    },
    {
      accessorKey: "city",
      header: "City",
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
      id: "bookings",
      header: "Bookings",
      cell: ({ row }) => {
        const bookingsCount =
          row.original._count?.bookings ?? row.original.bookingsCount ?? 0;
        return bookingsCount;
      },
    },
    {
      accessorKey: "averageRating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.original.averageRating;
        const reviews =
          row.original._count?.reviews ?? row.original.reviewsCount ?? 0;
        const hasValidRating =
          typeof rating === "number" &&
          !isNaN(rating) &&
          (rating > 0 || (rating === 0 && reviews > 0));
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {hasValidRating ? rating.toFixed(1) : "N/A"} ({reviews})
          </div>
        );
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const listing = row.original;
        const isActive = listing.isActive;

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
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isActive ? (
                <DropdownMenuItem
                  onClick={() => {
                    setListingToUpdate({
                      id: listing.id,
                      title: listing.title,
                    });
                    setIsDeactivateDialogOpen(true);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4 text-orange-600" />
                  Make Inactive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setListingToUpdate({
                      id: listing.id,
                      title: listing.title,
                    });
                    setIsActivateDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Make Active
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setListingToUpdate({ id: listing.id, title: listing.title });
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Use stats from server (calculated from all listings)
  const totalListings = stats.total;
  const activeListings = stats.active;
  const inactiveListings = stats.inactive;

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
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="mb-4 transition-all duration-300 hover:scale-105">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="gap-1.5 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">
                    <Map className="h-3.5 w-3.5" />
                    Listings Management
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Tour Listings
                </h1>
                <p className="text-lg text-muted-foreground">
                  Review and moderate all tour listings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={updateStatusFilter}>
                  <SelectTrigger className="w-[150px] border-2 border-border/50 transition-all duration-300 focus:border-primary/30">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={updateCategoryFilter}
                >
                  <SelectTrigger className="w-[150px] border-2 border-border/50 transition-all duration-300 focus:border-primary/30">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {distinctCategories.map((item: { category: string }) => (
                      <SelectItem key={item.category} value={item.category}>
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="border-2 border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Listings
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 ring-1 ring-purple-500/20">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalListings}</div>
                <p className="text-xs text-muted-foreground">
                  All tour listings
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Listings
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 ring-1 ring-green-500/20">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeListings}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inactive Listings
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 ring-1 ring-orange-500/20">
                  <XCircle className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveListings}</div>
                <p className="text-xs text-muted-foreground">
                  Currently inactive
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Listings Table */}
          <Card className="border-2 border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={listings}
                searchKey="title"
                searchPlaceholder="Search listings by title..."
                disablePagination={true}
                initialColumnVisibility={{
                  id: false,
                }}
              />

              {/* Pagination */}
              {listings.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * currentLimit + 1} to{" "}
                      {Math.min(currentPage * currentLimit, meta.total)} of{" "}
                      {meta.total} listings
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

      {/* Activate Listing Dialog */}
      <Dialog
        open={isActivateDialogOpen}
        onOpenChange={setIsActivateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to activate "{listingToUpdate?.title}"? This
              will make it visible to all users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleActivateListing}>Activate Listing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Listing Dialog */}
      <Dialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate "{listingToUpdate?.title}"?
              This will hide it from users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeactivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleDeactivateListing}>
              Deactivate Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Listing Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{listingToUpdate?.title}"? This
              action will delete all listing related data inlcuding bookings,
              reviews, etc. And this action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteListing}>
              Delete Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
