"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { MapAnnouncement } from "@/types/announcement";
import { Loader2, LocateIcon } from "lucide-react";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";
import { Button } from "@/components/ui/button";

type Point = { type: "Point"; coordinates: [number, number] };
type FeatureCollection<T> = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, string>;
    geometry: T;
  }>;
};

const CONFIG = {
  initialView: {
    center: [4.3517, 50.8503] as [number, number],
    zoom: 7.5,
  },
  popupOffset: 25,
  markerSize: {
    user: 36,
    point: 16,
    clusterBase: 16,
    clusterStep: 3,
  },
  iconSize: {
    apple: 0.7,
    user: 18,
  },
  animation: {
    zoom: {
      speed: 1.2,
      duration: 1000,
    },
  },
};
//TODO: utiliser les couleurs du thème global ex - bg-primary
const COLORS = {
  PRIMARY: "#094e3a",
  SECONDARY: "#34d399",
  TEXT: "#000000",
  STROKE: "#ffffff",
  CURRENT_LOCATION: "#f43f5e",
  POPUP_BG: "#ffffff",
};

type MapProps = {
  announcements: MapAnnouncement[];
};

export function AnnouncementMap({ announcements }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);

  const createGeoJson = (): FeatureCollection<Point> => ({
    type: "FeatureCollection",
    features: announcements.map((a) => ({
      type: "Feature",
      properties: {
        id: a.id,
        title: a.title,
        slug: a.slug,
      },
      geometry: {
        type: "Point",
        coordinates: [a.longitude, a.latitude],
      },
    })),
  });

  const askForGeolocation = () => {
    dialogManager.add({
      title: "autoriser la géolocalisation",
      description:
        "voulez-vous activer la géolocalisation pour voir les annonces près de vous?",
      action: {
        label: "accepter",
        onClick: async () => {
          navigator.geolocation.getCurrentPosition(
            (position) => handleGeolocationSuccess(position),
            (error) => console.error("erreur de géolocalisation:", error),
          );
        },
      },
    });
  };

  const handleGeolocationSuccess = (position: GeolocationPosition) => {
    if (!map.current) return;

    const { latitude, longitude } = position.coords;

    if (userMarker.current) userMarker.current.remove();

    // créer le nouveau marqueur
    userMarker.current = new mapboxgl.Marker(createUserMarkerElement())
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // zoomer sur la position
    map.current.flyTo({
      center: [longitude, latitude],
      zoom: 12,
      duration: CONFIG.animation.zoom.duration,
    });
  };

  // créer le marqueur utilisateur
  const createUserMarkerElement = () => {
    // conteneur principal
    const element = document.createElement("div");
    element.className = "user-location-marker";
    Object.assign(element.style, {
      width: `${CONFIG.markerSize.user}px`,
      height: `${CONFIG.markerSize.user}px`,
      borderRadius: "50%",
      background: COLORS.CURRENT_LOCATION,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 0 4px rgba(244, 63, 94, 0.3)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    });

    const userSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    userSvg.setAttribute("width", `${CONFIG.iconSize.user}`);
    userSvg.setAttribute("height", `${CONFIG.iconSize.user}`);
    userSvg.setAttribute("viewBox", "0 0 24 24");
    userSvg.setAttribute("fill", "none");
    userSvg.setAttribute("stroke", "white");
    userSvg.setAttribute("stroke-width", "2");
    userSvg.setAttribute("stroke-linecap", "round");
    userSvg.setAttribute("stroke-linejoin", "round");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2");

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "7");
    circle.setAttribute("r", "4");

    userSvg.appendChild(path);
    userSvg.appendChild(circle);
    element.appendChild(userSvg);

    return element;
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: CONFIG.initialView.center,
      zoom: CONFIG.initialView.zoom,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
      if ("geolocation" in navigator) {
        askForGeolocation();
      }
    });

    // nettoyer à la fermeture
    return () => {
      if (userMarker.current) userMarker.current.remove();
      if (popup) popup.remove();
      map.current?.remove();
    };
  }, []);

  // créer et ajouter l'iclne de pomme
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    loadAppleIcon();
  }, [mapLoaded]);

  // charger l'icone de pomme sur la carte
  const loadAppleIcon = () => {
    if (!map.current) return;

    // créer le svg de la pomme
    const appleSvg = createAppleSvg();
    const appleIcon = svgToDataUrl(appleSvg);

    // supprimer l'icone existante si présente
    if (map.current.hasImage("apple-icon"))
      map.current.removeImage("apple-icon");

    // charger la nouvelle icône
    const img = new Image();
    img.onload = () => {
      if (!map.current) return;
      map.current.addImage("apple-icon", img);
    };
    img.src = appleIcon;
  };

  // créer le svg de la pomme
  const createAppleSvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", COLORS.PRIMARY);
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    // chemins pour l'icone de pomme
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z",
    );

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path2.setAttribute("d", "M10 2c1 .5 2 2 2 5");

    svg.appendChild(path);
    svg.appendChild(path2);

    return svg;
  };

  const svgToDataUrl = (svg: SVGElement) => {
    const svgString = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  };

  // créer un popup
  const createPopupHtml = (title: string, slug: string) => {
    const popupId = `popup-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return `
      <div class="announcement-popup" id="${popupId}" style="min-width:220px;padding:10px;position:relative;">
        <button class="close-button" data-popup-id="${popupId}" style="position:absolute;top:5px;right:5px;background:none;border:none;cursor:pointer;padding:4px;z-index:10;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.PRIMARY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
        <div style="font-weight:600;font-size:15px;margin-bottom:10px;color:${COLORS.TEXT};padding-right:15px;">${title}</div>
        <a href="/announcements/${slug}" 
           style="display:inline-block;padding:8px 12px;background:${COLORS.PRIMARY};
                  color:#fff;border-radius:6px;text-decoration:none;font-size:14px;
                  font-weight:500;transition:all 0.2s ease">
           voir l'annonce
        </a>
      </div>
    `;
  };

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // préparer les données geojson
    const geojson = createGeoJson();
    if (map.current.getSource("announcements")) {
      (
        map.current.getSource("announcements") as mapboxgl.GeoJSONSource
      ).setData(geojson);
      return;
    }

    addMapLayers(geojson);
  }, [mapLoaded, announcements]);

  const addMapLayers = (geojson: FeatureCollection<Point>) => {
    if (!map.current) return;

    map.current.addSource("announcements", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 40,
    });

    map.current.addLayer({
      id: "clusters",
      type: "circle",
      source: "announcements",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": COLORS.PRIMARY,
        "circle-radius": [
          "step",
          ["get", "point_count"],
          CONFIG.markerSize.clusterBase,
          5,
          CONFIG.markerSize.clusterBase + CONFIG.markerSize.clusterStep,
          10,
          CONFIG.markerSize.clusterBase + CONFIG.markerSize.clusterStep * 2,
          25,
          CONFIG.markerSize.clusterBase + CONFIG.markerSize.clusterStep * 3,
        ],
        "circle-stroke-width": 0,
        "circle-opacity": 0.9,
      },
    });

    map.current.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "announcements",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": COLORS.STROKE,
      },
    });

    map.current.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "announcements",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#ffffff",
        "circle-radius": CONFIG.markerSize.point,
        "circle-stroke-width": 0,
      },
    });

    map.current.addLayer({
      id: "unclustered-point-icon",
      type: "symbol",
      source: "announcements",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": "apple-icon",
        "icon-size": CONFIG.iconSize.apple,
        "icon-offset": [0, 0],
        "icon-allow-overlap": true,
      },
    });

    setupMapInteractions();
  };

  const setupMapInteractions = () => {
    if (!map.current) return;

    // interaction avec les clusters
    map.current.on("click", "clusters", handleClusterClick);

    // interaction avec les point
    map.current.on("click", "unclustered-point", handlePointClick);
    map.current.on("click", "unclustered-point-icon", handlePointClick);

    // effets de survol
    setupHoverEffects();
  };

  const handleClusterClick = (
    e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] },
  ) => {
    if (!map.current || !e.features) return;

    const features = e.features;
    const clusterId = features[0].properties?.cluster_id;
    (
      map.current.getSource("announcements") as mapboxgl.GeoJSONSource
    ).getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err || zoom === undefined || zoom === null) return;

      const coordinates = (features[0].geometry as Point).coordinates;

      map.current!.easeTo({
        center: coordinates,
        zoom: zoom,
      });
    });
  };

  const handlePointClick = (
    e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] },
  ) => {
    if (!map.current || !e.features) return;

    if (popup) popup.remove();

    const feature = e.features[0];
    const { title, slug } = feature.properties as {
      title: string;
      slug: string;
    };
    const coordinates = (feature.geometry as Point).coordinates as [
      number,
      number,
    ];

    const newPopup = new mapboxgl.Popup({
      offset: CONFIG.popupOffset,
      closeButton: false,
      closeOnClick: false,
      className: "announcement-popup-container",
      maxWidth: "300px",
    })
      .setLngLat(coordinates)
      .setHTML(createPopupHtml(title, slug))
      .addTo(map.current);

    document.addEventListener("click", function popupCloseHandler(e) {
      const target = e.target as HTMLElement;
      const closeButton = target.closest(".close-button");

      if (closeButton) {
        e.preventDefault();
        e.stopPropagation();

        if (newPopup && newPopup.isOpen()) {
          newPopup.remove();
          setPopup(null);
        }

        document.removeEventListener("click", popupCloseHandler);
      }
    });

    setPopup(newPopup);

    map.current.flyTo({
      center: coordinates,
      zoom: 12,
      speed: CONFIG.animation.zoom.speed,
    });
  };

  const setupHoverEffects = () => {
    if (!map.current) return;

    const setCursorPointer = () => {
      if (map.current) map.current.getCanvas().style.cursor = "pointer";
    };

    const resetCursor = () => {
      if (map.current) map.current.getCanvas().style.cursor = "";
    };

    // curseur sur les clusters
    map.current.on("mouseenter", "clusters", setCursorPointer);
    map.current.on("mouseleave", "clusters", resetCursor);

    // curseur sur les points
    map.current.on("mouseenter", "unclustered-point", setCursorPointer);
    map.current.on("mouseleave", "unclustered-point", resetCursor);

    // curseur sur les icones
    map.current.on("mouseenter", "unclustered-point-icon", setCursorPointer);
    map.current.on("mouseleave", "unclustered-point-icon", resetCursor);
  };

  return (
    <Card className="w-full h-[calc(100vh-12rem)] overflow-hidden relative">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Bouton de géolocalisation */}
      {mapLoaded && (
        <Button
          size="icon"
          onClick={askForGeolocation}
          className="absolute bottom-4 right-4 z-10 bg-secondary hover:bg-secondary/80"
          title="afficher ma position"
        >
          <LocateIcon className="h-5 w-5 text-white" />
        </Button>
      )}
    </Card>
  );
}
