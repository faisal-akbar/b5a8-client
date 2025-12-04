import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            location: "USA",
            rating: 5,
            comment:
                "Marco showed us hidden spots in Rome we never would have found on our own. Absolutely incredible experience!",
            tour: "Hidden Rome Food Tour",
            image: "/woman-traveler.png",
        },
        {
            name: "David Chen",
            location: "Singapore",
            rating: 5,
            comment:
                "Sophie made Paris magical! Her photography tips and local insights were invaluable. Highly recommend!",
            tour: "Paris Photography Walk",
            image: "/asian-man-traveler.jpg",
        },
        {
            name: "Emma Wilson",
            location: "UK",
            rating: 5,
            comment:
                "Yuki took us to the best local restaurants in Tokyo. This was the highlight of our entire trip!",
            tour: "Tokyo Night Food Adventure",
            image: "/british-woman-traveler.jpg",
        },
    ]

    return (
        <section className="bg-muted/30 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Travelers Say</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Real experiences from real travelers</p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="h-full transition-shadow hover:shadow-md">
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="flex gap-1 text-primary mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-primary" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground leading-relaxed italic flex-grow">"{testimonial.comment}"</p>
                                <div className="mt-8 flex items-center gap-4 pt-6 border-t">
                                    <img
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                                    />
                                    <div>
                                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground font-medium text-right">Tour: {testimonial.tour}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
