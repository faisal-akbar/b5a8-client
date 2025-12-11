"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPaymentByBookingId } from "@/services/payment/payment.service";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }

      try {
        const result = await getPaymentByBookingId(bookingId);

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch payment status");
        }

        setPayment(result.data);

        // If payment is successful, automatically redirect to dashboard after a short delay
        const isPaid =
          result.data.paymentStatus === "PAID" ||
          result.data.paymentIntentDetails?.status === "succeeded";

        if (isPaid) {
          toast.success("Payment completed successfully!");
          // Redirect to tourist dashboard after 3 seconds
          setTimeout(() => {
            router.push("/tourist/dashboard");
          }, 3000);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load payment status";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [bookingId, router]);

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Verifying payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Unable to verify payment status"}
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/")} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid =
    payment.paymentStatus === "PAID" ||
    payment.paymentIntentDetails?.status === "succeeded";

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          {isPaid ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                Your payment has been processed successfully
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Payment Pending</CardTitle>
              <CardDescription>Your payment is being processed</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {payment && (
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">
                  ${((payment.amount || 0) / 100).toFixed(2)}{" "}
                  {payment.currency?.toUpperCase() || "USD"}
                </span>
              </div>
              {payment.bookingId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-mono text-sm">{payment.bookingId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold">
                  {payment.paymentStatus || "Unknown"}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/tourist/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

