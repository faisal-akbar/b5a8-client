import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Shield, Globe, MessageCircle, Calendar, Award, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  // Mock data - in real app would come from params and API
  const profile = {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?key=guide1",
    role: "guide",
    location: "New Orleans, Louisiana, USA",
    bio: "Born and raised in New Orleans, I've been immersed in the city's vibrant jazz culture my entire life. As a former music journalist and lifelong jazz enthusiast, I love sharing the authentic soul of this city with visitors. My tours go beyond the typical tourist spots to show you where locals really go for the best music.",
    memberSince: "2022",
    verified: true,
    rating: 4.9,
    totalReviews: 127,
    toursGiven: 245,
    languages: ["English", "French"],
    responseTime: "1 hour",
    responseRate: "98%",
    expertise: ["Nightlife", "Music", "Local Culture", "Food & Drink"],
    certifications: ["Licensed Tour Guide", "First Aid Certified"],
  }

  const activeTours = [
    {
      id: 1,
      title: "Hidden Jazz Bars of New Orleans",
      image: "/placeholder.svg?key=tour1",
      rating: 4.9,
      reviews: 127,
      price: 85,
      duration: 3,
    },
    {
      id: 2,
      title: "French Quarter Ghost Stories",
      image: "/placeholder.svg?key=tour2",
      rating: 4.8,
      reviews: 94,
      price: 65,
      duration: 2,
    },
  ]

  const reviews = [
    {
      id: 1,
      author: "Michael Brown",
      avatar: "/placeholder.svg?key=user1",
      rating: 5,
      date: "2 weeks ago",
      tour: "Hidden Jazz Bars of New Orleans",
      comment:
        "Sarah was an incredible guide! She took us to places I never would have found on my own. The music was amazing and the venues were authentic. This was the highlight of our New Orleans trip!",
    },
    {
      id: 2,
      author: "Emma Davis",
      avatar: "/placeholder.svg?key=user2",
      rating: 5,
      date: "1 month ago",
      tour: "Hidden Jazz Bars of New Orleans",
      comment:
        "If you want to experience real New Orleans jazz, this is the tour to take. Sarah is knowledgeable, friendly, and clearly passionate about the music scene. Highly recommend!",
    },
    {
      id: 3,
      author: "James Wilson",
      avatar: "/placeholder.svg?key=user3",
      rating: 5,
      date: "1 month ago",
      tour: "French Quarter Ghost Stories",
      comment:
        "Excellent tour! Sarah knows all the best stories and really brings the history to life. Great storyteller!",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-4xl">{profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                      {profile.verified && (
                        <Badge className="gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-semibold text-foreground">{profile.rating}</span>
                        <span className="text-muted-foreground">({profile.totalReviews} reviews)</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{profile.toursGiven} tours given</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Joined {profile.memberSince}</span>
                    </div>
                  </div>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact {profile.name.split(" ")[0]}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Left - Main Content */}
              <div className="flex-1 space-y-8">
                <Tabs defaultValue="about">
                  <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="tours">Tours ({activeTours.length})</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({profile.totalReviews})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="mt-6 space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-foreground">About Me</h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed">{profile.bio}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-foreground">Expertise</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {profile.expertise.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-foreground">Certifications</h2>
                        <div className="mt-4 space-y-2">
                          {profile.certifications.map((cert) => (
                            <div key={cert} className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-primary" />
                              <span className="text-muted-foreground">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tours" className="mt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {activeTours.map((tour) => (
                        <Link key={tour.id} href={`/tours/${tour.id}`}>
                          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={tour.image || "/placeholder.svg"}
                                alt={tour.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-foreground group-hover:text-primary">{tour.title}</h3>
                              <div className="mt-2 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                  <span className="font-medium">{tour.rating}</span>
                                  <span className="text-muted-foreground">({tour.reviews})</span>
                                </div>
                                <span className="text-muted-foreground">{tour.duration}h</span>
                              </div>
                              <div className="mt-2 font-bold text-foreground">
                                ${tour.price}{" "}
                                <span className="text-sm font-normal text-muted-foreground">per person</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6 space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-foreground">{review.author}</h4>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <div className="mt-1 flex gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">Tour: {review.tour}</p>
                              <p className="mt-3 text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right - Sidebar */}
              <div className="lg:w-80">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground">Quick Facts</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">Languages</div>
                            <div className="text-sm text-muted-foreground">{profile.languages.join(", ")}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MessageCircle className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">Response Time</div>
                            <div className="text-sm text-muted-foreground">Within {profile.responseTime}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">Response Rate</div>
                            <div className="text-sm text-muted-foreground">{profile.responseRate}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">Member Since</div>
                            <div className="text-sm text-muted-foreground">{profile.memberSince}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground">Achievements</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">Super Guide</div>
                            <div className="text-xs text-muted-foreground">Top 10% of guides</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">100+ Tours</div>
                            <div className="text-xs text-muted-foreground">Experienced guide</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">5-Star Rating</div>
                            <div className="text-xs text-muted-foreground">Consistently excellent</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
