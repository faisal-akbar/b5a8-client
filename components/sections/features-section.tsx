import { Card, CardContent } from "@/components/ui/card"
import { Award, Check, Heart, Shield, Sparkles, TrendingUp } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            icon: Shield,
            title: "Verified Guides",
            description: "All guides are carefully vetted and verified for your safety and peace of mind.",
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
            badge: "Trusted"
        },
        {
            icon: Award,
            title: "Best Price Guarantee",
            description: "Direct connection with guides means better prices without middleman fees.",
            gradient: "from-amber-500 to-orange-500",
            bgGradient: "from-amber-500/10 to-orange-500/10",
            badge: "Value"
        },
        {
            icon: Heart,
            title: "Personalized Experiences",
            description: "Custom tours tailored to your interests, pace, and travel style.",
            gradient: "from-pink-500 to-rose-500",
            bgGradient: "from-pink-500/10 to-rose-500/10",
            badge: "Custom"
        },
        {
            icon: TrendingUp,
            title: "24/7 Support",
            description: "Our dedicated team is always here to help you before, during, and after your tour.",
            gradient: "from-purple-500 to-indigo-500",
            bgGradient: "from-purple-500/10 to-indigo-500/10",
            badge: "Always On"
        },
    ]

    return (
        <section className="relative overflow-hidden py-16 lg:py-24">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
            
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span>Premium Features</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Why Choose LocalGuide
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        The best platform for authentic travel experiences
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card 
                            key={feature.title} 
                            className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2"
                        >
                            {/* Gradient background overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                            
                            {/* Animated accent gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-tr ${feature.gradient} opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-20`} />
                            
                            <CardContent className="relative p-6 text-center">
                                {/* Floating badge */}
                                <div className="absolute -top-3 right-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-top-3">
                                    <div className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${feature.gradient} px-3 py-1 text-xs font-bold text-white shadow-lg`}>
                                        <Check className="h-3 w-3" />
                                        <span>{feature.badge}</span>
                                    </div>
                                </div>
                                
                                {/* Icon container with enhanced effects */}
                                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                                    {/* Animated glow ring */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-xl transition-all duration-500 group-hover:opacity-75 group-hover:scale-125`} />
                                    
                                    {/* Main icon container */}
                                    <div className={`relative flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${feature.bgGradient} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                        <feature.icon className={`h-10 w-10 text-primary transition-all duration-500 group-hover:scale-110`} />
                                    </div>
                                    
                                    {/* Animated ring effect */}
                                    <div className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-br ${feature.gradient} opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-30`} />
                                </div>
                                
                                <h3 className="font-bold text-lg text-foreground transition-colors duration-300 group-hover:text-primary">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                                    {feature.description}
                                </p>
                                
                                {/* Animated bottom line */}
                                <div className={`mx-auto mt-4 h-1 w-0 rounded-full bg-gradient-to-r ${feature.gradient} transition-all duration-500 group-hover:w-16`} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
