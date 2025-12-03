"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Clock, Users, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ExplorePage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])

  const tours = [
    {
      id: 1,
      title: "Hidden Jazz Bars of New Orleans",
      guide: "Sarah Johnson",
      location: "New Orleans, USA",
      rating: 4.9,
      reviews: 127,
      price: 85,
      duration: 3,
      groupSize: 8,
      category: "Nightlife",
      image: "/new-orleans-jazz-bar.jpg",
    },
    {
      id: 2,
      title: "Tokyo Street Food Adventure",
      guide: "Yuki Tanaka",
      location: "Tokyo, Japan",
      rating: 5.0,
      reviews: 203,
      price: 120,
      duration: 4,
      groupSize: 6,
      category: "Food",
      image: "/tokyo-street-food.png",
    },
    {
      id: 3,
      title: "Paris Photography Walk",
      guide: "Sophie Chen",
      location: "Paris, France",
      rating: 4.8,
      reviews: 156,
      price: 95,
      duration: 3.5,
      groupSize: 10,
      category: "Photography",
      image: "/paris-eiffel-tower.png",
    },
    {
      id: 4,
      title: "Ancient Rome History Tour",
      guide: "Marco Rossi",
      location: "Rome, Italy",
      rating: 5.0,
      reviews: 89,
      price: 110,
      duration: 5,
      groupSize: 12,
      category: "History",
      image: "/rome-colosseum.png",
    },
    {
      id: 5,
      title: "Barcelona Market & Tapas",
      guide: "Elena Garcia",
      location: "Barcelona, Spain",
      rating: 4.9,
      reviews: 178,
      price: 75,
      duration: 3,
      groupSize: 8,
      category: "Food",
      image: "/barcelona-market.jpg",
    },
    {
      id: 6,
      title: "Dubai Modern Architecture",
      guide: "Ahmed Al Maktoum",
      location: "Dubai, UAE",
      rating: 4.7,
      reviews: 92,
      price: 150,
      duration: 4,
      groupSize: 6,
      category: "Architecture",
      image: "/dubai-burj-khalifa.png",
    },
  ]

  const categories = [
    "Food & Dining",
    "History & Culture",
    "Photography",
    "Shopping",
    "Nightlife",
    "Adventure",
    "Local Life",
    "Art & Design",
  ]

  const languages = ["English", "Spanish", "French", "Japanese", "German", "Italian", "Arabic", "Mandarin"]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Search Header */}
        <section className="border-b border-border bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground">Explore Tours</h1>
            <p className="mt-2 text-muted-foreground">Discover unique experiences with local experts</p>

            {/* Search Bar */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Where do you want to explore?" className="h-12 pl-11" />
              </div>
              <div className="flex gap-2">
                <Button size="lg" className="h-12">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 lg:hidden bg-transparent"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Filters Sidebar */}
              <aside
                className={`w-full space-y-6 lg:w-80 lg:flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                      <Button variant="ghost" size="sm">
                        Clear all
                      </Button>
                    </div>

                    {/* Price Range */}
                    <div className="mt-6 space-y-4">
                      <Label>Price Range</Label>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={500}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="mt-6 space-y-3">
                      <Label>Duration</Label>
                      <div className="space-y-2">
                        {[
                          { label: "1-2 hours", value: "1-2" },
                          { label: "3-4 hours", value: "3-4" },
                          { label: "5+ hours", value: "5+" },
                          { label: "Full day", value: "full-day" },
                        ].map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox id={option.value} />
                            <label htmlFor={option.value} className="text-sm text-muted-foreground cursor-pointer">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mt-6 space-y-3">
                      <Label>Category</Label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={category} />
                            <label htmlFor={category} className="text-sm text-muted-foreground cursor-pointer">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="mt-6 space-y-3">
                      <Label>Language</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language} value={language.toLowerCase()}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating */}
                    <div className="mt-6 space-y-3">
                      <Label>Minimum Rating</Label>
                      <div className="space-y-2">
                        {[5, 4.5, 4, 3.5].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <Checkbox id={`rating-${rating}`} />
                            <label
                              htmlFor={`rating-${rating}`}
                              className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer"
                            >
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              {rating}+ stars
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Results */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{tours.length} tours</span> found
                  </p>
                  <Select defaultValue="recommended">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tour Cards */}
                <div className="mt-6 grid gap-6">
                  {tours.map((tour) => (
                    <Link key={tour.id} href={`/tours/${tour.id}`}>
                      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative h-64 sm:h-auto sm:w-80">
                            <img
                              src={tour.image || "/placeholder.svg"}
                              alt={tour.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <Badge className="absolute right-3 top-3 bg-background/90 text-foreground hover:bg-background/90">
                              {tour.category}
                            </Badge>
                          </div>
                          <CardContent className="flex flex-1 flex-col p-6">
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">
                                    {tour.title}
                                  </h3>
                                  <p className="mt-1 text-sm text-muted-foreground">by {tour.guide}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-foreground">${tour.price}</div>
                                  <div className="text-xs text-muted-foreground">per person</div>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center gap-1 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{tour.location}</span>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                  <span className="font-medium text-foreground">{tour.rating}</span>
                                  <span>({tour.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{tour.duration} hours</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>Up to {tour.groupSize} people</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="default" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
