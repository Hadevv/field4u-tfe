"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "@/features/layout/ContentSection";
import { MapPin, CreditCard, MessageSquare, Paperclip } from "lucide-react";

export default function GleaningLoading() {
  return (
    <div className="p-6 pb-20">
      <ContentSection>
        {/* Status skeleton */}
        <Skeleton className="h-20 w-full mb-6 rounded-lg bg-muted/30" />

        {/* Barre de progression skeleton */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-1/3 bg-muted/30" />
            <Skeleton className="h-4 w-24 bg-muted/30" />
          </div>
          <Skeleton className="h-2 w-full bg-muted/30" />
        </div>

        {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-6">
            {/* Bloc 1: Localisation */}
            <Card className="overflow-hidden border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  lieu du glanage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full rounded-lg bg-muted/30" />
                </div>
              </CardContent>
            </Card>

            {/* Bloc 2: Paiement */}
            <Card className="overflow-hidden border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  soutenez cette initiative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-lg mb-4 bg-muted/30" />
                <Skeleton className="h-10 w-full rounded-md bg-muted/30" />
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            {/* Bloc 3: Chat */}
            <Card className="overflow-hidden border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-lg bg-muted/30" />
                </div>
              </CardContent>
            </Card>

            {/* Bloc 4: Règles */}
            <Card className="overflow-hidden border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                  <Paperclip className="h-5 w-5 text-primary" />
                  règles du glanage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <Skeleton className="h-8 w-8 rounded-full bg-muted/30" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2 bg-muted/30" />
                      <Skeleton className="h-3 w-full bg-muted/30" />
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Skeleton className="h-8 w-8 rounded-full bg-muted/30" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2 bg-muted/30" />
                      <Skeleton className="h-3 w-full bg-muted/30" />
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Skeleton className="h-8 w-8 rounded-full bg-muted/30" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2 bg-muted/30" />
                      <Skeleton className="h-3 w-full bg-muted/30" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentSection>
    </div>
  );
}
