"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function GleaningError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl">erreur de glanage</CardTitle>
          <CardDescription>
            impossible d'accéder à cette session de glanage
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            message d'erreur:
          </p>
          <div className="bg-muted p-3 rounded-md text-sm overflow-auto">
            {error.message || "erreur inconnue"}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button asChild variant="outline" size="sm">
            <Link href={`/announcements/${slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              retour à l'annonce
            </Link>
          </Button>
          <Button onClick={reset} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            réessayer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
