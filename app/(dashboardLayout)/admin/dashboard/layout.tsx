import React from "react"
import { getUserInfo } from "@/services/auth/getUserInfo"
import { hasAdminAccess } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

const AdminDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // Check for cookies first to avoid unnecessary API calls
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  // If no tokens at all, redirect to login immediately
  if (!accessToken && !refreshToken) {
    redirect("/login?redirect=/admin/dashboard")
  }

  // Try to get user info - if this fails, we'll handle it gracefully
  let userInfo
  let userRole: string | undefined | null = null
  let authError = false

  try {
    userInfo = await getUserInfo()
    userRole = userInfo?.role
  } catch (error) {
    // If there's an error getting user info, mark it but don't redirect yet
    console.error("Admin dashboard layout error:", error)
    authError = true
  }

  // If we successfully got user info and have a role
  if (!authError && userRole && userRole !== null && userRole !== "" && String(userRole).trim() !== "") {
    // Normalize role to uppercase
    const normalizedRole = String(userRole).toUpperCase()

    // Check if user has admin access (ADMIN or SUPER_ADMIN)
    if (hasAdminAccess(normalizedRole as any)) {
      // User has admin access, render the dashboard
      return (
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      )
    } else {
      // User is logged in but doesn't have admin access, redirect to their dashboard
      if (normalizedRole === "GUIDE") {
        redirect("/guide/dashboard")
      } else if (normalizedRole === "TOURIST") {
        redirect("/tourist/dashboard")
      } else {
        // Fallback to home if role is unknown
        redirect("/")
      }
    }
  }

  // If we get here, either:
  // 1. No tokens (already handled above)
  // 2. Auth error or no role - redirect to login
  // Only redirect if we don't have tokens to prevent loops
  if (!accessToken && !refreshToken) {
    redirect("/login?redirect=/admin/dashboard")
  }

  // If we have tokens but can't get user info, there might be a backend issue
  // Show an error or redirect to login - but be careful not to create a loop
  // For now, let's redirect to login but the login page won't redirect back
  redirect("/login?redirect=/admin/dashboard")
}

export default AdminDashboardLayout

