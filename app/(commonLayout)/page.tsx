import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Star,
  Users,
  Shield,
  Camera,
  Utensils,
  Landmark,
  ShoppingBag,
  Music,
  Compass,
  CheckCircle2,
  TrendingUp,
  Heart,
  Award,
  Calendar,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(66,99,235,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Trusted by 50,000+ travelers worldwide</span>
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-tight">
                Discover Authentic Experiences
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  with Local Experts
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
                Connect with passionate local guides who know the hidden gems of their city. Explore destinations like a
                local, not a tourist.
              </p>

              {/* Search Bar */}
              <div className="mx-auto mt-12 max-w-2xl">
                <Card className="border-2 shadow-xl shadow-primary/5">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Where are you going?"
                          className="h-12 border-0 bg-muted/50 pl-12 text-base focus-visible:ring-1"
                        />
                      </div>
                      <Button size="lg" className="h-12 gap-2 px-8 shadow-lg">
                        <Search className="h-5 w-5" />
                        Search
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Popular:</span>
                      {["Paris", "Tokyo", "New York", "Barcelona"].map((city) => (
                        <Badge
                          key={city}
                          variant="secondary"
                          className="cursor-pointer border-0 transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Tour Categories */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Explore by Interest
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">Find experiences that match your passion</p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Utensils, name: "Food & Dining", count: 234 },
                { icon: Landmark, name: "History & Culture", count: 189 },
                { icon: Camera, name: "Photography", count: 156 },
                { icon: ShoppingBag, name: "Shopping", count: 98 },
                { icon: Music, name: "Nightlife", count: 142 },
                { icon: Compass, name: "Adventure", count: 167 },
                { icon: Users, name: "Local Life", count: 203 },
                { icon: Star, name: "Art & Design", count: 121 },
              ].map((category) => (
                <Link key={category.name} href={`/explore?category=${category.name}`}>
                  <Card className="group h-full cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                        <category.icon className="h-8 w-8" />
                      </div>
                      <h3 className="mt-5 font-semibold text-foreground">{category.name}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{category.count} tours</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Popular Destinations</h2>
              <p className="mt-4 text-lg text-muted-foreground">Explore the world's most exciting cities</p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { city: "Paris", country: "France", tours: 145, image: "/paris-eiffel-tower.png" },
                { city: "Tokyo", country: "Japan", tours: 198, image: "/tokyo-cityscape.png" },
                { city: "New York", country: "USA", tours: 167, image: "/nyc-skyline-twilight.png" },
                { city: "Barcelona", country: "Spain", tours: 134, image: "/barcelona-sagrada-familia.jpg" },
                { city: "Dubai", country: "UAE", tours: 89, image: "/dubai-burj-khalifa.png" },
                { city: "Bangkok", country: "Thailand", tours: 112, image: "/bangkok-temples.jpg" },
              ].map((destination) => (
                <Link key={destination.city} href={`/explore?city=${destination.city}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.city}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h3 className="text-2xl font-bold">{destination.city}</h3>
                        <p className="mt-1 text-sm text-white/90">{destination.country}</p>
                        <p className="mt-2 text-sm text-white/80">{destination.tours} tours available</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated Guides */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Meet Our Top-Rated Guides
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">Experienced locals ready to show you around</p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Sophie Chen",
                  location: "Paris, France",
                  rating: 4.9,
                  reviews: 127,
                  tours: 24,
                  image: "/asian-woman-smiling-guide.jpg",
                },
                {
                  name: "Marco Rossi",
                  location: "Rome, Italy",
                  rating: 5.0,
                  reviews: 89,
                  tours: 18,
                  image: "/italian-man-tour-guide.jpg",
                },
                {
                  name: "Elena Garcia",
                  location: "Barcelona, Spain",
                  rating: 4.8,
                  reviews: 156,
                  tours: 31,
                  image: "/spanish-woman-guide.jpg",
                },
                {
                  name: "Yuki Tanaka",
                  location: "Tokyo, Japan",
                  rating: 4.9,
                  reviews: 203,
                  tours: 27,
                  image: "/japanese-woman-guide.jpg",
                },
              ].map((guide) => (
                <Link key={guide.name} href={`/profile/${guide.name.toLowerCase().replace(" ", "-")}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                    <CardContent className="p-6">
                      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full">
                        <img
                          src={guide.image || "/placeholder.svg"}
                          alt={guide.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <Badge className="absolute bottom-0 right-0 bg-primary">
                          <Star className="mr-1 h-3 w-3 fill-primary-foreground" />
                          {guide.rating}
                        </Badge>
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="font-semibold text-foreground">{guide.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{guide.location}</p>
                        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                          <span>{guide.reviews} reviews</span>
                          <span>•</span>
                          <span>{guide.tours} tours</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-primary/5 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Book your perfect local experience in three simple steps
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Find Your Guide",
                  description:
                    "Browse through verified local guides, read reviews, and find the perfect match for your interests and travel style.",
                },
                {
                  step: "02",
                  icon: Calendar,
                  title: "Book Your Tour",
                  description:
                    "Choose your preferred date and time, customize your experience, and securely book your tour with instant confirmation.",
                },
                {
                  step: "03",
                  icon: MapPin,
                  title: "Explore Like a Local",
                  description:
                    "Meet your guide, discover hidden gems, and create unforgettable memories with authentic local experiences.",
                },
              ].map((step, index) => (
                <div key={step.step} className="relative">
                  <Card className="h-full border-2">
                    <CardContent className="p-8">
                      <div className="absolute -top-6 left-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-lg">
                          {step.step}
                        </div>
                      </div>
                      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < 2 && (
                    <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                      <div className="h-0.5 w-8 bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose LocalGuide</h2>
              <p className="mt-4 text-lg text-muted-foreground">The best platform for authentic travel experiences</p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Shield,
                  title: "Verified Guides",
                  description: "All guides are carefully vetted and verified for your safety and peace of mind.",
                },
                {
                  icon: Award,
                  title: "Best Price Guarantee",
                  description: "Direct connection with guides means better prices without middleman fees.",
                },
                {
                  icon: Heart,
                  title: "Personalized Experiences",
                  description: "Custom tours tailored to your interests, pace, and travel style.",
                },
                {
                  icon: TrendingUp,
                  title: "24/7 Support",
                  description: "Our dedicated team is always here to help you before, during, and after your tour.",
                },
              ].map((feature) => (
                <Card key={feature.title} className="border-0 bg-muted/30">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Travelers Say</h2>
              <p className="mt-4 text-lg text-muted-foreground">Real experiences from real travelers</p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  location: "USA",
                  rating: 5,
                  comment:
                    "Marco showed us hidden spots in Rome we never would have found on our own. Absolutely incredible experience!",
                  tour: "Hidden Rome Food Tour",
                  image: "/woman-traveler.png",
                },
                {
                  name: "David Chen",
                  location: "Singapore",
                  rating: 5,
                  comment:
                    "Sophie made Paris magical! Her photography tips and local insights were invaluable. Highly recommend!",
                  tour: "Paris Photography Walk",
                  image: "/asian-man-traveler.jpg",
                },
                {
                  name: "Emma Wilson",
                  location: "UK",
                  rating: 5,
                  comment:
                    "Yuki took us to the best local restaurants in Tokyo. This was the highlight of our entire trip!",
                  tour: "Tokyo Night Food Adventure",
                  image: "/british-woman-traveler.jpg",
                },
              ].map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 text-primary">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary" />
                      ))}
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">"{testimonial.comment}"</p>
                    <div className="mt-6 flex items-center gap-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Tour: {testimonial.tour}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Become a Guide */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80">
              <CardContent className="p-12 text-center">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                  Share Your City, Earn Money
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/90 leading-relaxed">
                  Join thousands of local guides earning income by sharing their passion and knowledge. Turn your
                  expertise into a thriving business.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/become-guide">
                    <Button size="lg" variant="secondary" className="h-12 px-8">
                      Become a Guide
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/guide-info">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 border-primary-foreground/20 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
