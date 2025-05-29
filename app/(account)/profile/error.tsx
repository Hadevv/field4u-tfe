"use client";

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SignInButton } from "@/features/auth/SignInButton";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";
import Link from "next/link";

export default function RouteError({ error }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  const isStripeError =
    error.message?.includes("Stripe") ||
    error.message?.includes("configuration");

  if (isStripeError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Problème de configuration stripe</CardTitle>
          <CardDescription>
            Le portail client stripe n'a pas été configuré correctement.
            veuillez contacter l'administrateur ou configurer le portail client
            dans le tableau de bord stripe.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            retour à l'accueil
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          vous devez être connecté pour accéder à cette ressource
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <SignInButton variant="outline" size="sm" />
      </CardFooter>
    </Card>
  );
}
