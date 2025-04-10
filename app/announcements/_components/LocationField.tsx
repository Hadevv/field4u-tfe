"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { LocationDetector } from "./LocationDetector";
import { useRouter } from "next/navigation";

interface LocationFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  radius: string;
  onRadiusChange: (radius: string) => void;
}

export function LocationField({
  value,
  onChange,
  radius,
  onRadiusChange,
}: LocationFieldProps) {
  const router = useRouter();

  // Gestion du bouton de géolocalisation
  const handleLocationDetected = (cityName: string) => {
    onChange(cityName);
  };

  // Fonction pour effacer la localisation
  const clearLocation = () => {
    onChange(null);
    router.refresh(); // Rafraîchir pour appliquer immédiatement les changements d'URL
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Recherche par lieu</h4>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearLocation}
            >
              <X className="h-3 w-3 mr-1" />
              Effacer
            </Button>
          )}
        </div>
        <div className="relative">
          <Input
            placeholder="Ville, code postal..."
            value={value || ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="pr-8"
            aria-label="Entrer une localisation"
          />
          {value && (
            <button
              type="button"
              onClick={clearLocation}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche par lieu"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Effacer</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Position actuelle</span>
        <LocationDetector
          onLocationDetected={handleLocationDetected}
          variant="outline"
          size="sm"
        />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Rayon de recherche: {radius} km</h4>
        <div className="grid grid-cols-4 gap-2">
          {["10", "25", "50", "100"].map((radiusValue) => (
            <Button
              key={radiusValue}
              type="button"
              size="sm"
              variant={radius === radiusValue ? "default" : "outline"}
              onClick={() => onRadiusChange(radiusValue)}
              aria-label={`Rayon de ${radiusValue} km`}
            >
              {radiusValue}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
