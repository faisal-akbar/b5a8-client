import { Award, Globe, Sparkles, TrendingUp, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-24 lg:py-32">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(66,99,235,0.12),transparent_50%)]" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
      
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Enhanced trust badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-background/80 px-5 py-2 text-sm font-medium shadow-lg backdrop-blur-md ring-1 ring-primary/10 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Trusted by <span className="font-bold text-primary">50,000+</span> travelers worldwide
            </span>
          </div>
          
          {/* Enhanced heading with better typography */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl lg:leading-tight animate-fade-in-up delay-100">
            Discover Authentic
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Experiences
              </span>
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </span>
            <br />
            <span className="text-foreground/90">with Local Experts</span>
          </h1>
          
          {/* Enhanced description */}
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed lg:text-xl animate-fade-in-up delay-200">
            Connect with passionate local guides who know the hidden gems of their city. Explore destinations like a
            local, not a tourist.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:bg-muted hover:scale-105">
              <Users className="h-4 w-4 text-primary" />
              <span>Expert Guides</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:bg-muted hover:scale-105">
              <Award className="h-4 w-4 text-primary" />
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:bg-muted hover:scale-105">
              <Globe className="h-4 w-4 text-primary" />
              <span>Global Destinations</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:bg-muted hover:scale-105">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
