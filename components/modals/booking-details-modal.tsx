"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, CalendarDays, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateBookingStatus } from "@/services/booking/booking.service"

interface BookingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  booking?: {
    id: string // Actual booking ID from API
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
  onSuccess?: () => void
}

export function BookingDetailsModal({ isOpen, onClose, booking, onSuccess }: BookingDetailsModalProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  if (!booking) return null

  // Check if booking can be canceled (only CONFIRMED status)
  const bookingStatus = booking.status.toUpperCase()
  const canCancel = bookingStatus === "CONFIRMED"

  const handleCancelBooking = async () => {
    if (!booking.id) return

    try {
      setIsCancelling(true)
      const result = await updateBookingStatus({ id: booking.id, status: "CANCELLED" })

      if (result.success) {
        toast.success("Booking canceled successfully. The date is now available for booking.")
        setIsCancelDialogOpen(false)
        onClose()
        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(result.message || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error canceling booking:", error)
      toast.error("An error occurred while canceling the booking")
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Confirmation #{booking.confirmationNumber || booking.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{booking.tourTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Hosted by {booking.guide}</p>
              <Badge
                className="mt-2"
                variant={
                  booking.status.toUpperCase() === "CONFIRMED"
                    ? "default"
                    : booking.status.toUpperCase() === "COMPLETED"
                      ? "outline"
                      : booking.status.toUpperCase() === "CANCELLED"
                        ? "destructive"
                        : "secondary"
                }
              >
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

            {canCancel && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? Once canceled, the date will become available for other bookings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
