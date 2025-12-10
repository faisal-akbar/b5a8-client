import { Suspense } from "react"
import { AdminUsersClient } from "./admin-users-client"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { getAllUsers } from "@/services/user/user.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    role?: string
  }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || "1", 10)
  const limit = parseInt(params.limit || "10", 10)
  const roleFilter = params.role || "all"

  try {
    // Fetch users data
    const usersResult = await getAllUsers({ page, limit })

    let users = []
    let meta = { total: 0, page: 1, limit: 10, totalPages: 0 }

    if (usersResult.success && usersResult.data) {
      users = usersResult.data.data || []
      meta = usersResult.data.meta || meta
      
      // Apply role filter if needed
      if (roleFilter !== "all") {
        users = users.filter((user: any) => user.role === roleFilter.toUpperCase())
      }
    }

    const initialData = {
      users,
      meta,
      currentPage: page,
      currentLimit: limit,
      roleFilter,
    }

    return (
      <Suspense fallback={
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 bg-muted/30 py-8">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <DashboardSkeleton />
            </div>
          </main>
        </div>
      }>
        <AdminUsersClient initialData={initialData} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error fetching users data:", error)
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    )
  }
}
