"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Copy, Lock, MapPin } from "lucide-react";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { useFormatGps } from "@/hooks/useFormatGps";
import { toast } from "sonner";

type LocationSectionProps = {
  fieldName: string | null;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  showLocation: boolean;
};

export function LocationSection({
  latitude,
  longitude,
  showLocation,
}: LocationSectionProps) {
  const { data, isLoading } = useReverseGeocode(latitude, longitude);
  const { formattedCoords, copyToClipboard } = useFormatGps(
    latitude,
    longitude,
  );

  const handleCopy = () => {
    copyToClipboard();
    toast.success("coordonnées copiées dans le presse-papier");
  };

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
          <MapPin className="h-5 w-5" />
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
                <span className="font-medium">adresse: </span>
                {isLoading ? (
                  <span className="text-muted-foreground italic">
                    chargement...
                  </span>
                ) : (
                  data?.formattedAddress
                )}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground">
                  <span className="font-medium">coordonnées gps: </span>
                  {formattedCoords}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopy}
                  title="copier les coordonnées"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
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
              <Button variant="outline" size="sm">
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
