"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, CalendarDays, Users, CreditCard, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BookingCheckoutPage() {
  const router = useRouter()
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Mock booking data
  const booking = {
    tour: {
      title: "Hidden Jazz Bars of New Orleans",
      image: "/placeholder.svg?key=tour1",
      location: "New Orleans, Louisiana, USA",
    },
    guide: {
      name: "Sarah Johnson",
      rating: 4.9,
      reviews: 127,
    },
    date: "2024-01-20",
    time: "7:00 PM",
    guests: 2,
    pricePerPerson: 85,
    meetingPoint: "Jackson Square, in front of St. Louis Cathedral",
  }

  const subtotal = booking.pricePerPerson * booking.guests
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle payment processing
    router.push("/booking/confirmation")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Booking</h1>
          <p className="mt-2 text-muted-foreground">Review your booking details and payment information</p>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row">
            {/* Left - Booking Form */}
            <div className="flex-1 space-y-6">
              {/* Traveler Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground">Traveler Information</h2>
                  <form className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Special Requests (Optional)</Label>
                      <Input id="notes" placeholder="Any special requirements or questions for the guide..." />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground">Payment Information</h2>
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
                        <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Secure Payment</p>
                          <p className="text-xs text-muted-foreground">
                            Your payment information is encrypted and secure
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/cancellation-policy" className="text-primary hover:underline">
                        Cancellation Policy
                      </Link>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full" disabled={!acceptTerms} onClick={handleSubmit}>
                Confirm and Pay ${total}
              </Button>
            </div>

            {/* Right - Booking Summary */}
            <div className="lg:w-96">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-foreground">Booking Summary</h2>

                    <div className="mt-6 flex gap-4">
                      <div className="h-24 w-32 overflow-hidden rounded-lg">
                        <img
                          src={booking.tour.image || "/placeholder.svg"}
                          alt={booking.tour.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{booking.tour.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {booking.tour.location}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">Date & Time</div>
                          <div className="text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-muted-foreground">{booking.time}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">Guests</div>
                          <div className="text-muted-foreground">
                            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${booking.pricePerPerson} × {booking.guests} guests
                        </span>
                        <span className="text-foreground">${subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service fee</span>
                        <span className="text-foreground">${serviceFee}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">${total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Free cancellation</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Cancel up to 24 hours before the tour for a full refund
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
