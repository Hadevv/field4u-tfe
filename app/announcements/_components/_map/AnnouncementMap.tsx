"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { MapAnnouncement } from "@/types/announcement";
import { Loader2, LocateIcon, Navigation, HandHelping } from "lucide-react";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";
import { Button } from "@/components/ui/button";

type Point = { type: "Point"; coordinates: [number, number] };
type MapProperties = {
  id: string;
  title: string;
  slug: string;
  cropType: string;
};
type FeatureCollection<T> = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: MapProperties;
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
    harvest: 0.7,
    user: 18,
  },
  animation: {
    zoom: {
      speed: 1.2,
      duration: 1000,
    },
  },
  securityZone: {
    radius: 200,
    color: "rgba(9, 78, 58, 0.15)",
    borderColor: "rgba(9, 78, 58, 0.3)",
    borderWidth: 1,
    minZoom: 9,
  },
  maxZoom: 14,
};

const COLORS = {
  PRIMARY: "hsl(76, 72%, 43%)",
  SECONDARY: "#34d399",
  TEXT: "#000000",
  STROKE: "#ffffff",
  CURRENT_LOCATION: "#f43f5e",
  POPUP_BG: "#ffffff",
  MARKER_BG: "hsl(76, 72%, 43%)",
  ICON_COLOR: "#ffffff",
};

const STORAGE_KEYS = {
  GEOLOCATION_ASKED: "field4u_geolocation_asked",
  GEOLOCATION_ALLOWED: "field4u_geolocation_allowed",
};

type MapProps = {
  announcements: MapAnnouncement[];
  onAnnouncementClick?: (announcementId: string) => void;
};

