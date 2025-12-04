import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    Utensils,
    Landmark,
    Camera,
    ShoppingBag,
    Music,
    Compass,
    Users,
    Star,
} from "lucide-react"

export function CategoriesSection() {
    const categories = [
        { icon: Utensils, name: "Food & Dining", count: 234 },
        { icon: Landmark, name: "History & Culture", count: 189 },
        { icon: Camera, name: "Photography", count: 156 },
        { icon: ShoppingBag, name: "Shopping", count: 98 },
        { icon: Music, name: "Nightlife", count: 142 },
        { icon: Compass, name: "Adventure", count: 167 },
        { icon: Users, name: "Local Life", count: 203 },
        { icon: Star, name: "Art & Design", count: 121 },
    ]

    return (
        <section className="py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Explore by Interest
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">Find experiences that match your passion</p>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link key={category.name} href={`/explore?category=${category.name}`}>
                            <Card className="group h-full cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5">
                                <CardContent className="flex flex-col items-center p-8 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                                        <category.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-5 font-semibold text-foreground">{category.name}</h3>
                                    <p className="mt-1.5 text-sm text-muted-foreground">{category.count} tours</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
