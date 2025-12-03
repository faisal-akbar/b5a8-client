"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Star,
  Clock,
  Users,
  Shield,
  MessageCircle,
  Heart,
  Share2,
  CheckCircle,
  Globe,
  Award,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function TourDetailsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [guests, setGuests] = useState("1")
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Mock data - would come from API in real app
  const tour = {
    id: 1,
    title: "Hidden Jazz Bars of New Orleans",
    guide: {
      name: "Sarah Johnson",
      avatar: "/professional-woman-guide-portrait.jpg",
      rating: 4.9,
      reviews: 127,
      toursGiven: 245,
      responseTime: "1 hour",
      languages: ["English", "French"],
      verified: true,
    },
    location: "New Orleans, Louisiana, USA",
    rating: 4.9,
    reviews: 127,
    price: 85,
    duration: 3,
    groupSize: 8,
    category: "Nightlife",
    images: [
      "/new-orleans-jazz-bar.jpg",
      "/new-orleans-live-jazz-music-venue.jpg",
      "/intimate-jazz-club-atmosphere.jpg",
      "/jazz-musicians-performing-on-stage.jpg",
      "/french-quarter-nightlife-scene.jpg",
    ],
    description: `Experience the authentic soul of New Orleans through its legendary jazz scene. This intimate tour takes you beyond the touristy Bourbon Street to discover hidden gems where locals go to enjoy live music.

We'll visit 3-4 carefully selected venues, each with its own unique atmosphere and history. You'll learn about the birth of jazz, meet talented musicians, and understand why this music is so deeply connected to the city's culture.

The tour includes one complimentary drink at each venue and plenty of time to enjoy the music, dance, and immerse yourself in the authentic New Orleans nightlife.`,
    highlights: [
      "Visit 3-4 authentic jazz clubs frequented by locals",
      "Learn about the history and evolution of jazz music",
      "Meet local musicians and hear their stories",
      "One complimentary drink at each venue",
      "Small group for an intimate experience",
      "Off-the-beaten-path locations",
    ],
    included: [
      "Professional local guide",
      "Entry to all venues",
      "One drink per venue (3-4 drinks total)",
      "Jazz history insights",
      "Small group atmosphere",
    ],
    notIncluded: [
      "Additional drinks",
      "Food (available for purchase)",
      "Transportation to/from meeting point",
      "Gratuities",
    ],
    meetingPoint: "Jackson Square, in front of St. Louis Cathedral",
    itinerary: [
      {
        time: "7:00 PM",
        title: "Meet & Greet",
        description: "We meet at Jackson Square and start with an introduction to New Orleans jazz history.",
      },
      {
        time: "7:30 PM",
        title: "First Venue",
        description: "Visit a historic jazz club in the French Quarter, enjoy live music and your first drink.",
      },
      {
        time: "8:30 PM",
        title: "Second Venue",
        description: "Head to a local favorite spot in Marigny, meet the musicians.",
      },
      {
        time: "9:30 PM",
        title: "Final Venue",
        description: "End the night at an intimate venue with some of the best jazz in the city.",
      },
    ],
  }

  const testimonials = [
    {
      name: "Michael Brown",
      avatar: "/man-profile.png",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Sarah was an incredible guide! She took us to places I never would have found on my own. The music was amazing and the venues were authentic. This was the highlight of our New Orleans trip!",
    },
    {
      name: "Emma Davis",
      avatar: "/woman-profile.png",
      rating: 5,
      date: "1 month ago",
      comment:
        "If you want to experience real New Orleans jazz, this is the tour to take. Sarah is knowledgeable, friendly, and clearly passionate about the music scene. Highly recommend!",
    },
    {
      name: "James Wilson",
      avatar: "/man-traveler-photo.jpg",
      rating: 5,
      date: "1 month ago",
      comment: "Excellent tour! Small group, great atmosphere, and the best jazz clubs in the city. Worth every penny.",
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tour.images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-2 sm:grid-cols-4"
          >
            <button
              onClick={() => {
                setCurrentImageIndex(0)
                setGalleryOpen(true)
              }}
              className="group relative h-[400px] overflow-hidden rounded-lg sm:col-span-2 sm:row-span-2"
            >
              <img
                src={tour.images[0] || "/placeholder.svg"}
                alt={tour.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
            {tour.images.slice(1, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index + 1)
                  setGalleryOpen(true)
                }}
                className="group relative h-[196px] overflow-hidden rounded-lg"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${tour.title} ${index + 2}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </button>
            ))}
            <button
              onClick={() => setGalleryOpen(true)}
              className="group relative flex h-[196px] items-center justify-center overflow-hidden rounded-lg bg-slate-900/10 backdrop-blur-sm transition-colors hover:bg-slate-900/20"
            >
              <span className="font-medium text-slate-900">View All {tour.images.length} Photos</span>
            </button>
          </motion.div>
        </section>

        <AnimatePresence>
          {galleryOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
              onClick={() => setGalleryOpen(false)}
            >
              <button
                onClick={() => setGalleryOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  previousImage()
                }}
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={tour.images[currentImageIndex]}
                alt={`${tour.title} ${currentImageIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                {currentImageIndex + 1} / {tour.images.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column - Tour Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 space-y-8"
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{tour.category}</Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-muted-foreground">({tour.reviews} reviews)</span>
                  </div>
                </div>
                <h1 className="text-balance mt-3 text-3xl font-bold text-foreground lg:text-4xl">{tour.title}</h1>
                <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{tour.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 border-y border-border/50 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{tour.duration} hours</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Up to {tour.groupSize}</div>
                    <div className="text-xs text-muted-foreground">Group size</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{tour.guide.languages.join(", ")}</div>
                    <div className="text-xs text-muted-foreground">Languages</div>
                  </div>
                </div>
              </div>

              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-slate-100">
                      <AvatarImage src={tour.guide.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{tour.guide.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{tour.guide.name}</h3>
                        {tour.guide.verified && (
                          <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700">
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          {tour.guide.rating} ({tour.guide.reviews} reviews)
                        </div>
                        <span>•</span>
                        <span>{tour.guide.toursGiven} tours</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link href={`/profile/${tour.guide.name.toLowerCase().replace(" ", "-")}`}>
                          <Button variant="outline" size="sm" className="hover:bg-slate-50 bg-transparent">
                            View Profile
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="hover:bg-slate-50 bg-transparent">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground">About This Tour</h2>
                <p className="text-pretty mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
                  {tour.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Highlights</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {tour.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground">Itinerary</h2>
                <div className="mt-6 space-y-6">
                  {tour.itinerary.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative flex gap-4 pb-6 last:pb-0"
                    >
                      {index !== tour.itinerary.length - 1 && (
                        <div className="absolute left-4 top-12 h-full w-px bg-gradient-to-b from-primary/50 to-transparent" />
                      )}
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {item.time}
                        </div>
                        <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Included/Not Included */}
              <div className="grid gap-6 sm:grid-cols-2">
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">What's Included</h3>
                    <ul className="mt-4 space-y-3">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">What's Not Included</h3>
                    <ul className="mt-4 space-y-3">
                      {tour.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Meeting Point</h3>
                      <p className="mt-2 text-muted-foreground">{tour.meetingPoint}</p>
                      <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                        View on map →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-2xl font-semibold text-foreground">Reviews</h2>
                <div className="mt-6 space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="border-2 border-slate-100">
                              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                <span className="text-sm text-muted-foreground">{testimonial.date}</span>
                              </div>
                              <div className="mt-1 flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                              </div>
                              <p className="text-pretty mt-3 leading-relaxed text-muted-foreground">
                                {testimonial.comment}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="mt-6 w-full border-slate-300 bg-transparent hover:bg-slate-50">
                  Load More Reviews
                </Button>
              </div>
            </motion.div>

            <div className="lg:w-96">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                <Card className="border-2 border-slate-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">${tour.price}</span>
                      <span className="text-muted-foreground">per person</span>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Select Date</Label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-lg border-slate-200"
                          classNames={{
                            day_selected: "bg-primary text-white hover:bg-primary hover:text-white",
                            day_today: "bg-slate-100 text-slate-900",
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guests" className="text-sm font-medium">
                          Number of Guests
                        </Label>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger id="guests" className="border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(tour.groupSize)].map((_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1} {i === 0 ? "guest" : "guests"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3 border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            ${tour.price} × {guests} {guests === "1" ? "guest" : "guests"}
                          </span>
                          <span className="font-semibold text-foreground">${tour.price * Number.parseInt(guests)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Service fee</span>
                          <span className="font-semibold text-foreground">
                            ${Math.round(tour.price * Number.parseInt(guests) * 0.1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="text-2xl font-bold text-foreground">
                            $
                            {tour.price * Number.parseInt(guests) +
                              Math.round(tour.price * Number.parseInt(guests) * 0.1)}
                          </span>
                        </div>
                      </div>

                      <Button size="lg" className="w-full shadow-sm">
                        Request to Book
                      </Button>

                      <p className="text-center text-xs text-muted-foreground">You won't be charged yet</p>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-200 pt-6">
                      <Button variant="ghost" size="sm" className="hover:bg-slate-50">
                        <Heart className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-50">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4 border-emerald-200 bg-emerald-50/50">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Award className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">Free cancellation</p>
                        <p className="mt-1 text-xs text-emerald-700">
                          Cancel up to 24 hours before the tour for a full refund
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
