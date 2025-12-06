"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { logoutUser } from "@/services/auth/logoutUser"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, clearUser, refreshUser } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Handle loggedIn query parameter for immediate refresh after login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const loggedIn = urlParams.get('loggedIn')
    if (loggedIn === 'true') {
      // Trigger refresh and remove query parameter
      refreshUser()
      router.replace(window.location.pathname)
    }
  }, [refreshUser, router])

  const handleLogout = async () => {
    try {
      await logoutUser()
      clearUser()
      setIsMenuOpen(false)
      // Router will handle redirect from logoutUser
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear context state even if logout fails
      clearUser()
      setIsMenuOpen(false)
      router.push("/login")
    }
  }

  // Normalize role - handle any case variations
  // SUPER_ADMIN is treated as ADMIN for navigation purposes
  const getNormalizedRole = (role: string | undefined | null): "TOURIST" | "GUIDE" | "ADMIN" | null => {
    if (!role) return null
    const upperRole = String(role).toUpperCase()
    if (upperRole === "TOURIST") return "TOURIST"
    if (upperRole === "GUIDE") return "GUIDE"
    if (upperRole === "ADMIN" || upperRole === "SUPER_ADMIN") return "ADMIN"
    return null
  }

  const normalizedRole = getNormalizedRole(user?.role)
  const isLoggedIn = !!normalizedRole

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href
    return (
      <Link href={href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="sm"
          className={cn("font-medium transition-all", isActive && "bg-secondary text-secondary-foreground")}
        >
          {children}
        </Button>
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 h-16 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="mx-auto h-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
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
                <NavLink href="/explore">Explore Tours</NavLink>
                <NavLink href="/become-guide">Become a Guide</NavLink>
                <div className="ml-2 flex items-center gap-2">
                  <NavLink href="/login">Login</NavLink>
                  <Link href="/register">
                    <Button size="sm" className="font-medium shadow-sm">
                      Register
                    </Button>
                  </Link>
                </div>
              </>
            ) : normalizedRole === "TOURIST" ? (
              <>
                <NavLink href="/explore">Explore Tours</NavLink>
                <NavLink href="/tourist/dashboard">My Bookings</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                <Button variant="ghost" size="sm" className="font-medium" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : normalizedRole === "GUIDE" ? (
              <>
                <NavLink href="/explore">Explore Tours</NavLink>
                <NavLink href="/guide/dashboard">Dashboard</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                <Button variant="ghost" size="sm" className="font-medium" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : normalizedRole === "ADMIN" ? (
              <>
                <NavLink href="/admin/dashboard">Admin Dashboard</NavLink>
                <NavLink href="/admin/dashboard/users-management">Manage Users</NavLink>
                <NavLink href="/admin/dashboard/listings-management">Manage Listings</NavLink>
                <NavLink href="/profile">Profile</NavLink>
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
          <div className="absolute left-0 right-0 top-16 border-t bg-background/95 backdrop-blur-md py-4 shadow-lg md:hidden animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-2 px-4">
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
                  <Link href="/tourist/dashboard" onClick={() => setIsMenuOpen(false)}>
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

