"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { logoutUser } from "@/services/auth/logoutUser"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface UserInfo {
  id?: string
  name?: string
  email?: string
  role?: "ADMIN" | "GUIDE" | "TOURIST" | string
  needPasswordChange?: boolean
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user-info", { 
        cache: "no-store",
        credentials: "include", // Ensure cookies are sent
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Only set user info if role exists and is not null
        if (data.role && data.role !== null && data.role !== undefined) {
          setUserInfo(data)
        } else {
          setUserInfo(null)
        }
      } else {
        setUserInfo(null)
      }
    } catch (error) {
      // User is not logged in
      console.error("Navbar fetchUserInfo error:", error)
      setUserInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch user info on mount
    fetchUserInfo()
    
    // Refresh on window focus (e.g., when user returns to tab after login in another tab)
    const handleFocus = () => {
      fetchUserInfo()
    }
    
    // Refresh on route change (when user navigates)
    const handleRouteChange = () => {
      fetchUserInfo()
    }
    
    window.addEventListener("focus", handleFocus)
    window.addEventListener("popstate", handleRouteChange)
    
    // Also listen for custom events that might be triggered after login
    window.addEventListener("user-logged-in", handleRouteChange)
    window.addEventListener("user-logged-out", handleRouteChange)
    
    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("popstate", handleRouteChange)
      window.removeEventListener("user-logged-in", handleRouteChange)
      window.removeEventListener("user-logged-out", handleRouteChange)
    }
  }, [])

  // Refresh user info when pathname changes (e.g., after login redirect)
  useEffect(() => {
    // Small delay to ensure cookies are set after redirect
    const timer = setTimeout(() => {
      fetchUserInfo()
    }, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  // Refresh when loggedIn query parameter is present (after successful login)
  useEffect(() => {
    const loggedIn = searchParams.get('loggedIn')
    if (loggedIn === 'true') {
      // Delay to ensure cookies are set
      const timer = setTimeout(() => {
        fetchUserInfo()
        // Remove the query parameter from URL without reload
        router.replace(pathname)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [searchParams, pathname, router])

  // Also refresh when the page becomes visible (handles tab switching after login)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUserInfo()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      setUserInfo(null)
      setIsMenuOpen(false)
      // Router will handle redirect from logoutUser
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear local state even if logout fails
      setUserInfo(null)
      setIsMenuOpen(false)
      router.push("/login")
    }
  }

  // Normalize role - handle any case variations
  const getNormalizedRole = (role: string | undefined | null): "TOURIST" | "GUIDE" | "ADMIN" | null => {
    if (!role) return null
    const upperRole = String(role).toUpperCase()
    if (upperRole === "TOURIST") return "TOURIST"
    if (upperRole === "GUIDE") return "GUIDE"
    if (upperRole === "ADMIN") return "ADMIN"
    return null
  }
  
  const normalizedRole = getNormalizedRole(userInfo?.role)
  const isLoggedIn = !!normalizedRole

  return (
    <nav className="sticky top-0 z-50 h-16 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <MapPin className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">LocalGuide</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {!isLoggedIn ? (
              <>
                <Link href="/explore">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Explore Tours
                  </Button>
                </Link>
                <Link href="/become-guide">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Become a Guide
                  </Button>
                </Link>
                <div className="ml-2 flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="font-medium shadow-sm">
                      Register
                    </Button>
                  </Link>
                </div>
              </>
            ) : normalizedRole === "TOURIST" ? (
              <>
                <Link href="/explore">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Explore Tours
                  </Button>
                </Link>
                <Link href="/tourist/dashboard/bookings">
                  <Button variant="ghost" size="sm" className="font-medium">
                    My Bookings
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="font-medium" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : normalizedRole === "GUIDE" ? (
              <>
                <Link href="/explore">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Explore Tours
                  </Button>
                </Link>
                <Link href="/guide/dashboard">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="font-medium" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : normalizedRole === "ADMIN" ? (
              <>
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Admin Dashboard
                  </Button>
                </Link>
                <Link href="/admin/dashboard/users-management">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/dashboard/listings-management">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Manage Listings
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="font-medium" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : null}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-16 border-t bg-background/95 backdrop-blur-md py-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-2">
              {!isLoggedIn ? (
                <>
                  <Link href="/explore" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Explore Tours
                    </Button>
                  </Link>
                  <Link href="/become-guide" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Become a Guide
                    </Button>
                  </Link>
                  <div className="mt-2 flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full font-medium">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full font-medium">
                        Register
                      </Button>
                    </Link>
                  </div>
                </>
              ) : normalizedRole === "TOURIST" ? (
                <>
                  <Link href="/explore" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Explore Tours
                    </Button>
                  </Link>
                  <Link href="/tourist/dashboard/bookings" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      My Bookings
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start font-medium" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : normalizedRole === "GUIDE" ? (
                <>
                  <Link href="/explore" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Explore Tours
                    </Button>
                  </Link>
                  <Link href="/guide/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start font-medium" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : normalizedRole === "ADMIN" ? (
                <>
                  <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin/dashboard/users-management" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/admin/dashboard/listings-management" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Manage Listings
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start font-medium" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
