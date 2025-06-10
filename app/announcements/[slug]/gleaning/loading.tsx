"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CreditCard } from "lucide-react";

export default function GleaningLoading() {
  return (
    <div className="p-4 pb-16">
      {/* composant de progression */}
      <Skeleton className="h-20 w-full mb-6 rounded-lg" />

      {/* navigation par onglets */}
      <div className="w-full">
        <div className="w-full grid grid-cols-3 mb-4">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md mx-1" />
          <Skeleton className="h-10 rounded-md" />
        </div>

        <div className="mt-0">
          <div className="space-y-4">
            {/* section localisation */}
            <Card className="overflow-hidden border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  Lieu du glanage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>

            {/* section donation */}
            <Card className="overflow-hidden border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Soutenez cette initiative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-lg mb-4" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
