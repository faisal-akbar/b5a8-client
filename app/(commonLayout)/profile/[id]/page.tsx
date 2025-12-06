"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Shield, MessageCircle, Share2, Calendar, Globe, Award, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ProfilePage() {
  // Mock data
  const guide = {
    name: "Sarah Johnson",
    avatar: "/professional-woman-guide-portrait.jpg",
    coverImage: "/new-orleans-street.jpg",
    location: "New Orleans, USA",
    rating: 4.9,
    reviews: 127,
    toursGiven: 245,
    joinedDate: "March 2021",
    languages: ["English", "French"],
    verified: true,
    about: `Hi, I'm Sarah! I've lived in New Orleans for over 10 years and I'm passionate about sharing the city's rich history and vibrant culture with visitors.

My specialty is the local jazz scene and culinary history. I believe the best way to understand New Orleans is through its music and food. When I'm not guiding tours, you can find me exploring new restaurants or listening to live music on Frenchmen Street.

I love meeting people from all over the world and helping them discover the hidden gems that make this city so special.`,
    expertise: ["History", "Food & Drink", "Music", "Architecture"],
    tours: [
      {
        id: 1,
        title: "Hidden Jazz Bars of New Orleans",
        image: "/new-orleans-jazz-bar.jpg",
        price: 85,
        rating: 4.9,
        reviews: 127,
        duration: "3 hours",
      },
      {
        id: 2,
        title: "French Quarter Culinary History",
        image: "/new-orleans-food-tour.jpg",
        price: 75,
        rating: 4.8,
        reviews: 94,
        duration: "2.5 hours",
      },
      {
        id: 3,
        title: "Garden District Architecture Walk",
        image: "/garden-district-mansion.jpg",
        price: 60,
        rating: 5.0,
        reviews: 42,
        duration: "2 hours",
      },
    ],
    reviewsList: [
      {
        id: 1,
        user: "Michael Brown",
        avatar: "/man-profile.png",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Sarah was an incredible guide! She took us to places I never would have found on my own. The music was amazing and the venues were authentic.",
        tour: "Hidden Jazz Bars of New Orleans",
      },
      {
        id: 2,
        user: "Emma Davis",
        avatar: "/woman-profile.png",
        rating: 5,
        date: "1 month ago",
        comment:
          "Sarah is knowledgeable, friendly, and clearly passionate about the music scene. Highly recommend her tours!",
        tour: "Hidden Jazz Bars of New Orleans",
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-64 w-full overflow-hidden bg-slate-200 sm:h-80">
            <img
              src={guide.coverImage || "/placeholder.svg"}
              alt="Cover"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-20 flex flex-col items-start gap-6 pb-6 sm:flex-row sm:items-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-full border-4 border-background bg-background p-1 shadow-xl"
              >
                <Avatar className="h-32 w-32 sm:h-40 sm:w-40">
                  <AvatarImage src={guide.avatar || "/placeholder.svg"} className="object-cover" />
                  <AvatarFallback className="text-4xl">{guide.name[0]}</AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 space-y-2 pt-2 sm:pb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl sm:text-white sm:drop-shadow-md">
                          {guide.name}
                        </h1>
                        {guide.verified && (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-emerald-50 text-emerald-700 sm:bg-emerald-500 sm:text-white"
                          >
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground sm:text-slate-200">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {guide.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {guide.joinedDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:self-end">
                      <Button className="shadow-lg transition-transform hover:scale-105">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Me
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-background/80 backdrop-blur-sm hover:bg-background sm:border-white/20 sm:bg-white/10 sm:text-white sm:hover:bg-white/20"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Stats & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                <CardContent className="grid grid-cols-2 gap-4 p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                      {guide.rating} <Star className="h-5 w-5 fill-primary text-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground">{guide.reviews} reviews</div>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <div className="text-2xl font-bold text-foreground">{guide.toursGiven}</div>
                    <div className="text-xs text-muted-foreground">Tours given</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="px-3 py-1">
                        <Globe className="mr-1 h-3 w-3" />
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {guide.expertise.map((item) => (
                      <Badge key={item} variant="outline" className="border-primary/20 bg-primary/5 px-3 py-1 text-primary">
                        <Award className="mr-1 h-3 w-3" />
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                  <TabsTrigger
                    value="about"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="tours"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Tours ({guide.tours.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Reviews ({guide.reviews})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 space-y-6">
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold text-foreground">About Me</h3>
                      <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{guide.about}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold text-foreground">Why I Guide</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">Passion for History</h4>
                            <p className="text-sm text-muted-foreground">I love sharing the stories that shaped this city.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">Local Connection</h4>
                            <p className="text-sm text-muted-foreground">Connecting visitors with authentic local experiences.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tours" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {guide.tours.map((tour, index) => (
                      <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link href={`/tours/${tour.id}`}>
                          <Card className="group h-full overflow-hidden border-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={tour.image || "/placeholder.svg"}
                                alt={tour.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <Badge className="absolute right-3 top-3 bg-white/90 text-slate-900 backdrop-blur-sm hover:bg-white">
                                From ${tour.price}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="font-medium text-foreground">{tour.rating}</span>
                                <span>({tour.reviews})</span>
                                <span className="mx-1">•</span>
                                <span>{tour.duration}</span>
                              </div>
                              <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary">
                                {tour.title}
                              </h3>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {guide.reviewsList.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{review.user[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-foreground">{review.user}</h4>
                                  <span className="text-sm text-muted-foreground">{review.date}</span>
                                </div>
                                <div className="mt-1 flex gap-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                  ))}
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">
                                  Tour: <span className="font-medium text-foreground">{review.tour}</span>
                                </p>
                                <p className="mt-2 leading-relaxed text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
