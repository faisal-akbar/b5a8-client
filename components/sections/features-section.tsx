import { Card, CardContent } from "@/components/ui/card"
import { Shield, Award, Heart, TrendingUp } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            icon: Shield,
            title: "Verified Guides",
            description: "All guides are carefully vetted and verified for your safety and peace of mind.",
        },
        {
            icon: Award,
            title: "Best Price Guarantee",
            description: "Direct connection with guides means better prices without middleman fees.",
        },
        {
            icon: Heart,
            title: "Personalized Experiences",
            description: "Custom tours tailored to your interests, pace, and travel style.",
        },
        {
            icon: TrendingUp,
            title: "24/7 Support",
            description: "Our dedicated team is always here to help you before, during, and after your tour.",
        },
    ]

    return (
        <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose LocalGuide</h2>
                    <p className="mt-4 text-lg text-muted-foreground">The best platform for authentic travel experiences</p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <Card key={feature.title} className="border-0 bg-muted/30 transition-all hover:bg-muted/50 hover:translate-y-[-2px]">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-transform hover:scale-110">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
