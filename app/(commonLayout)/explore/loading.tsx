export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Header Skeleton */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-12 lg:py-16">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          </div>
          
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="h-12 w-64 animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted" />
              <div className="h-6 w-96 animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted" style={{ animationDelay: '0.1s' }} />
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="h-12 flex-1 animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted" style={{ animationDelay: '0.2s' }} />
              <div className="h-12 w-32 animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </section>
        
        {/* Content Skeleton */}
        <section className="py-12">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Sidebar Skeleton */}
              <aside className="w-full space-y-6 lg:w-80 lg:shrink-0">
                <div className="h-96 animate-pulse rounded-xl bg-gradient-to-br from-muted via-muted/50 to-muted shadow-lg" />
              </aside>
              
              {/* Cards Skeleton */}
              <div className="flex-1">
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 animate-pulse rounded-xl bg-gradient-to-r from-muted via-muted/50 to-muted shadow-lg"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
