"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SearchSection() {
    const router = useRouter()
    const [searchInput, setSearchInput] = useState("")

    const handleSearch = () => {
        if (searchInput.trim()) {
            const params = new URLSearchParams()
            params.set("searchTerm", searchInput.trim())
            router.push(`/explore?${params.toString()}`)
        } else {
            router.push("/explore")
        }
    }

    const handleCityClick = (city: string) => {
        const params = new URLSearchParams()
        params.set("searchTerm", city)
        router.push(`/explore?${params.toString()}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="mx-auto -mt-12 max-w-3xl px-4 relative z-10 animate-fade-in-up delay-300">
            <Card className="group relative overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-background/95 transition-all duration-500 hover:border-primary/30 hover:shadow-primary/20">
                {/* Gradient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />
                <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-primary/10 to-transparent blur-2xl" />
                
                <CardContent className="relative p-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Enhanced search input */}
                        <div className="relative flex-1">
                            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
                            <Input
                                placeholder="Where are you going?"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-14 border-2 border-border/50 bg-muted/30 pl-12 text-base font-medium transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 hover:bg-muted/50 hover:border-primary/30"
                            />
                            {/* Input glow effect on focus */}
                            <div className="absolute inset-0 -z-10 rounded-md bg-primary/20 opacity-0 blur-xl transition-opacity duration-300 focus-within:opacity-100" />
                        </div>
                        
                        {/* Enhanced search button */}
                        <Button 
                            size="lg" 
                            className="group/btn relative h-14 gap-2 px-8 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 active:scale-95"
                            onClick={handleSearch}
                        >
                            {/* Button glow effect */}
                            <div className="absolute inset-0 rounded-md bg-primary opacity-0 blur-xl transition-opacity duration-300 group-hover/btn:opacity-50" />
                            
                            <Search className="relative h-5 w-5 transition-transform duration-300 group-hover/btn:rotate-12" />
                            <span className="relative">Search</span>
                        </Button>
                    </div>
                    
                    {/* Enhanced popular cities section */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span>Popular:</span>
                        </div>
                        {[
                            { city: "New York", gradient: "from-blue-500 to-cyan-500" },
                            { city: "Miami", gradient: "from-pink-500 to-rose-500" },
                            { city: "Los Angeles", gradient: "from-purple-500 to-indigo-500" },
                            { city: "California", gradient: "from-amber-500 to-orange-500" }
                        ].map(({ city, gradient }) => (
                            <Badge
                                key={city}
                                variant="secondary"
                                className={`group/badge relative cursor-pointer overflow-hidden border-0 bg-muted/50 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                onClick={() => handleCityClick(city)}
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover/badge:opacity-100`} />
                                
                                <span className="relative transition-colors duration-300 group-hover/badge:text-white">
                                    {city}
                                </span>
                                
                                {/* Sparkle effect on hover */}
                                <Sparkles className="absolute right-1 top-1 h-3 w-3 text-white opacity-0 transition-all duration-300 group-hover/badge:opacity-100 group-hover/badge:rotate-12" />
                            </Badge>
                        ))}
                    </div>
                    
                    {/* Quick stats or tips */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1 w-1 rounded-full bg-primary/50" />
                        <span>Over 10,000 tours available worldwide</span>
                        <div className="h-1 w-1 rounded-full bg-primary/50" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
