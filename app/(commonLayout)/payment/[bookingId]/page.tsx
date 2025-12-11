"use client";

import PaymentForm from "@/components/payments/payment-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import stripePromise from "@/lib/stripe";
import { getPaymentIntent } from "@/services/payment/payment.service";
import { Elements } from "@stripe/react-stripe-js";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

type PaymentPageProps = {
  params: Promise<{ bookingId: string }>;
};

export default function PaymentPage({ params }: PaymentPageProps) {
  const { bookingId } = use(params);
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getPaymentIntent(bookingId);

        if (!result.success) {
          throw new Error(result.message || "Failed to get payment intent");
        }

        if (!result.data.clientSecret) {
          throw new Error("Payment intent client secret is missing");
        }

        setClientSecret(result.data.clientSecret);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load payment";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchPaymentIntent();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">
                Loading payment form...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error ||
                  "Unable to load payment form. Please try again later."}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/tourist/dashboard")}
              variant="outline"
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Complete Your Payment
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your payment details securely
          </p>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm bookingId={bookingId} />
        </Elements>
      </div>
    </div>
  );
}
