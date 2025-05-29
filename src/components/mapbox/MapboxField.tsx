"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocationService, GeolocationResult } from "@/lib/geo/location-utils";
import { MAP_STYLE, FIELD_ZOOM } from "@/lib/mapbox/mapbox-config";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/lib/env";

type MapboxFieldProps = {
  initialLatitude: number;
  initialLongitude: number;
  onLocationChange: (
    lat: number,
    lng: number,
    locationInfo?: GeolocationResult,
  ) => void;
};

export function MapboxField({
  initialLatitude,
  initialLongitude,
  onLocationChange,
}: MapboxFieldProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const createCustomMarkerElement = () => {
    // créer le marqueur
    const element = document.createElement("div");
    element.className = "field-marker";
    Object.assign(element.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "grab",
    });

    const markerCircle = document.createElement("div");
    Object.assign(markerCircle.style, {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "#094e3a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 0 4px rgba(9, 78, 58, 0.3)",
      transition: "all 0.3s ease",
      zIndex: "10",
    });

    const wheatSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    wheatSvg.setAttribute("width", "18");
    wheatSvg.setAttribute("height", "18");
    wheatSvg.setAttribute("viewBox", "0 0 24 24");
    wheatSvg.setAttribute("fill", "none");
    wheatSvg.setAttribute("stroke", "white");
    wheatSvg.setAttribute("stroke-width", "2");
    wheatSvg.setAttribute("stroke-linecap", "round");
    wheatSvg.setAttribute("stroke-linejoin", "round");

    // chemin pour l'icône wheat
    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path1.setAttribute("d", "M2 22 16 8");
    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path2.setAttribute(
      "d",
      "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
    );
    const path3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path3.setAttribute(
      "d",
      "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
    );
    const path4 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path4.setAttribute(
      "d",
      "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
    );
    const path5 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path5.setAttribute("d", "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z");
    const path6 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path6.setAttribute(
      "d",
      "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
    );
    const path7 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path7.setAttribute(
      "d",
      "M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
    );
    const path8 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path8.setAttribute(
      "d",
      "M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
    );

    // ajouter tous les chemins au svg
    wheatSvg.appendChild(path1);
    wheatSvg.appendChild(path2);
    wheatSvg.appendChild(path3);
    wheatSvg.appendChild(path4);
    wheatSvg.appendChild(path5);
    wheatSvg.appendChild(path6);
    wheatSvg.appendChild(path7);
    wheatSvg.appendChild(path8);

    markerCircle.appendChild(wheatSvg);
    element.appendChild(markerCircle);

    // pointe en bas pour le ciblage précis
    const pointerTriangle = document.createElement("div");
    Object.assign(pointerTriangle.style, {
      width: "0",
      height: "0",
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderTop: "10px solid #094e3a",
      marginTop: "-1px",
      zIndex: "9",
    });
    element.appendChild(pointerTriangle);

    return element;
  };

  // init de la map
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [initialLongitude, initialLatitude],
      zoom: FIELD_ZOOM,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // ajout du marqueur personnalisé
    marker.current = new mapboxgl.Marker({
      element: createCustomMarkerElement(),
      anchor: "bottom",
      draggable: true,
    })
      .setLngLat([initialLongitude, initialLatitude])
      .addTo(map.current);

    marker.current.on("dragend", async () => {
      if (!marker.current) return;

      const lngLat = marker.current.getLngLat();
      const locationInfo = await LocationService.getLocationInfo(
        lngLat.lat,
        lngLat.lng,
      );
      onLocationChange(lngLat.lat, lngLat.lng, locationInfo);
    });

    map.current.on("load", () => {
      map.current?.on("click", async (e) => {
        if (!marker.current) return;
        marker.current.setLngLat(e.lngLat);
        const locationInfo = await LocationService.getLocationInfo(
          e.lngLat.lat,
          e.lngLat.lng,
        );
        onLocationChange(e.lngLat.lat, e.lngLat.lng, locationInfo);
      });
    });
  }, [initialLatitude, initialLongitude, onLocationChange]);

  useEffect(() => {
    if (!map.current || !marker.current) return;
    marker.current.setLngLat([initialLongitude, initialLatitude]);
    map.current.setCenter([initialLongitude, initialLatitude]);
  }, [initialLatitude, initialLongitude]);

  const searchLocation = async () => {
    if (!searchValue.trim() || !map.current || !marker.current) return;

    try {
      const result = await LocationService.searchLocation(searchValue);

      if (result && result.success) {
        const { latitude, longitude } = result;

        marker.current.setLngLat([longitude, latitude]);
        map.current.flyTo({ center: [longitude, latitude], zoom: 16 });

        onLocationChange(latitude, longitude, result);
      }
    } catch (error) {
      console.error("erreur lors de la recherche d'adresse:", error);
    }
  };

  const useCurrentLocation = async () => {
    const coords = await LocationService.getCurrentPosition();

    if (coords && map.current && marker.current) {
      marker.current.setLngLat([coords.longitude, coords.latitude]);
      map.current.flyTo({
        center: [coords.longitude, coords.latitude],
        zoom: 16,
      });

      const locationInfo = await LocationService.getLocationInfo(
        coords.latitude,
        coords.longitude,
      );
      onLocationChange(coords.latitude, coords.longitude, locationInfo);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="rechercher une adresse..."
            onKeyDown={(e) => e.key === "Enter" && searchLocation()}
            className="pr-8"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={searchLocation}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={useCurrentLocation}
        >
          ma position
        </Button>
      </div>

      <div ref={mapContainer} className="h-[400px] w-full rounded-md border" />

      <p className="text-xs text-muted-foreground">
        positionnez précisément le marqueur sur votre champ en le faisant
        glisser ou en cliquant sur la carte
      </p>
    </div>
  );
}
