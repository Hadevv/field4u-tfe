"use client";

import { toast } from "sonner";
import { env } from "@/lib/env";

export type GeoPosition = {
  latitude: number;
  longitude: number;
};

export type GeolocationResult = {
  city: string;
  latitude: number;
  longitude: number;
  postalCode?: string;
  country?: string;
  street?: string;
  streetNumber?: string;
  formattedAddress?: string;
  source: "geolocation" | "user_prefs" | "none";
  success: boolean;
};

export type UserLocationPreferences = {
  city?: string | null;
  postalCode?: string | null;
  acceptGeolocation?: boolean;
};

const EMPTY_LOCATION: GeolocationResult = {
  city: "",
  latitude: 0,
  longitude: 0,
  source: "none",
  success: false,
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h en ms

// fonctions compatibles avec l'ancien code
export async function getGeolocation(): Promise<{ lat: number; lng: number }> {
  const position = await LocationService.getCurrentPosition();
  if (!position) {
    throw new Error("géolocalisation non supportée par ce navigateur");
  }
  return {
    lat: position.latitude,
    lng: position.longitude,
  };
}

export async function reverseGeocode(position: {
  lat: number;
  lng: number;
}): Promise<{
  postalCode?: string;
  city?: string;
  country?: string;
}> {
  const result = await LocationService.getLocationInfo(
    position.lat,
    position.lng,
  );
  return {
    postalCode: result.postalCode,
    city: result.city,
    country: result.country,
  };
}

export const LocationService = {
  /**
   * récupère la position actuelle via l'api navigator.geolocation
   * @param showErrors afficher les erreurs de géolocalisation
   * @returns coordonnées ou null en cas d'erreur
   */
  getCurrentPosition(showErrors = true): Promise<GeoPosition | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        if (showErrors) {
          toast.error(
            "la géolocalisation n'est pas supportée par votre navigateur",
          );
        }
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
        (error) => {
          if (showErrors) {
            let errorMessage =
              "impossible de récupérer votre position actuelle";

            if (error.code === 1) {
              errorMessage =
                "vous avez refusé la permission de géolocalisation";
            } else if (error.code === 2) {
              errorMessage = "position indisponible, veuillez réessayer";
            } else if (error.code === 3) {
              errorMessage =
                "la demande de position a expiré, veuillez réessayer";
            }

            toast.error(errorMessage);
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 60000,
        },
      );
    });
  },

  /**
   * obtient les informations de localisation à partir des coordonnées
   * utilise nominatim (openstreetmap)
   * @param latitude latitude
   * @param longitude longitude
   * @returns informations de localisation
   */
  async getLocationInfo(
    latitude: number,
    longitude: number,
  ): Promise<GeolocationResult> {
    try {
      const cacheKey = `geo_${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
      const cachedResult = this.getFromCache(cacheKey);

      if (cachedResult) {
        return cachedResult;
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=fr`,
        {
          headers: {
            "User-Agent": "Field4u-App/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "erreur lors de la récupération des données de localisation",
        );
      }

      const data = await response.json();
      const address = data.address;

      if (!address) {
        return EMPTY_LOCATION;
      }

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.suburb ||
        "";

      if (!city) {
        return EMPTY_LOCATION;
      }

      const postalCode = address.postcode || undefined;
      const country = address.country || undefined;
      const street = address.road || address.street || undefined;
      const streetNumber = address.house_number || undefined;

      // création d'une adresse formatée
      let formattedAddress = "";
      if (streetNumber || street) {
        formattedAddress += `${streetNumber || ""} ${street || ""}`.trim();
      }
      if (formattedAddress && (city || postalCode)) {
        formattedAddress += ", ";
      }
      if (postalCode || city) {
        formattedAddress += `${postalCode || ""} ${city || ""}`.trim();
      }

      const result: GeolocationResult = {
        city,
        latitude,
        longitude,
        postalCode,
        country,
        street,
        streetNumber,
        formattedAddress: formattedAddress || data.display_name,
        source: "geolocation",
        success: true,
      };

      this.saveToCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error("erreur de géocodage:", error);
      return EMPTY_LOCATION;
    }
  },

  /**
   * recherche d'adresse avec mapbox
   * @param query terme de recherche
   * @returns coordonnées et informations de localisation
   */
  async searchLocation(query: string): Promise<GeolocationResult | null> {
    if (!query.trim()) return null;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1&country=be,fr,lu,nl,de&language=fr`,
      );

      if (!response.ok) {
        throw new Error("erreur de geocoding");
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const locationInfo = await this.getLocationInfo(latitude, longitude);
        return locationInfo;
      }

      return null;
    } catch (error) {
      console.error("erreur lors de la recherche d'adresse:", error);
      return null;
    }
  },

  /**
   * sauvegarde un résultat dans le cache local
   */
  saveToCache(key: string, result: GeolocationResult): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          key,
          JSON.stringify({
            ...result,
            timestamp: Date.now(),
          }),
        );
      }
    } catch (error) {
      console.warn("impossible de mettre en cache la géolocalisation:", error);
    }
  },

  /**
   * récupère un résultat depuis le cache local
   */
  getFromCache(key: string): GeolocationResult | null {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        const timestamp = parsed.timestamp;

        // cache valide pendant 24h
        if (Date.now() - timestamp < CACHE_DURATION) {
          const { timestamp: _, ...result } = parsed;
          return result as GeolocationResult;
        }
      }
    } catch (error) {
      console.warn("erreur lors de la récupération du cache:", error);
    }

    return null;
  },
};
