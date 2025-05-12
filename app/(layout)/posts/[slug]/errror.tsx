"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <Card variant="error">
      <CardHeader>
        <CardTitle>
          désolé, l'article que vous recherchez ne fonctionne pas comme prévu.
          veuillez réessayer plus tard.
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <Button size="sm" onClick={reset}>
          réessayer
        </Button>
      </CardFooter>
    </Card>
  );
}
