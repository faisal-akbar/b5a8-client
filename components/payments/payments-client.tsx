"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { PaymentsTable } from "./payments-table"
import { PaymentReleaseDialog } from "./payment-release-dialog"
import type { GuidePayment } from "@/types/guide"

interface PaymentsClientProps {
  initialPayments: GuidePayment[]
  initialPage: number
  initialLimit: number
  initialTotal: number
  initialTotalPages: number
  initialFilter?: "all" | "PENDING" | "COMPLETED" | "RELEASED"
  initialTotalReadyToRelease?: number
  initialTotalReleased?: number
  initialTotalEarnings?: number
}

export function PaymentsClient({
  initialPayments,
  initialPage,
  initialLimit,
  initialTotal,
  initialTotalPages,
  initialFilter = "all",
  initialTotalReadyToRelease = 0,
  initialTotalReleased = 0,
  initialTotalEarnings = 0,
}: PaymentsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get pagination and filter from URL or initial props
  const currentPage = parseInt(searchParams.get("page") || initialPage.toString(), 10)
  const currentLimit = parseInt(searchParams.get("limit") || initialLimit.toString(), 10)
  const currentFilter = (searchParams.get("filter") as "all" | "PENDING" | "COMPLETED" | "RELEASED") || initialFilter
  
  const [payments, setPayments] = useState<GuidePayment[]>(initialPayments)
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false)
  const [paymentToRelease, setPaymentToRelease] = useState<GuidePayment | null>(null)

  // Sync state when initial data changes (e.g., after server refresh)
  useEffect(() => {
    setPayments(initialPayments)
  }, [initialPayments])

  // Update URL with pagination and filter params
  const updateParams = useCallback((page: number, limit: number, filter?: string) => {
    const params = new URLSearchParams()
    params.set("page", page.toString())
    params.set("limit", limit.toString())
    if (filter) {
      params.set("filter", filter)
    } else if (currentFilter !== "all") {
      params.set("filter", currentFilter)
    }
    
    const newUrl = `/guide/dashboard/payments?${params.toString()}`
    
    // Use push to update URL - Next.js will automatically re-render server component
    router.push(newUrl, { scroll: false })
  }, [router, currentFilter])

  const handlePageChange = useCallback((page: number) => {
    updateParams(page, currentLimit)
  }, [currentLimit, updateParams])

  const handleLimitChange = useCallback((limit: number) => {
    updateParams(1, limit) // Reset to page 1 when limit changes
  }, [updateParams])

  const handleFilterChange = useCallback((filter: "all" | "PENDING" | "COMPLETED" | "RELEASED") => {
    updateParams(1, currentLimit, filter) // Reset to page 1 when filter changes
  }, [currentLimit, updateParams])

  const handleRefresh = () => {
    router.refresh()
  }

  const handleRelease = (payment: GuidePayment) => {
    setPaymentToRelease(payment)
    setIsReleaseDialogOpen(true)
  }

  // Use totals from server (calculated from all payments)
  const totalReadyToRelease = initialTotalReadyToRelease
  const totalReleased = initialTotalReleased
  const totalEarnings = initialTotalEarnings

  return (
    <>
      <div className="grid gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Release</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalReadyToRelease)}
            </div>
            <p className="text-xs text-muted-foreground">Tours completed, ready to release</p>
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
              }).format(totalEarnings)}
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
                variant={currentFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
              >
                All
              </Button>
              <Button
                variant={currentFilter === "PENDING" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("PENDING")}
              >
                Pending
              </Button>
              <Button
                variant={currentFilter === "COMPLETED" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("COMPLETED")}
              >
                Completed
              </Button>
              <Button
                variant={currentFilter === "RELEASED" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("RELEASED")}
              >
                Released
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payments found</h3>
              <p className="text-muted-foreground">
                {currentFilter === "all" 
                  ? "You don't have any payments yet"
                  : `No ${currentFilter.toLowerCase()} payments found`}
              </p>
            </div>
          ) : (
            <PaymentsTable
              payments={payments}
              currentPage={currentPage}
              totalPages={initialTotalPages}
              total={initialTotal}
              limit={currentLimit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              onRelease={handleRelease}
            />
          )}
        </CardContent>
      </Card>

      <PaymentReleaseDialog
        isOpen={isReleaseDialogOpen}
        onOpenChange={setIsReleaseDialogOpen}
        payment={paymentToRelease}
        onSuccess={handleRefresh}
      />
    </>
  )
}

