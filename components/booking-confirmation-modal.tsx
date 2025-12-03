"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  bookingDetails?: {
    tourTitle: string
    date: string
    guests: number
    total: number
  }
}

export function BookingConfirmationModal({ isOpen, onClose, bookingDetails }: BookingConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">Booking Request Sent!</DialogTitle>
          <DialogDescription className="text-center">
            Your booking request has been sent to the guide. You'll receive a notification once they respond.
          </DialogDescription>
        </DialogHeader>

        {bookingDetails && (
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <h4 className="font-semibold text-foreground">Booking Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tour:</span>
                <span className="font-medium text-foreground">{bookingDetails.tourTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-medium text-foreground">{bookingDetails.guests}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="font-bold text-foreground">${bookingDetails.total}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Link href="/bookings" className="w-full">
            <Button className="w-full">View My Bookings</Button>
          </Link>
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Continue Browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
