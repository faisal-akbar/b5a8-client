"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { logoutUser } from "@/services/auth/logoutUser"
import { useRouter } from "next/navigation"

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

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user-info", { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        console.log("Navbar - User info fetched:", data) // Debug log
        // Only set user info if role exists and is not null
        if (data.role && data.role !== null) {
          setUserInfo(data)
        } else {
          setUserInfo(null)
        }
      } else {
        setUserInfo(null)
      }
    } catch (error) {
      // User is not logged in
      console.error("Navbar - Error fetching user info:", error) // Debug log
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
    
    window.addEventListener("focus", handleFocus)
    
    return () => {
      window.removeEventListener("focus", handleFocus)
    }
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

  const isLoggedIn = !!userInfo?.role && userInfo.role !== null
  
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

  // Debug log (remove in production)
  if (process.env.NODE_ENV === 'development' && userInfo) {
    console.log("Navbar Debug - User info:", userInfo, "Normalized role:", normalizedRole, "Is logged in:", isLoggedIn)
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
          <div className="border-t py-4 md:hidden">
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
