"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { LocationService } from "@/lib/geo/location-service";

interface LocationDetectorProps {
  onLocationDetected: (cityName: string) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function LocationDetector({
  onLocationDetected,
  className,
  variant = "outline",
  size = "sm",
  disabled = false,
}: LocationDetectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = async () => {
    setIsLoading(true);

    try {
      // Utiliser la géolocalisation du navigateur
      const position = await LocationService.getCurrentPosition(true);

      if (!position) {
        toast.error("Impossible de déterminer votre position actuelle");
        setIsLoading(false);
        return;
      }

      // Obtenir les informations de localisation à partir des coordonnées
      const locationResult = await LocationService.getLocationInfo(
        position.latitude,
        position.longitude,
      );

      if (locationResult.success && locationResult.city) {
        toast.success(`Position détectée : ${locationResult.city}`);
        onLocationDetected(locationResult.city);
      } else {
        toast.error("Impossible de déterminer votre position");
      }
    } catch (error) {
      console.error("Erreur de géolocalisation:", error);
      toast.error("Une erreur est survenue lors de la géolocalisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleGetLocation}
      disabled={disabled || isLoading}
      type="button"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <MapPin className="h-4 w-4 mr-2" />
      )}
      {isLoading ? "Localisation..." : "Ma position"}
    </Button>
  );
}
