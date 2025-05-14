"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

export function StripePaymentClient({
  clientSecret,
}: {
  clientSecret: string;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#10b981",
            borderRadius: "6px",
          },
        },
      }}
    >
      <PaymentForm />
    </Elements>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("impossible de charger stripe", {
        description: "veuillez rafraîchir la page et réessayer",
      });
      return;
    }

    setIsLoading(true);

    try {
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });
      setIsLoading(false);
    } catch (error) {
      console.error("erreur lors du paiement", error);
      toast.error("une erreur est survenue", {
        description: "veuillez réessayer plus tard",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button
          size="sm"
          type="submit"
          className="w-full"
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? "traitement en cours..." : "payer"}
        </Button>
      </form>
    </div>
  );
}
