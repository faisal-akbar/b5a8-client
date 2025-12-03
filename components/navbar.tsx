"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLoggedIn = false
  const userRole = "tourist"

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
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            ) : userRole === "tourist" ? (
              <>
                <Link href="/explore">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Explore Tours
                  </Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="ghost" size="sm" className="font-medium">
                    My Bookings
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="font-medium">
                  Logout
                </Button>
              </>
            ) : userRole === "guide" ? (
              <>
                <Link href="/explore">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Explore Tours
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="font-medium">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Admin Dashboard
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/listings">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Manage Listings
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="font-medium">
                  Logout
                </Button>
              </>
            )}
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
                  <Link href="/explore">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Explore Tours
                    </Button>
                  </Link>
                  <Link href="/become-guide">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Become a Guide
                    </Button>
                  </Link>
                  <div className="mt-2 flex flex-col gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="w-full font-medium">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="w-full font-medium">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </>
              ) : userRole === "tourist" ? (
                <>
                  <Link href="/explore">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Explore Tours
                    </Button>
                  </Link>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      My Bookings
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                    Logout
                  </Button>
                </>
              ) : userRole === "guide" ? (
                <>
                  <Link href="/explore">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Explore Tours
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/admin/listings">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Manage Listings
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start font-medium">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
