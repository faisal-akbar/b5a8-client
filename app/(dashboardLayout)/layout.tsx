import React from "react"

export const dynamic = "force-dynamic"

const CommonDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default CommonDashboardLayout

