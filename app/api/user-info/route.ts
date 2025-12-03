import { NextResponse } from "next/server"
import { getUserInfo } from "@/services/auth/getUserInfo"

export async function GET() {
  try {
    const userInfo = await getUserInfo()
    
    // If userInfo has a role, user is logged in
    if (userInfo?.role && userInfo.role !== null) {
      // Ensure role is uppercase for consistency
      const normalizedRole = typeof userInfo.role === 'string' ? userInfo.role.toUpperCase() : userInfo.role
      
      return NextResponse.json({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: normalizedRole,
        needPasswordChange: userInfo.needPasswordChange,
      })
    }
    
    // User is not logged in
    return NextResponse.json({ role: null })
  } catch (error) {
    console.error("API /user-info error:", error)
    // User is not logged in or error occurred
    return NextResponse.json({ role: null })
  }
}

