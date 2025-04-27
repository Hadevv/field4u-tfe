"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, InfoIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DonationSectionProps = {
  participationId: string;
  suggestedPrice?: number;
};

export function DonationSection({
  participationId,
  suggestedPrice = 5,
}: DonationSectionProps) {
  const [amount, setAmount] = useState<number>(suggestedPrice);
  const router = useRouter();

  // mettre à jour le montant lorsque le prix suggéré change
  useEffect(() => {
    if (suggestedPrice) {
      setAmount(suggestedPrice);
    }
  }, [suggestedPrice]);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!amount || amount < 1 || amount > 500) {
        throw new Error("montant invalide");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participationId,
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "erreur lors du paiement");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      if (data && data.clientSecret) {
        router.push(`/payment?payment_intent=${data.clientSecret}`);
      } else {
        toast.error("réponse de paiement invalide");
      }
    },
    onError: (error: Error) => {
      console.error("erreur de paiement:", error);
      toast.error("erreur lors du traitement du paiement", {
        description: error.message || "veuillez réessayer plus tard",
      });
    },
  });

  const isValidAmount = amount && amount >= 1 && amount <= 500;

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader className="bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
          <Heart className="h-5 w-5 text-red-500" />
          soutenez cette initiative
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          faites un don pour soutenir le glanage et l'agriculture locale
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="p-4 bg-muted/10 rounded-lg border border-border text-center mb-4">
          {suggestedPrice > 0 && (
            <p className="text-sm mb-3 text-foreground">
              prix suggéré: <span className="font-bold">{suggestedPrice}€</span>
            </p>
          )}
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                max={500}
                step={0.5}
                className="text-center pr-7 font-semibold"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold">
                €
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    montant minimum: 1€
                    <br />
                    montant maximum: 500€
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground">
            ce don contribue à maintenir la plateforme et aide les agriculteurs
            locaux
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 pt-2 px-4 pb-4">
        <Button
          className="w-full"
          onClick={() => checkoutMutation.mutate()}
          disabled={checkoutMutation.isPending || !isValidAmount}
        >
          {checkoutMutation.isPending
            ? "traitement..."
            : `payer ${isValidAmount ? amount : "0"}€`}
        </Button>
      </CardFooter>
    </Card>
  );
}
