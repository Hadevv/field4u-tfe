"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@/features/auth/SignInButton";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Vous devez être connecté pour accéder à cette ressource.
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <SignInButton variant="outline" size="lg" />
      </CardFooter>
    </Card>
  );
}
