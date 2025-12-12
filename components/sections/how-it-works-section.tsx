import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Calendar, MapPin, Search, Sparkles } from "lucide-react"

export function HowItWorksSection() {
    const steps = [
        {
            icon: Search,
            title: "Find Your Guide",
            description: "Browse local guides and discover unique experiences in your destination.",
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-500/10 to-cyan-500/10"
        },
        {
            icon: Calendar,
            title: "Book Your Tour",
            description: "Choose your preferred date and time, then securely book your adventure.",
            color: "from-purple-500 to-pink-500",
            bgColor: "from-purple-500/10 to-pink-500/10"
        },
        {
            icon: MapPin,
            title: "Explore Together",
            description: "Meet your guide and embark on an unforgettable journey through local culture.",
            color: "from-orange-500 to-red-500",
            bgColor: "from-orange-500/10 to-red-500/10"
        },
    ]

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-24 lg:py-32">
            {/* Enhanced decorative background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
                <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span>Simple Process</span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mb-16 text-lg text-muted-foreground">
                        Get started in three simple steps
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <Card className="group h-full border-2 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50">
                                {/* Gradient background overlay on hover */}
                                <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${step.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                                
                                <CardContent className="relative p-8 text-center">
                                    {/* Enhanced step number badge */}
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-lg font-bold text-white shadow-xl ring-4 ring-background transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl`}>
                                            {index + 1}
                                            {/* Animated glow ring */}
                                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-0 blur-xl transition-all duration-500 group-hover:opacity-75 group-hover:scale-150`} />
                                        </div>
                                    </div>
                                    
                                    {/* Icon container with enhanced effects */}
                                    <div className="relative mb-6 mt-6">
                                        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.bgColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                            <step.icon className={`h-10 w-10 bg-gradient-to-br ${step.color} bg-clip-text text-transparent transition-transform duration-500 group-hover:scale-110`} style={{ WebkitTextFillColor: 'transparent' }} />
                                            <step.icon className={`absolute h-10 w-10 text-primary transition-transform duration-500 group-hover:scale-110`} />
                                        </div>
                                        
                                        {/* Animated ring effect */}
                                        <div className={`absolute inset-0 mx-auto h-20 w-20 rounded-2xl border-2 bg-gradient-to-br ${step.color} opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-30`} />
                                    </div>
                                    
                                    <h3 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                                        {step.description}
                                    </p>
                                    
                                    {/* Animated bottom indicator */}
                                    <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                                        <span>Step {index + 1}</span>
                                        {index < steps.length - 1 && (
                                            <ArrowRight className="h-3 w-3 animate-pulse" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enhanced connector line with animated dot */}
                            {index < steps.length - 1 && (
                                <div className="absolute left-full top-1/2 z-10 hidden h-0.5 w-8 -translate-y-1/2 md:block">
                                    <div className="h-full w-full bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50" />
                                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
