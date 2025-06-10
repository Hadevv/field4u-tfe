import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { LocationService } from "@/lib/geo/location-utils";

type LocationDetectorProps = {
  onLocationDetected: (cityName: string) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
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
      const position = await LocationService.getCurrentPosition();

      if (!position) {
        setIsLoading(false);
        return;
      }

      // localisation a partir des coordonnées
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
        <Loader2 className="h-4 w-4 animate-spin mr-2" size={size} />
      ) : (
        <MapPin className="h-4 w-4 mr-2" size={size} />
      )}
      {isLoading ? "localisation..." : "ma position"}
    </Button>
  );
}
