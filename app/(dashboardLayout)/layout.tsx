import React from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const dynamic = "force-dynamic"

const CommonDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/10">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default CommonDashboardLayout

