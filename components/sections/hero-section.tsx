import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(66,99,235,0.08),transparent_50%)]" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Trusted by 50,000+ travelers worldwide</span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-tight animate-fade-in-up delay-100">
            Discover Authentic Experiences
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              with Local Experts
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed animate-fade-in-up delay-200">
            Connect with passionate local guides who know the hidden gems of their city. Explore destinations like a
            local, not a tourist.
          </p>
        </div>
      </div>
    </section>
  )
}
