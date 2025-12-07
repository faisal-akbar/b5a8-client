import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Image Gallery Skeleton */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-2 sm:grid-cols-4">
            <Skeleton className="h-[400px] rounded-lg sm:col-span-2 sm:row-span-2" />
            <Skeleton className="h-[196px] rounded-lg" />
            <Skeleton className="h-[196px] rounded-lg" />
            <Skeleton className="h-[196px] rounded-lg" />
            <Skeleton className="h-[196px] rounded-lg" />
          </div>
        </section>

        {/* Main Content Skeleton */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>

              {/* Quick Info */}
              <div className="flex gap-6 border-y border-border py-6">
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
              </div>

              {/* Guide Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-48" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div className="space-y-6">
                <Skeleton className="h-8 w-32" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:w-96">
              <Card className="border-2">
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
