"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SERVICE_FEE } from "@/constants/service-fee";
import {
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Tag,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
    paymentStatus?: string; // Payment status (UNPAID, PAID, etc.)
    stripePaymentIntentId?: string | null; // Stripe payment intent ID
  };
  onSuccess?: () => void;
  userRole?: "TOURIST" | "GUIDE" | "ADMIN"; // User role to determine which actions to show
  onMarkAsCompleted?: (bookingId: string) => void; // Callback for marking booking as completed (for guides)
}

export function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
  userRole,
  onMarkAsCompleted,
}: BookingDetailsModalProps) {
  const router = useRouter();

  if (!booking) return null;

  const isConfirmed = booking.status.toUpperCase() === "CONFIRMED";
  const isCompleted = booking.status.toUpperCase() === "COMPLETED";
  const isUnpaid =
    booking.paymentStatus?.toUpperCase() === "UNPAID" || !booking.paymentStatus;
  // Only show Pay Now button for tourists
  const showPayButton = isConfirmed && isUnpaid && userRole === "TOURIST";
  // Show Mark as Completed button for guides on CONFIRMED bookings
  const showCompleteButton =
    isConfirmed && !isCompleted && userRole === "GUIDE" && onMarkAsCompleted;

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
              {booking.paymentStatus?.toUpperCase() === "PAID" && (
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="default" className="text-xs">
                    {booking.paymentStatus}
                  </Badge>
                </div>
              )}
              {booking.paymentStatus?.toUpperCase() === "PAID" &&
                booking.stripePaymentIntentId && (
                  <div className="pt-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Payment Intent ID
                    </div>
                    <div className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded break-all">
                      {booking.stripePaymentIntentId}
                    </div>
                  </div>
                )}
            </div>

            {showPayButton && (
              <>
                <Separator />
                <Button
                  onClick={() => {
                    router.push(`/payment/${booking.id}`);
                    onClose();
                  }}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </>
            )}

            {showCompleteButton && (
              <>
                <Separator />
                <Button
                  onClick={() => {
                    onMarkAsCompleted?.(booking.id);
                    onClose();
                  }}
                  className="w-full"
                  size="lg"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
