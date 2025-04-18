"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LocationDetector } from "./LocationDetector";
import { useRef, useEffect } from "react";

type LocationFieldProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  radius: string;
  onRadiusChange: (radius: string) => void;
};

export function LocationField({
  value,
  onChange,
  radius,
  onRadiusChange,
}: LocationFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  // fonction pour effacer la localisation
  const clearLocation = () => {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // gestion du bouton de geo
  const handleLocationDetected = (cityName: string) => {
    onChange(cityName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue === "" ? null : inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clearLocation();
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">recherche par lieu</h4>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearLocation}
            >
              <X className="h-3 w-3 mr-1" />
              effacer
            </Button>
          )}
        </div>
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="ville, code postal..."
            value={value || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pr-8"
            aria-label="entrer une localisation"
          />
          {value && (
            <button
              type="button"
              onClick={clearLocation}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="effacer la recherche par lieu"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">effacer</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">position actuelle</span>
        <LocationDetector
          onLocationDetected={handleLocationDetected}
          variant="outline"
          size="sm"
        />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">rayon de recherche: {radius} km</h4>
        <div className="grid grid-cols-4 gap-2">
          {["10", "25", "50", "100"].map((radiusValue) => (
            <Button
              key={radiusValue}
              type="button"
              size="sm"
              variant={radius === radiusValue ? "default" : "outline"}
              onClick={() => onRadiusChange(radiusValue)}
              aria-label={`rayon de ${radiusValue} km`}
            >
              {radiusValue}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
