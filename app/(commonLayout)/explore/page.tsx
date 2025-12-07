import { Suspense } from "react"
import { getAllListings } from "@/services/listing/listing.service"
import { ExploreClient } from "./explore-client"
import type { Category } from "@/types/profile"

type SearchParams = Promise<{
  page?: string
  limit?: string
  searchTerm?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  language?: string
}>

/**
 * Server Component for Explore Tours Page
 * Handles data fetching and passes to client component for interactivity
 */
export default async function ExplorePage(props: { 
  searchParams: SearchParams 
}) {
  const searchParams = await props.searchParams
  
  // Parse and validate search parameters
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 12
  const searchTerm = searchParams.searchTerm || undefined
  const category = searchParams.category as Category | undefined
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const language = searchParams.language || undefined

  // Fetch listings with filters
  const result = await getAllListings({
    page,
    limit,
    city: searchTerm, // Use searchTerm for city filter in backend
    category,
    minPrice,
    maxPrice,
    language,
  })

  // Extract data and metadata
  const listings = result.success && result.data ? result.data.data || [] : []
  const meta = result.success && result.data ? result.data.meta : { page: 1, limit: 12, total: 0, totalPages: 0 }

  return (
    <Suspense fallback={<ExploreLoadingState />}>
      <ExploreClient 
        initialListings={listings}
        initialMeta={meta}
        initialFilters={{
          searchTerm,
          category,
          minPrice,
          maxPrice,
          language,
        }}
      />
    </Suspense>
  )
}

/**
 * Loading state component for Suspense fallback
 */
function ExploreLoadingState() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative border-b border-border bg-linear-to-r from-primary/10 via-primary/5 to-background py-12 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="h-12 w-64 animate-pulse rounded bg-muted" />
              <div className="mt-4 h-6 w-96 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="h-12 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-12 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              <aside className="w-full space-y-6 lg:w-80 lg:shrink-0">
                <div className="h-96 animate-pulse rounded bg-muted" />
              </aside>
              <div className="flex-1">
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 animate-pulse rounded bg-muted" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
