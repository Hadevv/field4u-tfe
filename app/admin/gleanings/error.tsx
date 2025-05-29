"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">une erreur est survenue</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        impossible de charger les informations sur les glanages. veuillez
        réessayer ultérieurement.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={reset} variant="outline" size="sm">
          réessayer
        </Button>
        <Button asChild size="sm">
          <Link href="/admin/dashboard">retour au dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
