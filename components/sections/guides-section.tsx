import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function GuidesSection() {
    const guides = [
        {
            name: "Sophie Chen",
            location: "Paris, France",
            rating: 4.9,
            reviews: 127,
            tours: 24,
            image: "/asian-woman-smiling-guide.jpg",
        },
        {
            name: "Marco Rossi",
            location: "Rome, Italy",
            rating: 5.0,
            reviews: 89,
            tours: 18,
            image: "/italian-man-tour-guide.jpg",
        },
        {
            name: "Elena Garcia",
            location: "Barcelona, Spain",
            rating: 4.8,
            reviews: 156,
            tours: 31,
            image: "/spanish-woman-guide.jpg",
        },
        {
            name: "Yuki Tanaka",
            location: "Tokyo, Japan",
            rating: 4.9,
            reviews: 203,
            tours: 27,
            image: "/japanese-woman-guide.jpg",
        },
    ]

    return (
        <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Meet Our Top-Rated Guides
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">Experienced locals ready to show you around</p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {guides.map((guide) => (
                        <Link key={guide.name} href={`/profile/${guide.name.toLowerCase().replace(" ", "-")}`}>
                            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                                <CardContent className="p-6">
                                    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-background shadow-lg">
                                        <img
                                            src={guide.image || "/placeholder.svg"}
                                            alt={guide.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <Badge className="absolute bottom-0 right-0 bg-primary px-2 py-0.5 text-sm shadow-sm">
                                            <Star className="mr-1 h-3 w-3 fill-primary-foreground" />
                                            {guide.rating}
                                        </Badge>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                            {guide.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{guide.location}</p>
                                        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
                                            <span className="bg-muted px-2 py-1 rounded-full">{guide.reviews} reviews</span>
                                            <span className="bg-muted px-2 py-1 rounded-full">{guide.tours} tours</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
