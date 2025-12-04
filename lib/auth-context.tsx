"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getUserInfo, UserInfo } from "@/services/auth/getUserInfo"

interface AuthContextType {
  user: UserInfo | null
  isLoading: boolean
  refreshUser: () => Promise<void>
  clearUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const userInfo = await getUserInfo()
      // Only set user if role exists and is not null
      if (userInfo?.role && userInfo.role !== null && userInfo.role !== undefined) {
        setUser(userInfo)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth context fetchUser error:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  const clearUser = () => {
    setUser(null)
  }

  useEffect(() => {
    // Fetch user info on mount
    fetchUser()

    // Listen for custom events that might be triggered after login/logout
    const handleUserLoggedIn = () => {
      fetchUser()
    }

    const handleUserLoggedOut = () => {
      clearUser()
    }

    window.addEventListener("user-logged-in", handleUserLoggedIn)
    window.addEventListener("user-logged-out", handleUserLoggedOut)

    return () => {
      window.removeEventListener("user-logged-in", handleUserLoggedIn)
      window.removeEventListener("user-logged-out", handleUserLoggedOut)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

