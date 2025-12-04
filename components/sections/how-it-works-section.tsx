import { Search, Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function HowItWorksSection() {
    const steps = [
        {
            icon: Search,
            title: "Find Your Guide",
            description: "Browse local guides and discover unique experiences in your destination.",
        },
        {
            icon: Calendar,
            title: "Book Your Tour",
            description: "Choose your preferred date and time, then securely book your adventure.",
        },
        {
            icon: MapPin,
            title: "Explore Together",
            description: "Meet your guide and embark on an unforgettable journey through local culture.",
        },
    ]

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-24">
            {/* Decorative background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mb-16 text-lg text-muted-foreground">
                        Get started in three simple steps
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <Card className="group h-full border-slate-200 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50">
                                <CardContent className="p-8 text-center">
                                    <div className="relative mb-6">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                                            <step.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="absolute left-full top-1/2 hidden h-0.5 w-8 -translate-y-1/2 bg-gradient-to-r from-primary/50 to-transparent md:block" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
