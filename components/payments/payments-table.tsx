"use client"

import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GuidePayment } from "@/types/guide"
import type { ColumnDef } from "@tanstack/react-table"
import { PaymentsPagination } from "./payments-pagination"

interface PaymentsTableProps {
  payments: GuidePayment[]
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onRelease: (payment: GuidePayment) => void
}

export function PaymentsTable({
  payments,
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  onRelease,
}: PaymentsTableProps) {
  const columns: ColumnDef<GuidePayment>[] = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string
        return <span className="font-mono text-sm">{id.slice(0, 8)}</span>
      },
    },
    {
      accessorKey: "booking.listing.title",
      header: "Tour",
      cell: ({ row }) => {
        return row.original.booking?.listing?.title || "N/A"
      },
      filterFn: (row, id, value) => {
        const title = row.original.booking?.listing?.title || ""
        return title.toLowerCase().includes(value.toLowerCase())
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
        const amount = Number.parseFloat(row.getValue("amount") as string)
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Payment Status",
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
      id: "bookingStatus",
      header: "Tour Status",
      cell: ({ row }) => {
        const bookingStatus = row.original.booking?.status || "PENDING"
        return (
          <Badge
            variant={
              bookingStatus === "COMPLETED"
                ? "default"
                : bookingStatus === "CONFIRMED"
                  ? "outline"
                  : bookingStatus === "PENDING"
                    ? "secondary"
                    : "destructive"
            }
          >
            {bookingStatus}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string
        if (!dateStr) return "N/A"
        try {
          const date = new Date(dateStr)
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        } catch {
          return dateStr
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original
        // Guide can only release payment if:
        // 1. Payment status is COMPLETED (tourist has paid)
        // 2. Booking status is COMPLETED (tour has been completed)
        const bookingStatus = payment.booking?.status || "PENDING"
        const paymentStatus = payment.status
        const canRelease = 
          paymentStatus === "COMPLETED" && 
          bookingStatus === "COMPLETED" &&
          payment.status !== "RELEASED"
        
        return (
          <div className="flex gap-2">
            {canRelease ? (
              <Button
                size="sm"
                onClick={() => onRelease(payment)}
              >
                Release Payment
              </Button>
            ) : bookingStatus !== "COMPLETED" ? (
              <span className="text-sm text-muted-foreground">Complete tour first</span>
            ) : paymentStatus !== "COMPLETED" ? (
              <span className="text-sm text-muted-foreground">Payment pending</span>
            ) : payment.status === "RELEASED" ? (
              <Badge variant="default">Released</Badge>
            ) : null}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={payments}
        searchKey="booking.listing.title"
        searchPlaceholder="Search by tour..."
        disablePagination={true}
      />
      {payments.length > 0 && (
        <PaymentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  )
}

