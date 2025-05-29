import { useQuery } from "@tanstack/react-query";
import { LocationService, GeolocationResult } from "@/lib/geo/location-utils";

// utiliser dans la section localisation d'une annonce de glanage
export function useReverseGeocode(lat: number, lng: number) {
  return useQuery<GeolocationResult>({
    queryKey: ["reverse-geocode", lat, lng],
    queryFn: () => LocationService.getLocationInfo(lat, lng),
    enabled: !!lat && !!lng,
  });
}
