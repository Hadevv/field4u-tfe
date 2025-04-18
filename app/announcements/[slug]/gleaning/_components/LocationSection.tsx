"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Lock, MapPin } from "lucide-react";

type LocationSectionProps = {
  fieldName: string | null;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  showLocation: boolean;
};

export function LocationSection({
  fieldName,
  city,
  postalCode,
  latitude,
  longitude,
  showLocation,
}: LocationSectionProps) {
  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          lieu du glanage
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          informations sur l'emplacement du glanage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showLocation ? (
          <>
            <div className="mb-4 space-y-2">
              <p className="text-sm text-foreground">
                <span className="font-medium">adresse:</span> {fieldName},{" "}
                {postalCode} {city}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">coordonnées gps:</span>{" "}
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            </div>
            <div className="aspect-video relative rounded-lg overflow-hidden border mb-4">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                className="absolute inset-0"
              ></iframe>
            </div>
          </>
        ) : (
          <div className="p-6 text-center space-y-4 bg-muted/20 rounded-lg">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium mb-1 text-foreground">
                lieu masqué pour le moment
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                les informations de localisation seront dévoilées 24h avant le
                glanage
              </p>
              <Button variant="outline" className="mx-auto">
                <Bell className="size-4" />
                être notifié 24h avant
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
