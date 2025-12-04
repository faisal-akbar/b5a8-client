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
import { motion } from "framer-motion"

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
      <main className="flex-1">
        {/* Search Header */}
        <section className="relative border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Explore Tours</h1>
              <p className="mt-4 text-lg text-muted-foreground">Discover unique experiences with local experts around the world.</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Where do you want to explore?"
                  className="h-12 border-primary/20 bg-background pl-11 shadow-sm transition-all focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button size="lg" className="h-12 px-8 shadow-md transition-all hover:scale-105">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-primary/20 bg-background lg:hidden"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Filters Sidebar */}
              <aside
                className={`w-full space-y-6 lg:w-80 lg:flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
              >
                <div className="sticky top-24">
                  <Card className="border-primary/10 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
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
                              <label htmlFor={option.value} className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
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
                              <label htmlFor={category} className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
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
                          <SelectTrigger className="border-input bg-background">
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
                                className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
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
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{tours.length} tours</span> found
                  </p>
                  <Select defaultValue="recommended">
                    <SelectTrigger className="w-[180px] border-input bg-background">
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
                  {tours.map((tour, index) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link href={`/tours/${tour.id}`}>
                        <Card className="group cursor-pointer overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative h-64 sm:h-auto sm:w-80 overflow-hidden">
                              <img
                                src={tour.image || "/placeholder.svg"}
                                alt={tour.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <Badge className="absolute right-3 top-3 bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90">
                                {tour.category}
                              </Badge>
                            </div>
                            <CardContent className="flex flex-1 flex-col p-6">
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                      {tour.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">by {tour.guide}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">${tour.price}</div>
                                    <div className="text-xs text-muted-foreground">per person</div>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center gap-1 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{tour.location}</span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1 rounded-full bg-primary/5 px-2 py-1 text-primary">
                                    <Star className="h-3.5 w-3.5 fill-primary" />
                                    <span className="font-semibold">{tour.rating}</span>
                                    <span className="text-muted-foreground">({tour.reviews})</span>
                                  </div>
                                  <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{tour.duration} hours</span>
                                  </div>
                                  <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>Up to {tour.groupSize}</span>
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
    </div>
  )
}
