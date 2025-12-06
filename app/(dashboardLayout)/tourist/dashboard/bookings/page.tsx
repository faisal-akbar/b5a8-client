"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, MapPin, Star, Users, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function TouristBookingsPage() {
  const upcomingBookings = [
    {
      id: 1,
      tour: {
        title: "Tokyo Street Food Adventure",
        image: "/placeholder.svg?key=tour1",
        location: "Tokyo, Japan",
      },
      guide: {
        name: "Yuki Tanaka",
        rating: 5.0,
      },
      date: "2024-01-20",
      time: "6:00 PM",
      guests: 2,
      price: 240,
      status: "confirmed",
    },
    {
      id: 2,
      tour: {
        title: "Paris Photography Walk",
        image: "/placeholder.svg?key=tour2",
        location: "Paris, France",
      },
      guide: {
        name: "Sophie Chen",
        rating: 4.8,
      },
      date: "2024-02-05",
      time: "9:00 AM",
      guests: 1,
      price: 95,
      status: "confirmed",
    },
  ]

  const pendingBookings = [
    {
      id: 3,
      tour: {
        title: "Ancient Rome History Tour",
        image: "/placeholder.svg?key=tour3",
        location: "Rome, Italy",
      },
      guide: {
        name: "Marco Rossi",
        rating: 5.0,
      },
      date: "2024-02-15",
      time: "10:00 AM",
      guests: 3,
      price: 330,
      status: "pending",
    },
  ]

  const pastBookings = [
    {
      id: 4,
      tour: {
        title: "Barcelona Market & Tapas",
        image: "/placeholder.svg?key=tour4",
        location: "Barcelona, Spain",
      },
      guide: {
        name: "Elena Garcia",
        rating: 4.9,
      },
      date: "2023-12-10",
      time: "11:00 AM",
      guests: 2,
      price: 150,
      status: "completed",
      reviewed: false,
    },
    {
      id: 5,
      tour: {
        title: "Dubai Modern Architecture",
        image: "/placeholder.svg?key=tour5",
        location: "Dubai, UAE",
      },
      guide: {
        name: "Ahmed Al Maktoum",
        rating: 4.7,
      },
      date: "2023-11-25",
      time: "2:00 PM",
      guests: 4,
      price: 600,
      status: "completed",
      reviewed: true,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="mt-2 text-muted-foreground">Manage and view your tour bookings</p>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="upcoming">
                Upcoming
                <Badge className="ml-2" variant="secondary">
                  {upcomingBookings.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                {pendingBookings.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {pendingBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            {/* Upcoming */}
            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row">
                      <div className="relative h-40 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48">
                        <img
                          src={booking.tour.image || "/placeholder.svg"}
                          alt={booking.tour.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link href={`/tours/${booking.id}`}>
                                <h3 className="font-semibold text-foreground hover:text-primary">
                                  {booking.tour.title}
                                </h3>
                              </Link>
                              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {booking.tour.location}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                Guide: {booking.guide.name}
                                <Star className="ml-1 h-3 w-3 fill-primary text-primary" />
                                {booking.guide.rating}
                              </p>
                            </div>
                            <Badge>{booking.status}</Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-foreground">${booking.price}</span>
                            <span className="ml-2 text-sm text-muted-foreground">Total</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Contact Guide
                            </Button>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Pending */}
            <TabsContent value="pending" className="mt-6 space-y-4">
              {pendingBookings.map((booking) => (
                <Card key={booking.id} className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row">
                      <div className="relative h-40 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48">
                        <img
                          src={booking.tour.image || "/placeholder.svg"}
                          alt={booking.tour.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">{booking.tour.title}</h3>
                              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {booking.tour.location}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">Guide: {booking.guide.name}</p>
                            </div>
                            <Badge variant="secondary">{booking.status}</Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">
                            Waiting for guide to confirm your booking request
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-foreground">${booking.price}</span>
                            <span className="ml-2 text-sm text-muted-foreground">Total</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Cancel Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Past */}
            <TabsContent value="past" className="mt-6 space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row">
                      <div className="relative h-40 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48">
                        <img
                          src={booking.tour.image || "/placeholder.svg"}
                          alt={booking.tour.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">{booking.tour.title}</h3>
                              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {booking.tour.location}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">Guide: {booking.guide.name}</p>
                            </div>
                            <Badge variant="secondary">{booking.status}</Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-foreground">${booking.price}</span>
                          </div>
                          {!booking.reviewed ? (
                            <Button size="sm">
                              <Star className="mr-2 h-4 w-4" />
                              Write a Review
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              View Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