export function AnnouncementMap({
  announcements,
  onAnnouncementClick,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);
  const securityCircles = useRef<mapboxgl.GeoJSONSource | null>(null);
  const [currentZoom, setCurrentZoom] = useState(CONFIG.initialView.zoom);

  const createGeoJson = (): FeatureCollection<Point> => ({
    type: "FeatureCollection",
    features: announcements.map((a) => ({
      type: "Feature",
      properties: {
        id: a.id,
        title: a.title,
        slug: a.slug,
        cropType: a.cropType || "",
      },
      geometry: {
        type: "Point",
        coordinates: [a.longitude, a.latitude],
      },
    })),
  });

  const createSecurityZonesGeoJson = (): GeoJSON.FeatureCollection => ({
    type: "FeatureCollection",
    features: announcements.map((a) => ({
      type: "Feature",
      properties: {
        id: a.id,
        title: a.title,
        slug: a.slug,
        cropType: a.cropType || "",
      },
      geometry: {
        type: "Point",
        coordinates: [a.longitude, a.latitude],
      },
    })),
  });

  const checkGeolocationPermission = () => {
    const hasAsked = localStorage.getItem(STORAGE_KEYS.GEOLOCATION_ASKED);
    const isAllowed = localStorage.getItem(STORAGE_KEYS.GEOLOCATION_ALLOWED);

    console.log("Vérification permissions:", { hasAsked, isAllowed });

    return {
      hasAsked: hasAsked === "true",
      isAllowed: isAllowed === "true",
    };
  };

  const askForGeolocation = () => {
    console.log("askForGeolocation appelée");

    // Ne pas demander la géolocalisation en mode test - utiliser des indicateurs plus fiables
    if (
      typeof window !== "undefined" &&
      (window.navigator.webdriver || // Détecte Playwright/Selenium
        window.location.hostname === "localhost" || // En développement
        process.env.NODE_ENV === "test" || // En mode test
        "__playwright" in window || // Playwright spécifique
        "__e2e_test" in window)
    ) {
      // Flag custom qu'on peut ajouter
      console.log("Mode test détecté, géolocalisation ignorée");
      return;
    }

    const { hasAsked, isAllowed } = checkGeolocationPermission();

    if (hasAsked && isAllowed) {
      // Si déjà autorisé, récupérer directement la position
      console.log("Permission déjà accordée, récupération de la position");
      getCurrentLocation();
      return;
    }

    // Si pas encore demandé OU si refusé précédemment, afficher le dialog
    console.log("Affichage du dialog de permission");
    const dialogId = dialogManager.add({
      title: "Autoriser la géolocalisation",
      description:
        "Voulez-vous activer la géolocalisation pour voir les annonces près de vous ?",
      cancel: {
        label: "Annuler",
        onClick: () => {
          console.log("Permission géolocalisation refusée");
          localStorage.setItem(STORAGE_KEYS.GEOLOCATION_ASKED, "true");
          localStorage.setItem(STORAGE_KEYS.GEOLOCATION_ALLOWED, "false");
          dialogManager.remove(dialogId);
        },
      },
      action: {
        label: "Accepter",
        onClick: async () => {
          console.log("Permission géolocalisation acceptée");
          localStorage.setItem(STORAGE_KEYS.GEOLOCATION_ASKED, "true");
          localStorage.setItem(STORAGE_KEYS.GEOLOCATION_ALLOWED, "true");
          getCurrentLocation();
          dialogManager.remove(dialogId);
        },
      },
      style: "centered",
    });
  };

  const getCurrentLocation = () => {
    console.log("getCurrentLocation appelée");
    if (!navigator.geolocation) {
      console.error("Géolocalisation non disponible");
      return;
    }

    console.log("Demande de position en cours...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Position obtenue:", position);
        handleGeolocationSuccess(position);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        localStorage.setItem(STORAGE_KEYS.GEOLOCATION_ALLOWED, "false");
      },
    );
  };

  const handleGeolocationSuccess = (position: GeolocationPosition) => {
    if (!map.current) return;

    const { latitude, longitude } = position.coords;

    if (userMarker.current) userMarker.current.remove();

    userMarker.current = new mapboxgl.Marker(createUserMarkerElement())
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    map.current.flyTo({
      center: [longitude, latitude],
      zoom: Math.min(12, CONFIG.maxZoom),
      duration: CONFIG.animation.zoom.duration,
    });
  };

  const createUserMarkerElement = () => {
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

  const updateSecurityZonesVisibility = () => {
    if (!map.current || !mapLoaded) return;

    try {
      if (map.current.getLayer("security-zones-circles")) {
        if (currentZoom >= CONFIG.securityZone.minZoom) {
          map.current.setLayoutProperty(
            "security-zones-circles",
            "visibility",
            "visible",
          );
        } else {
          map.current.setLayoutProperty(
            "security-zones-circles",
            "visibility",
            "none",
          );
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la visibilité des zones de sécurité:",
        error,
      );
    }
  };

  const zoomToAnnouncement = (announcementId: string) => {
    if (!map.current) return;

    const announcement = announcements.find((a) => a.id === announcementId);
    if (!announcement) return;

    map.current.flyTo({
      center: [announcement.longitude, announcement.latitude],
      zoom: Math.min(12, CONFIG.maxZoom),
      duration: CONFIG.animation.zoom.duration,
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: CONFIG.initialView.center,
      zoom: CONFIG.initialView.zoom,
      maxZoom: CONFIG.maxZoom,
    });

    map.current.on("zoom", () => {
      if (!map.current) return;
      setCurrentZoom(map.current.getZoom());
    });

    map.current.on("load", () => {
      setMapLoaded(true);

      map.current?.addSource("security-zones", {
        type: "geojson",
        data: createSecurityZonesGeoJson(),
      });

      map.current?.addLayer({
        id: "security-zones-circles",
        type: "circle",
        source: "security-zones",
        layout: {
          visibility:
            CONFIG.initialView.zoom >= CONFIG.securityZone.minZoom
              ? "visible"
              : "none",
        },
        paint: {
          "circle-radius": {
            stops: [
              [10, 20],
              [15, 100],
              [20, 200],
            ],
            base: 2,
          },
          "circle-color": CONFIG.securityZone.color,
          "circle-stroke-color": CONFIG.securityZone.borderColor,
          "circle-stroke-width": CONFIG.securityZone.borderWidth,
          "circle-opacity": 0.7,
          "circle-stroke-opacity": 0.8,
        },
      });

      securityCircles.current = map.current?.getSource(
        "security-zones",
      ) as mapboxgl.GeoJSONSource;

      updateSecurityZonesVisibility();

      // Ne demander la géolocalisation que si ce n'est pas un test
      if (
        "geolocation" in navigator &&
        !(
          typeof window !== "undefined" &&
          (window.navigator.webdriver || // Détecte Playwright/Selenium
            window.location.hostname === "localhost" || // En développement
            process.env.NODE_ENV === "test" || // En mode test
            "__playwright" in window || // Playwright spécifique
            "__e2e_test" in window)
        )
      ) {
        // Flag custom qu'on peut ajouter
        askForGeolocation();
      }
    });

    return () => {
      if (userMarker.current) userMarker.current.remove();
      if (popup) popup.remove();
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      updateSecurityZonesVisibility();
    }
  }, [currentZoom, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    loadHarvestIcon();
  }, [mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const geojson = createGeoJson();
    const securityZonesGeoJson = createSecurityZonesGeoJson();

    if (securityCircles.current) {
      securityCircles.current.setData(securityZonesGeoJson);
    }

    if (map.current.getSource("announcements")) {
      (
        map.current.getSource("announcements") as mapboxgl.GeoJSONSource
      ).setData(geojson);
      return;
    }

    addMapLayers(geojson);
  }, [mapLoaded, announcements]);

  // écouteur pour le zoom depuis les cartes
  useEffect(() => {
    const handleZoomEvent = (event: CustomEvent) => {
      const { announcementId } = event.detail;
      zoomToAnnouncement(announcementId);
    };

    window.addEventListener(
      "zoomToAnnouncement",
      handleZoomEvent as EventListener,
    );

    return () => {
      window.removeEventListener(
        "zoomToAnnouncement",
        handleZoomEvent as EventListener,
      );
    };
  }, [announcements]);

  const loadHarvestIcon = () => {
    if (!map.current) return;

    const harvestSvg = createHarvestSvg();
    const harvestIcon = svgToDataUrl(harvestSvg);

    if (map.current.hasImage("harvest-icon"))
      map.current.removeImage("harvest-icon");

    const img = new Image();
    img.onload = () => {
      if (!map.current) return;
      map.current.addImage("harvest-icon", img);
    };
    img.src = harvestIcon;
  };

  const createHarvestSvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", COLORS.ICON_COLOR);
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    // Créer un groupe avec la transformation pour que la main pointe vers le bas
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", "rotate(180 12 12)");

    // Icône HandHelping de Lucide
    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path1.setAttribute("d", "M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14");

    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path2.setAttribute(
      "d",
      "m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
    );

    const path3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path3.setAttribute("d", "m2 13 6 6");

    group.appendChild(path1);
    group.appendChild(path2);
    group.appendChild(path3);

    svg.appendChild(group);

    return svg;
  };

  const svgToDataUrl = (svg: SVGElement) => {
    const svgString = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  };

  const createPopupHtml = (title: string, slug: string, cropType?: string) => {
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
        ${cropType ? `<div style="font-size:13px;margin-bottom:10px;color:${COLORS.PRIMARY};padding-right:15px;">Culture : ${cropType}</div>` : ""}
        <a href="/announcements/${slug}" 
           style="display:inline-block;padding:8px 12px;background:${COLORS.PRIMARY};
                  color:#fff;border-radius:6px;text-decoration:none;font-size:14px;
                  font-weight:500;transition:all 0.2s ease">
           Voir l'annonce
        </a>
      </div>
    `;
  };

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
        "circle-color": COLORS.MARKER_BG,
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
        "icon-image": "harvest-icon",
        "icon-size": CONFIG.iconSize.harvest,
        "icon-offset": [0, 0],
        "icon-allow-overlap": true,
      },
    });

    setupMapInteractions();
  };

  const setupMapInteractions = () => {
    if (!map.current) return;

    map.current.on("click", "clusters", handleClusterClick);
    map.current.on("click", "unclustered-point", handlePointClick);
    map.current.on("click", "unclustered-point-icon", handlePointClick);

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

      const safeZoom = Math.min(zoom, CONFIG.maxZoom);
      const coordinates = (features[0].geometry as Point).coordinates;

      map.current!.easeTo({
        center: coordinates,
        zoom: safeZoom,
      });
    });
  };

  const handlePointClick = (
    e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] },
  ) => {
    if (!map.current || !e.features) return;

    if (popup) popup.remove();

    const feature = e.features[0];
    const { title, slug, cropType, id } = feature.properties as {
      title: string;
      slug: string;
      cropType?: string;
      id: string;
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
      .setHTML(createPopupHtml(title, slug, cropType))
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

    if (onAnnouncementClick) {
      onAnnouncementClick(id);
    }

    map.current.flyTo({
      center: coordinates,
      zoom: Math.min(12, CONFIG.maxZoom),
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

    map.current.on("mouseenter", "clusters", setCursorPointer);
    map.current.on("mouseleave", "clusters", resetCursor);
    map.current.on("mouseenter", "unclustered-point", setCursorPointer);
    map.current.on("mouseleave", "unclustered-point", resetCursor);
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

      {mapLoaded && (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <Button
            size="sm"
            onClick={() => {
              console.log("Bouton géolocalisation cliqué");

              // Vérifier si la géolocalisation est supportée
              if (!navigator.geolocation) {
                console.error(
                  "Géolocalisation non supportée par ce navigateur",
                );
                return;
              }

              // Toujours passer par askForGeolocation qui gère tous les cas
              askForGeolocation();
            }}
            className="bg-secondary hover:bg-secondary/80"
            title="Afficher ma position"
          >
            <LocateIcon className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      )}
    </Card>
  );
}
