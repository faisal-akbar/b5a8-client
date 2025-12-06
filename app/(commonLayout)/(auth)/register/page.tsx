import { redirect } from "next/navigation"
import { getUserInfo } from "@/services/auth/getUserInfo"
import { getDefaultDashboardRoute } from "@/lib/auth-utils"
import RegisterForm from "@/components/auth/register-form"

export const dynamic = "force-dynamic"

const RegisterPage = async () => {
  // Check if user is already logged in
  const userInfo = await getUserInfo()
  
  if (userInfo?.role && userInfo.role !== null) {
    // User is already logged in, redirect to their dashboard
    const role = userInfo.role.toUpperCase() as "ADMIN" | "GUIDE" | "TOURIST"
    redirect(getDefaultDashboardRoute(role))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-12">
        <RegisterForm />
      </main>
    </div>
  )
}

export default RegisterPage
