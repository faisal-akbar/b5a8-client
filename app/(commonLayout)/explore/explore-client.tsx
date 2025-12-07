"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Clock, Users, Filter, X } from "lucide-react"
import Link from "next/link"
import { useState, useTransition, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
import type { GuideListing } from "@/types/guide"
import type { Category } from "@/types/profile"

// Category mapping from enum to display name
export const CATEGORY_MAP: Record<string, string> = {
  CULTURE: "Culture",
  HISTORY: "History", 
  FOOD: "Food",
  ADVENTURE: "Adventure",
  NATURE: "Nature",
  ART: "Art",
  ARCHITECTURE: "Architecture",
  BEACH: "Beach",
  WILDLIFE: "Wildlife",
  SHOPPING: "Shopping",
  NIGHTLIFE: "Nightlife",
  PHOTOGRAPHY: "Photography",
  MUSIC: "Music",
  RELIGION: "Religion",
  SPORTS: "Sports",
  WELLNESS: "Wellness",
  FAMILY: "Family",
  HERITAGE: "Heritage",
  WATER_SPORTS: "Water Sports",
  HIKING: "Hiking",
  CYCLING: "Cycling",
  MARKETS: "Markets",
  FESTIVALS: "Festivals",
  LOCAL_LIFE: "Local Life",
  HIDDEN_GEMS: "Hidden Gems",
  MUSEUM: "Museum",
  ENTERTAINMENT: "Entertainment",
  CULINARY: "Culinary",
  SPIRITUAL: "Spiritual",
  ECO_TOURISM: "Eco Tourism",
  URBAN_EXPLORATION: "Urban Exploration",
  COUNTRYSIDE: "Countryside",
  MOUNTAIN: "Mountain",
  CAMPING: "Camping",
  DIVING: "Diving",
  SURFING: "Surfing",
  FOOD_TOUR: "Food Tour",
  STREET_FOOD: "Street Food",
}

const All_CATEGORIES: Category[] = [
  "CULTURE",
  "HISTORY",
  "FOOD",
  "ADVENTURE",
  "NATURE",
  "ART",
  "ARCHITECTURE",
  "BEACH",
  "WILDLIFE",
  "SHOPPING",
  "NIGHTLIFE",
  "PHOTOGRAPHY",
  "MUSIC",
  "RELIGION",
  "SPORTS",
  "WELLNESS",
  "FAMILY",
  "HERITAGE",
  "WATER_SPORTS",
  "HIKING",
  "CYCLING",
  "MARKETS",
  "FESTIVALS",
  "LOCAL_LIFE",
  "HIDDEN_GEMS",
  "MUSEUM",
  "ENTERTAINMENT",
  "CULINARY",
  "SPIRITUAL",
  "ECO_TOURISM",
  "URBAN_EXPLORATION",
  "COUNTRYSIDE",
  "MOUNTAIN",
  "CAMPING",
  "DIVING",
  "SURFING",
  "FOOD_TOUR",
  "STREET_FOOD",
]

const LANGUAGES = [
  "English",
  "Spanish", 
  "French",
  "German",
  "Italian",
  "Japanese",
  "Chinese",
  "Arabic",
]

type ExploreFilters = {
  searchTerm?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  language?: string
}

type ExploreClientProps = {
  initialListings: GuideListing[]
  initialMeta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  initialFilters: ExploreFilters
}

/**
 * Client component for explore page with interactive filtering
 */
export function ExploreClient({ 
  initialListings, 
  initialMeta,
  initialFilters,
}: ExploreClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Local state for form inputs
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(initialFilters.searchTerm || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 1000,
  ])
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialFilters.category
  )
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    initialFilters.language
  )

  // Debounce search input to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchInput, 500)

  /**
   * Update URL when debounced search term changes
   */
  useEffect(() => {
    updateFilters({
      searchTerm: debouncedSearchTerm || undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

  /**
   * Update URL with new filters
   */
  const updateFilters = (updates: Partial<ExploreFilters>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update each filter parameter
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    })
    
    // Reset to page 1 when filters change
    params.set("page", "1")
    
    startTransition(() => {
      router.push(`/explore?${params.toString()}`)
    })
  }

  /**
   * Handle search input change (local state only, debounced update to URL)
   */
  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  /**
   * Handle price range change (debounced via button)
   */
  const handlePriceChange = () => {
    updateFilters({
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    })
  }

  /**
   * Handle category change
   */
  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? undefined : category
    setSelectedCategory(newCategory)
    updateFilters({ category: newCategory })
  }

  /**
   * Handle language change
   */
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    updateFilters({ language })
  }

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSearchInput("")
    setPriceRange([0, 1000])
    setSelectedCategory(undefined)
    setSelectedLanguage(undefined)
    
    startTransition(() => {
      router.push("/explore")
    })
  }

  /**
   * Handle pagination with limit
   */
  const handlePageChange = (page: number, limit?: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    if (limit !== undefined) {
      params.set("limit", String(limit))
    }
    
    startTransition(() => {
      router.push(`/explore?${params.toString()}`)
    })
  }

  // Check if any filters are active
  const hasActiveFilters = !!(
    debouncedSearchTerm ||
    selectedCategory ||
    selectedLanguage ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000
  )

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Search Header */}
        <section className="relative border-b border-border bg-linear-to-r from-primary/10 via-primary/5 to-background py-12 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Explore Tours
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover unique experiences with local experts around the world.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tours, cities, descriptions..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-12 border-primary/20 bg-background pl-11 shadow-sm transition-all focus:border-primary focus:ring-primary"
                />
              </div>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary/20 bg-background sm:w-auto lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Filters Sidebar */}
              <aside
                className={`w-full space-y-6 lg:w-80 lg:shrink-0 ${
                  showMobileFilters ? "block" : "hidden lg:block"
                }`}
              >
                <div className="sticky top-24">
                  <Card className="border-primary/10 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                        {hasActiveFilters && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleClearFilters}
                            className="text-primary hover:text-primary/80"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>

                      {/* Price Range */}
                      <div className="mt-6 space-y-4">
                        <Label>Price Range</Label>
                        <div className="space-y-4">
                          <Slider
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            min={0}
                            max={1000}
                            step={10}
                            className="w-full"
                          />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handlePriceChange}
                            disabled={isPending}
                            className="w-full"
                          >
                            Apply Price Filter
                          </Button>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mt-6 space-y-3">
                        <Label>Category</Label>
                        <div className="flex flex-wrap gap-2">
                          {All_CATEGORIES.map((category) => (
                            <Badge
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              className="cursor-pointer transition-all hover:scale-105"
                              onClick={() => handleCategoryChange(category)}
                            >
                              {CATEGORY_MAP[category]}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Language */}
                      <div className="mt-6 space-y-3">
                        <Label>Language</Label>
                        <Select 
                          value={selectedLanguage || "all"} 
                          onValueChange={(value) => 
                            handleLanguageChange(value === "all" ? "" : value)
                          }
                          
                        >
                          <SelectTrigger className="border-input bg-background w-full">
                            <SelectValue placeholder="All languages" />
                          </SelectTrigger>
                          <SelectContent >
                            <SelectItem value="all">All languages</SelectItem>
                            {LANGUAGES.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {initialMeta.total}
                    </span>{" "}
                    {initialMeta.total === 1 ? "tour" : "tours"} found
                  </p>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {debouncedSearchTerm && (
                      <Badge variant="secondary" className="gap-2">
                        Search: {debouncedSearchTerm}

                        <button
                          type="button"
                          aria-label="Clear search filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setSearchInput("");
                            updateFilters({ searchTerm: undefined });
                          }}
                        > <X className="h-3 w-3 cursor-pointer" /></button>
                      </Badge>
                    )}
                    {selectedCategory && (
                      <Badge variant="secondary" className="gap-2">
                        {CATEGORY_MAP[selectedCategory]}

                        <button
                          type="button"
                          aria-label="Clear category filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedCategory(undefined);
                            updateFilters({ category: undefined });
                          }}
                        > <X className="h-3 w-3 cursor-pointer" /></button>
                      </Badge>
                    )}
                    {selectedLanguage && (
                      <Badge variant="secondary" className="gap-2">
                        {selectedLanguage}
                        <button
                          type="button"
                          aria-label="Clear language filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedLanguage(undefined);
                            updateFilters({ language: undefined });
                          }}
                        >
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                      <Badge variant="secondary" className="gap-2">
                        ${priceRange[0]} - ${priceRange[1]}
                        <button
                          type="button"
                          aria-label="Clear price filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setPriceRange([0, 1000]);
                            updateFilters({ minPrice: undefined, maxPrice: undefined });
                          }}
                        >
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Tour Cards */}
                {isPending ? (
                  <div className="mt-6 grid gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-64 animate-pulse rounded bg-muted" />
                    ))}
                  </div>
                ) : initialListings.length === 0 ? (
                  <div className="mt-12 flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-6">
                      <Search className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-foreground">
                      No tours found
                    </h3>
                    <p className="mt-2 text-center text-muted-foreground">
                      Try adjusting your filters or search terms to find what you're looking
                      for.
                    </p>
                    {hasActiveFilters && (
                      <Button 
                        onClick={handleClearFilters} 
                        className="mt-6"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 grid gap-6">
                    {initialListings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link href={`/tours/${listing.id}`}>
                          <Card className="group cursor-pointer overflow-hidden border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative h-64 overflow-hidden sm:h-auto sm:w-80">
                                <img
                                  src={listing.images[0] || "/placeholder.svg"}
                                  alt={listing.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <Badge className="absolute right-3 top-3 bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90">
                                  {CATEGORY_MAP[listing.category]}
                                </Badge>
                                {!listing.isActive && (
                                  <Badge 
                                    variant="destructive"
                                    className="absolute left-3 top-3"
                                  >
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="flex flex-1 flex-col p-6">
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                        {listing.title}
                                      </h3>
                                      <p className="mt-1 text-sm text-muted-foreground">
                                        by {listing.guide?.user?.name || "Local Guide"}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-2xl font-bold text-primary">
                                        ${listing.tourFee}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        per person
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3 flex items-center gap-1 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{listing.city}</span>
                                  </div>

                                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                    {listing.description}
                                  </p>

                                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    {listing.averageRating && (
                                      <div className="flex items-center gap-1 rounded-full bg-primary/5 px-2 py-1 text-primary">
                                        <Star className="h-3.5 w-3.5 fill-primary" />
                                        <span className="font-semibold">
                                          {listing.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-muted-foreground">
                                          ({listing._count.reviews})
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{listing.durationDays} {listing.durationDays === 1 ? "day" : "days"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                                      <Users className="h-3.5 w-3.5" />
                                      <span>Up to {listing.maxGroupSize}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {initialMeta.totalPages > 0 && (
                  <div className="mt-12 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {initialMeta.total} total
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Page</p>
                        <Select
                          value={`${initialMeta.page}`}
                          onValueChange={(value) => {
                            handlePageChange(Number(value), initialMeta.limit)
                          }}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={initialMeta.page} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {Array.from({ length: initialMeta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                              <SelectItem key={pageNum} value={`${pageNum}`}>
                                {pageNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">of {initialMeta.totalPages}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                          value={`${initialMeta.limit}`}
                          onValueChange={(value) => {
                            handlePageChange(1, Number(value)) // Reset to page 1 when limit changes
                          }}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={initialMeta.limit} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                              <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

