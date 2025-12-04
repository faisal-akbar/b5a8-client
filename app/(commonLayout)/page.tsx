import { HeroSection } from "@/components/sections/hero-section"
import { SearchSection } from "@/components/sections/search-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { DestinationsSection } from "@/components/sections/destinations-section"
import { GuidesSection } from "@/components/sections/guides-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <SearchSection />
        <CategoriesSection />
        <DestinationsSection />
        <GuidesSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
    </div>
  )
}

