"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Désolé, une erreur est survenue. Veuillez réessayer plus tard.
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <Button onClick={reset}>Réessayer</Button>
      </CardFooter>
    </Card>
  );
}
