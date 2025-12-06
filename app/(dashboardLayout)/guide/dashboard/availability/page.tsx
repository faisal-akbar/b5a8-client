import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { getMyAvailabilities } from "@/services/availability/availability.service"
import { getMyListings } from "@/services/listing/listing.service"
import { AvailabilityClient } from "@/components/availability/availability-client"
import type { GuideAvailability, GuideListing } from "@/types/guide"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
  }>
}

export default async function AvailabilityPage({ searchParams }: PageProps) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams
  
  // Get pagination from URL
  const page = parseInt(params.page || "1", 10)
  const limit = parseInt(params.limit || "10", 10)

  try {
    // Fetch initial data on the server with pagination
    const [availabilitiesResult, listingsResult] = await Promise.all([
      getMyAvailabilities({ page, limit }),
      getMyListings({ page: 1, limit: 100 }),
    ])

    // Process availabilities with pagination metadata
    const availabilities: GuideAvailability[] =
      availabilitiesResult.success && availabilitiesResult.data
        ? (Array.isArray(availabilitiesResult.data.data)
            ? availabilitiesResult.data.data
            : [])
        : []

    const availabilitiesMeta = availabilitiesResult.success && availabilitiesResult.data
      ? availabilitiesResult.data.meta || {}
      : {}

    // Calculate total and totalPages from meta, with fallback
    const availabilitiesTotal = availabilitiesMeta.total ?? availabilities.length
    const availabilitiesTotalPages = availabilitiesMeta.totalPages ?? Math.max(1, Math.ceil(availabilitiesTotal / limit))
    
    // Debug logging - check server console
    console.log("[SERVER] Availability pagination:", {
      searchParams: params,
      page,
      limit,
      total: availabilitiesTotal,
      totalPages: availabilitiesTotalPages,
      availabilitiesCount: availabilities.length,
      meta: availabilitiesMeta,
      firstAvailability: availabilities[0]?.id,
      lastAvailability: availabilities[availabilities.length - 1]?.id,
    })

    // Process listings
    const listings: GuideListing[] =
      listingsResult.success && listingsResult.data
        ? (Array.isArray(listingsResult.data.data) ? listingsResult.data.data : [])
        : []

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
              <h1 className="text-3xl font-bold text-foreground">Manage Availability</h1>
              <p className="mt-2 text-muted-foreground">Set your available dates and times for bookings</p>
            </div>

            <AvailabilityClient
              key={`${page}-${limit}`}
              initialAvailabilities={availabilities}
              initialListings={listings}
              initialPage={page}
              initialLimit={limit}
              initialTotal={availabilitiesTotal}
              initialTotalPages={availabilitiesTotalPages}
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error fetching availability data:", error)
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
}
