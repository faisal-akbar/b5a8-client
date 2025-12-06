import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { getPayments } from "@/services/payment/payment.service"
import { PaymentsClient } from "@/components/payments/payments-client"
import type { GuidePayment } from "@/types/guide"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    filter?: string
  }>
}

export default async function PaymentsPage({ searchParams }: PageProps) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams
  
  // Get pagination and filter from URL
  const page = parseInt(params.page || "1", 10)
  const limit = parseInt(params.limit || "10", 10)
  const filter = (params.filter as "all" | "PENDING" | "COMPLETED" | "RELEASED") || "all"

  try {
    // Fetch all payments for totals calculation and filtering
    // Note: If the API supports status filtering, we should pass it to getPayments instead
    const [paymentsResult, allPaymentsResult] = await Promise.all([
      // Fetch paginated payments for the table
      getPayments({ page, limit }),
      // Fetch all payments for totals calculation (limit 1000 should cover most cases)
      getPayments({ page: 1, limit: 1000 }),
    ])

    // Process paginated payments
    // Payment service returns: { success: true, data: { data: [...payments], meta: {...} } }
    const paginatedPayments: GuidePayment[] =
      paymentsResult.success && paymentsResult.data
        ? (Array.isArray(paymentsResult.data)
            ? paymentsResult.data
            : (Array.isArray(paymentsResult.data.data)
                ? paymentsResult.data.data
                : []))
        : []

    // Process all payments for totals and filtering
    const allPayments: GuidePayment[] =
      allPaymentsResult.success && allPaymentsResult.data
        ? (Array.isArray(allPaymentsResult.data)
            ? allPaymentsResult.data
            : (Array.isArray(allPaymentsResult.data.data)
                ? allPaymentsResult.data.data
                : []))
        : []

    const paymentsMeta = paymentsResult.success && paymentsResult.data
      ? (Array.isArray(paymentsResult.data)
          ? {}
          : (paymentsResult.data.meta || {}))
      : {}

    // Debug logging - check server console
    console.log("[SERVER] Payments pagination:", {
      searchParams: params,
      page,
      limit,
      filter,
      paymentsResultSuccess: paymentsResult.success,
      paymentsDataStructure: paymentsResult.data ? (Array.isArray(paymentsResult.data) ? "array" : "object") : "null",
      paginatedPaymentsCount: paginatedPayments.length,
      allPaymentsCount: allPayments.length,
      paymentsMeta,
      firstPayment: paginatedPayments[0]?.id,
    })

    // Filter payments by status if filter is not "all"
    const filteredPayments = filter === "all" 
      ? allPayments 
      : allPayments.filter((p) => p.status === filter)

    // Apply pagination to filtered results (if filtering, we need to paginate the filtered list)
    let finalPayments: GuidePayment[]
    let paymentsTotal: number
    let paymentsTotalPages: number

    if (filter === "all") {
      // Use API pagination when no filter
      finalPayments = paginatedPayments
      paymentsTotal = paymentsMeta.total ?? allPayments.length
      paymentsTotalPages = paymentsMeta.totalPages ?? Math.max(1, Math.ceil(paymentsTotal / limit))
    } else {
      // Client-side pagination when filtering
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      finalPayments = filteredPayments.slice(startIndex, endIndex)
      paymentsTotal = filteredPayments.length
      paymentsTotalPages = Math.max(1, Math.ceil(paymentsTotal / limit))
    }

    // Calculate summary totals from ALL payments (not filtered, not paginated)
    // These totals should always reflect the complete picture
    const totalReadyToRelease = allPayments
      .filter((p) => 
        p.status === "COMPLETED" && 
        p.booking?.status === "COMPLETED"
      )
      .reduce((sum, p) => sum + p.amount, 0)

    const totalReleased = allPayments
      .filter((p) => p.status === "RELEASED")
      .reduce((sum, p) => sum + p.amount, 0)

    const totalEarnings = allPayments
      .filter((p) => p.status === "COMPLETED" || p.status === "RELEASED")
      .reduce((sum, p) => sum + p.amount, 0)

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

            <PaymentsClient
              key={`${page}-${limit}-${filter}`}
              initialPayments={finalPayments}
              initialPage={page}
              initialLimit={limit}
              initialTotal={paymentsTotal}
              initialTotalPages={paymentsTotalPages}
              initialFilter={filter}
              initialTotalReadyToRelease={totalReadyToRelease}
              initialTotalReleased={totalReleased}
              initialTotalEarnings={totalEarnings}
            />
          </div>
        </main>
        
      </div>
    )
  } catch (error) {
    console.error("Error fetching payments data:", error)
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
    
      </div>
    )
  }
}


