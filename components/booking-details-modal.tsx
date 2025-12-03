"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, CalendarDays, Users, MessageCircle, Phone } from "lucide-react"

interface BookingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  booking?: {
    id: number
    tourTitle: string
    guide: string
    date: string
    time: string
    guests: number
    price: number
    status: string
    location: string
    meetingPoint: string
    guidePhone?: string
    confirmationNumber?: string
  }
}

export function BookingDetailsModal({ isOpen, onClose, booking }: BookingDetailsModalProps) {
  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Confirmation #{booking.confirmationNumber || "BK-" + booking.id.toString().padStart(6, "0")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{booking.tourTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Hosted by {booking.guide}</p>
            <Badge className="mt-2" variant={booking.status === "confirmed" ? "default" : "secondary"}>
              {booking.status}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Date & Time</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-muted-foreground">{booking.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Number of Guests</div>
                <div className="text-sm text-muted-foreground">
                  {booking.guests} {booking.guests === 1 ? "person" : "people"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Meeting Point</div>
                <div className="text-sm text-muted-foreground">{booking.meetingPoint}</div>
                <Button variant="link" className="h-auto p-0 text-sm">
                  View on map
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${booking.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span className="text-foreground">${Math.round(booking.price * 0.1)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">
                ${booking.price + Math.round(booking.price * 0.1)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Need Help?</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Guide
              </Button>
              {booking.guidePhone && (
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Guide
                </Button>
              )}
            </div>
          </div>

          {booking.status === "confirmed" && (
            <Button variant="destructive" className="w-full">
              Cancel Booking
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
