"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

type LocationDetectorProps = {
  onLocationDetected: (cityName: string) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
};

// service de géo
const LocationService = {
  getCurrentPosition: (
    highAccuracy = false,
  ): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve(null);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  },

  // localisation à partir des coordonnées
  getLocationInfo: async (
    latitude: number,
    longitude: number,
  ): Promise<{
    success: boolean;
    city: string | null;
    fallbackCity: string | null;
  }> => {
    try {
      // utiliser l'API Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la requête de géocodage inverse");
      }

      const data = await response.json();

      let city = null;
      let fallbackCity = null;

      if (data.address) {
        city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.municipality ||
          data.address.suburb;

        fallbackCity =
          data.address.county ||
          data.address.state_district ||
          data.address.state;

        if (!city && fallbackCity) {
          city = fallbackCity;
        }

        if (!city && data.name) {
          city = data.name;
        }
      }

      return {
        success: !!city,
        city,
        fallbackCity,
      };
    } catch (error) {
      console.error("Erreur de géocodage inverse:", error);
      return { success: false, city: null, fallbackCity: null };
    }
  },
};

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
      // utiliser la geo du navigateur
      const position = await LocationService.getCurrentPosition(true);

      if (!position) {
        toast.error("impossible de déterminer votre position actuelle");
        setIsLoading(false);
        return;
      }

      // localisation a partir des coos
      const locationResult = await LocationService.getLocationInfo(
        position.latitude,
        position.longitude,
      );

      if (locationResult.success && locationResult.city) {
        toast.success(`position détectée : ${locationResult.city}`);
        onLocationDetected(locationResult.city);
      } else {
        toast.error("impossible de déterminer votre localité");
      }
    } catch (error) {
      console.error("erreur de géolocalisation:", error);
      toast.error("une erreur est survenue lors de la géolocalisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
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
      {isLoading ? "localisation..." : "ma position"}
    </Button>
  );
}
