import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default CommonLayout

