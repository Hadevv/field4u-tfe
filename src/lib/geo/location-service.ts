"use client";

import { toast } from "sonner";

export interface GeolocationResult {
  city: string;
  latitude: number;
  longitude: number;
  postalCode?: string;
  country?: string;
  source: "geolocation" | "user_prefs" | "none";
  success: boolean;
}

export interface UserLocationPreferences {
  city?: string | null;
  postalCode?: string | null;
  acceptGeolocation?: boolean;
}

// Résultat quand aucune localisation n'est disponible
const EMPTY_LOCATION: GeolocationResult = {
  city: "",
  latitude: 0,
  longitude: 0,
  source: "none",
  success: false,
};

/**
 * Service de géolocalisation simplifié pour obtenir la position de l'utilisateur
 * et convertir les coordonnées en informations de localisation utilisables
 */
export const LocationService = {
  /**
   * Obtient la position actuelle de l'utilisateur via l'API Geolocation du navigateur
   * @param showErrors - Si true, affiche des messages d'erreur à l'utilisateur
   */
  getCurrentPosition(
    showErrors = true,
  ): Promise<GeolocationCoordinates | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        if (showErrors) {
          toast.error(
            "La géolocalisation n'est pas supportée par votre navigateur.",
          );
        }
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          if (showErrors) {
            let errorMessage =
              "Impossible de récupérer votre position actuelle.";

            if (error.code === 1) {
              errorMessage =
                "Vous avez refusé la permission de géolocalisation.";
            } else if (error.code === 2) {
              errorMessage = "Position indisponible. Veuillez réessayer.";
            } else if (error.code === 3) {
              errorMessage =
                "La demande de position a expiré. Veuillez réessayer.";
            }

            toast.error(errorMessage);
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 60000, // 1 minute - permettre une mise en cache raisonnable
        },
      );
    });
  },

  /**
   * Convertit des coordonnées en informations de localisation via l'API Nominatim
   */
  async getLocationInfo(
    latitude: number,
    longitude: number,
  ): Promise<GeolocationResult> {
    try {
      // Utilisation d'un cache local pour éviter trop d'appels à l'API
      const cacheKey = `geo_${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
      const cachedResult = this.getFromCache(cacheKey);

      if (cachedResult) {
        return cachedResult;
      }

      // Utiliser l'API Nominatim d'OpenStreetMap pour le geocoding inverse
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=fr`,
        {
          headers: {
            // Bonne pratique: ajouter un User-Agent spécifique à l'application
            "User-Agent": "Field4u-App/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données de localisation",
        );
      }

      const data = await response.json();

      // Extraire les informations pertinentes
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.municipality ||
        data.address.suburb ||
        "";

      if (!city) {
        return EMPTY_LOCATION;
      }

      const postalCode = data.address.postcode || undefined;
      const country = data.address.country || undefined;

      const result: GeolocationResult = {
        city,
        latitude,
        longitude,
        postalCode,
        country,
        source: "geolocation",
        success: true,
      };

      // Sauvegarder dans le cache
      this.saveToCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Erreur de géocodage:", error);
      // En cas d'erreur, retourner un résultat vide
      return EMPTY_LOCATION;
    }
  },

  /**
   * Sauvegarde un résultat de géolocalisation dans le cache
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
      console.warn("Impossible de mettre en cache la géolocalisation:", error);
    }
  },

  /**
   * Récupère un résultat de géolocalisation du cache s'il est encore valide
   */
  getFromCache(key: string): GeolocationResult | null {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        const timestamp = parsed.timestamp;

        // Cache valide pendant 24h
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          const { timestamp: _, ...result } = parsed;
          return result as GeolocationResult;
        }
      }
    } catch (error) {
      console.warn("Erreur lors de la récupération du cache:", error);
    }

    return null;
  },
};
