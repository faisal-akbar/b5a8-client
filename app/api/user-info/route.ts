import { NextResponse } from "next/server"
import { getUserInfo } from "@/services/auth/getUserInfo"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const userInfo = await getUserInfo()
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API /user-info - getUserInfo result:', { 
        hasRole: !!userInfo?.role, 
        role: userInfo?.role,
        hasId: !!userInfo?.id 
      })
    }
    
    // If userInfo has a role, user is logged in
    if (userInfo?.role && userInfo.role !== null && userInfo.role !== undefined) {
      // Ensure role is uppercase for consistency
      const normalizedRole = typeof userInfo.role === 'string' ? userInfo.role.toUpperCase() : userInfo.role
      
      return NextResponse.json({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: normalizedRole,
        needPasswordChange: userInfo.needPasswordChange,
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }
    
    // User is not logged in
    return NextResponse.json({ role: null }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("API /user-info error:", error)
    // User is not logged in or error occurred
    return NextResponse.json({ role: null }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

