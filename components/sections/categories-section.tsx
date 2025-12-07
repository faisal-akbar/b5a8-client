import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    UtensilsCrossed,
    Landmark,
    Squirrel,
    ShoppingBag,
    Moon,
    Compass,
    Waves,
    Trees,
} from "lucide-react"
import type { Category } from "@/types/profile"

export function CategoriesSection() {
    const categories: Array<{ icon: typeof UtensilsCrossed; category: Category }> = [
        { icon: UtensilsCrossed, category: "FOOD" },
        { icon: Landmark, category: "HISTORY" },
        { icon: Squirrel, category: "WILDLIFE" },
        { icon: ShoppingBag, category: "SHOPPING" },
        { icon: Moon, category: "NIGHTLIFE" },
        { icon: Compass, category: "ADVENTURE" },
        { icon: Waves, category: "BEACH" },
        { icon: Trees, category: "NATURE" },
    ]

    return (
        <section className="py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Explore by Interest
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">Find experiences that match your passion</p>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((item) => (
                        <Link key={item.category} href={`/explore?category=${item.category}`}>
                            <Card className="group h-full cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5">
                                <CardContent className="flex flex-col items-center p-8 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                                        <item.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-5 font-semibold text-foreground">{item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase()}</h3>
                                    
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
