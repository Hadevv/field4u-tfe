"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

//TODO: Stripe
export function DonationSection() {
  const donation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => {
      toast.success("merci pour votre don!", {
        description: "votre participation aide les agriculteurs locaux",
      });
    },
    onError: () => {
      toast.error("erreur lors du traitement du paiement", {
        description: "veuillez réessayer plus tard",
      });
    },
  });

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          soutenez cette initiative
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          faites un don pour soutenir le glanage et l'agriculture locale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/10 rounded-lg border border-border text-center mb-4">
          <p className="text-sm mb-2 text-foreground">
            prix recommandé: <span className="font-bold">5€</span>
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            ce don contribue à maintenir la plateforme et aide les agriculteurs
            locaux
          </p>
        </div>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => donation.mutate()}
          disabled={donation.isPending}
        >
          {donation.isPending ? "traitement..." : "faire un don de 5€"}
        </Button>
      </CardContent>
    </Card>
  );
}
