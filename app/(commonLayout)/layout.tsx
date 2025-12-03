import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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

