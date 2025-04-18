"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { MapAnnouncement } from "@/types/announcement";

type MapProps = {
  announcements: MapAnnouncement[];
};

export function AnnouncementMap({ announcements }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [4.3517, 50.8503],
      zoom: 8,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || !announcements.length) return;

    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].remove();
    }

    const bounds = new mapboxgl.LngLatBounds();

    announcements.forEach((announcement) => {
      const { longitude, latitude, title, slug } = announcement;

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = "#10b981";
      el.style.width = "25px";
      el.style.height = "25px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "2px solid white";

      el.addEventListener("click", () => {
        window.location.href = `/announcements/${slug}`;
      });

      new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${title}</h3>`),
        )
        .addTo(map.current!);

      bounds.extend([longitude, latitude]);
    });

    if (announcements.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
      });
    } else if (announcements.length === 1) {
      map.current.flyTo({
        center: [announcements[0].longitude, announcements[0].latitude],
        zoom: 12,
      });
    }
  }, [announcements, mapLoaded]);

  return (
    <Card className="w-full h-[calc(100vh-12rem)] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
}
