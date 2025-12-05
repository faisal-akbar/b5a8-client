"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { getPayments, releasePaymentToGuide } from "@/services/payment/payment.service"
import type { GuidePayment } from "@/types/guide"
import type { ColumnDef } from "@tanstack/react-table"

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [payments, setPayments] = useState<GuidePayment[]>([])
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false)
  const [paymentToRelease, setPaymentToRelease] = useState<string | null>(null)
  const [isReleasing, setIsReleasing] = useState(false)
  const [filter, setFilter] = useState<"all" | "PENDING" | "COMPLETED" | "RELEASED">("all")

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getPayments({ page: 1, limit: 100 })

      if (result.success && result.data) {
        setPayments(result.data.data || [])
      } else {
        toast.error("Failed to load payments")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("An error occurred while loading payments")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleReleasePayment = async () => {
    if (!paymentToRelease) return

    try {
      setIsReleasing(true)
      const result = await releasePaymentToGuide(paymentToRelease)

      if (result.success) {
        toast.success("Payment released successfully")
        setIsReleaseDialogOpen(false)
        setPaymentToRelease(null)
        fetchPayments()
      } else {
        toast.error(result.message || "Failed to release payment")
      }
    } catch (error) {
      console.error("Error releasing payment:", error)
      toast.error("An error occurred while releasing payment")
    } finally {
      setIsReleasing(false)
    }
  }

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true
    return payment.status === filter
  })

  const totalPending = payments
    .filter((p) => p.status === "PENDING" || p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalReleased = payments
    .filter((p) => p.status === "RELEASED")
    .reduce((sum, p) => sum + p.amount, 0)

  const columns: ColumnDef<GuidePayment>[] = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => {
        return <span className="font-mono text-sm">{row.getValue("id").slice(0, 8)}</span>
      },
    },
    {
      accessorKey: "booking.listing.title",
      header: "Tour",
      cell: ({ row }) => {
        return row.original.booking?.listing?.title || "N/A"
      },
    },
    {
      accessorKey: "booking.tourist.user.name",
      header: "Tourist",
      cell: ({ row }) => {
        return row.original.booking?.tourist?.user?.name || "N/A"
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
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
              status === "RELEASED"
                ? "default"
                : status === "COMPLETED"
                  ? "outline"
                  : status === "PENDING"
                    ? "secondary"
                    : "destructive"
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original
        const canRelease = payment.status === "COMPLETED" || payment.status === "PENDING"
        
        return (
          <div className="flex gap-2">
            {canRelease && (
              <Button
                size="sm"
                onClick={() => {
                  setPaymentToRelease(payment.id)
                  setIsReleaseDialogOpen(true)
                }}
              >
                Release
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/guide/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
            <p className="mt-2 text-muted-foreground">View and manage your payments</p>
          </div>

          <div className="grid gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalPending)}
                </div>
                <p className="text-xs text-muted-foreground">Available to release</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Released</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalReleased)}
                </div>
                <p className="text-xs text-muted-foreground">Already released</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalPending + totalReleased)}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payments</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "PENDING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("PENDING")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={filter === "COMPLETED" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("COMPLETED")}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={filter === "RELEASED" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("RELEASED")}
                  >
                    Released
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredPayments}
                searchKey="booking.listing.title"
                searchPlaceholder="Search by tour..."
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Release Payment Dialog */}
      <Dialog open={isReleaseDialogOpen} onOpenChange={setIsReleaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to release this payment? This action will transfer the funds to your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReleaseDialogOpen(false)} disabled={isReleasing}>
              Cancel
            </Button>
            <Button onClick={handleReleasePayment} disabled={isReleasing}>
              {isReleasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Releasing...
                </>
              ) : (
                "Release Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

