"use client"

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        <div className="mx-auto -mt-12 max-w-2xl px-4 relative z-10 animate-fade-in-up delay-300">
            <Card className="border-2 shadow-xl shadow-primary/5 backdrop-blur-sm bg-background/95">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Where are you going?"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-12 border-0 bg-muted/50 pl-12 text-base focus-visible:ring-1 transition-all hover:bg-muted/70"
                            />
                        </div>
                        <Button 
                            size="lg" 
                            className="h-12 gap-2 px-8 shadow-lg transition-transform hover:scale-105 active:scale-95"
                            onClick={handleSearch}
                        >
                            <Search className="h-5 w-5" />
                            Search
                        </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Popular:</span>
                        {["New York", "Miami", "Los Angeles", "California"].map((city) => (
                            <Badge
                                key={city}
                                variant="secondary"
                                className="cursor-pointer border-0 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
                                onClick={() => handleCityClick(city)}
                            >
                                {city}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
