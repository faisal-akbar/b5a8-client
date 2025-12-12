import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/types/profile"
import {
    ArrowRight,
    Compass,
    Landmark,
    Moon,
    ShoppingBag,
    Squirrel,
    Trees,
    UtensilsCrossed,
    Waves,
} from "lucide-react"
import Link from "next/link"

export function CategoriesSection() {
    const categories: Array<{ 
        icon: typeof UtensilsCrossed; 
        category: Category;
        description: string;
        gradient: string;
    }> = [
        { 
            icon: UtensilsCrossed, 
            category: "FOOD",
            description: "Culinary adventures & local cuisine",
            gradient: "from-orange-500/20 to-red-500/20"
        },
        { 
            icon: Landmark, 
            category: "HISTORY",
            description: "Ancient sites & cultural heritage",
            gradient: "from-amber-500/20 to-yellow-500/20"
        },
        { 
            icon: Squirrel, 
            category: "WILDLIFE",
            description: "Safari & animal encounters",
            gradient: "from-green-500/20 to-emerald-500/20"
        },
        { 
            icon: ShoppingBag, 
            category: "SHOPPING",
            description: "Markets & retail therapy",
            gradient: "from-pink-500/20 to-rose-500/20"
        },
        { 
            icon: Moon, 
            category: "NIGHTLIFE",
            description: "Bars, clubs & evening entertainment",
            gradient: "from-purple-500/20 to-indigo-500/20"
        },
        { 
            icon: Compass, 
            category: "ADVENTURE",
            description: "Thrilling outdoor activities",
            gradient: "from-blue-500/20 to-cyan-500/20"
        },
        { 
            icon: Waves, 
            category: "BEACH",
            description: "Coastal relaxation & water sports",
            gradient: "from-cyan-500/20 to-teal-500/20"
        },
        { 
            icon: Trees, 
            category: "NATURE",
            description: "Hiking, parks & scenic views",
            gradient: "from-lime-500/20 to-green-500/20"
        },
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
                            <Card className="group relative h-full cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2">
                                {/* Animated gradient background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                                
                                {/* Subtle animated glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                
                                <CardContent className="relative flex flex-col items-center p-8 text-center">
                                    {/* Icon container with enhanced effects */}
                                    <div className="relative">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-2xl group-hover:shadow-primary/30">
                                            <item.icon className="h-9 w-9 transition-transform duration-500 group-hover:rotate-12" />
                                        </div>
                                        
                                        {/* Animated ring effect on hover */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-0" />
                                    </div>
                                    
                                    {/* Category name with better typography */}
                                    <h3 className="mt-6 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                                        {item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase()}
                                    </h3>
                                    
                                    {/* Description text */}
                                    <p className="mt-2 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                                        {item.description}
                                    </p>
                                    
                                    {/* Explore arrow indicator */}
                                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
                                        <span>Explore</span>
                                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
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
