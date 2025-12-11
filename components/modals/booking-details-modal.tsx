"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Tag,
  User,
  Users,
} from "lucide-react";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: {
    id: string; // Actual booking ID from API
    tourTitle: string;
    guide: string;
    date: string;
    time: string;
    guests: number;
    numberOfGuests: number;
    price: number;
    status: string;
    location: string;
    meetingPoint: string;
    category?: string;
    durationDays?: number;
    touristName?: string;
    touristEmail?: string;
    createdAt?: string;
    updatedAt?: string;
    guidePhone?: string;
    confirmationNumber?: string;
  };
  onSuccess?: () => void;
}

export function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Confirmation #
              {booking.confirmationNumber || booking.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {booking.tourTitle}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Hosted by {booking.guide}
              </p>
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
                  <div className="text-sm text-muted-foreground">
                    {booking.time}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">
                    Number of Guests
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.numberOfGuests || booking.guests}{" "}
                    {(booking.numberOfGuests || booking.guests) === 1
                      ? "person"
                      : "people"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.location}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">
                    Meeting Point
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.meetingPoint}
                  </div>
                  {/* <Button variant="link" className="h-auto p-0 text-sm">
                    View on map
                  </Button> */}
                </div>
              </div>

              {booking.category && (
                <div className="flex items-start gap-3">
                  <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Category</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.category}
                    </div>
                  </div>
                </div>
              )}

              {booking.durationDays && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Duration</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.durationDays}{" "}
                      {booking.durationDays === 1 ? "day" : "days"}
                    </div>
                  </div>
                </div>
              )}

              {booking.touristName && (
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Tourist</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.touristName}
                    </div>
                    {booking.touristEmail && (
                      <div className="flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {booking.touristEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${booking.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-foreground">
                  ${Math.round(booking.price * SERVICE_FEE)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">
                  ${booking.price + Math.round(booking.price * SERVICE_FEE)}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
