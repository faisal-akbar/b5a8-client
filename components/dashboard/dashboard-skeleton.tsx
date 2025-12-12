import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="relative space-y-8 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-80 bg-gradient-to-r from-muted via-muted/50 to-muted" />
        <Skeleton className="h-5 w-96 bg-gradient-to-r from-muted via-muted/50 to-muted" style={{ animationDelay: '0.1s' }} />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl" style={{ animationDelay: `${i * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-28 bg-gradient-to-r from-muted via-muted/50 to-muted" />
              <Skeleton className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-9 w-36 bg-gradient-to-r from-muted via-muted/50 to-muted" />
              <Skeleton className="h-3 w-44 bg-gradient-to-r from-muted via-muted/50 to-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table/Content Skeleton */}
      <Card className="overflow-hidden border-2 border-border/50 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <Skeleton className="h-7 w-56 bg-gradient-to-r from-muted via-muted/50 to-muted" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4" style={{ animationDelay: `${i * 0.05}s` }}>
                <Skeleton className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full bg-gradient-to-r from-muted via-muted/50 to-muted" />
                  <Skeleton className="h-3 w-3/4 bg-gradient-to-r from-muted via-muted/50 to-muted" />
                </div>
                <Skeleton className="h-9 w-24 rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-2 border-border/50 shadow-lg" style={{ animationDelay: `${i * 0.1}s` }}>
            <CardHeader className="border-b bg-muted/30">
              <Skeleton className="h-6 w-48 bg-gradient-to-r from-muted via-muted/50 to-muted" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted" style={{ animationDelay: `${j * 0.05}s` }} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
