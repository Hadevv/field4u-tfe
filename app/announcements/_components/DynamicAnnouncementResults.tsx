"use client";

import React, { useState, useEffect } from "react";
import { AnnouncementList } from "./AnnouncementList";
import { AnnouncementMap } from "./AnnouncementMap";
import { AnnouncementTabs } from "./AnnouncementTabs";
import { Announcement, MapAnnouncement } from "./types";

declare global {
  interface Window {
    updateAnnouncementResults?: (data: {
      announcements: Announcement[];
      mapAnnouncements: MapAnnouncement[];
    }) => void;
  }
}

type ApiResponse = {
  announcements: Array<{
    id: string;
    title: string;
    description: string;
    slug: string;
    images: string[];
    isPublished: boolean;
    createdAt: string;
    startDate: string | null;
    endDate: string | null;
    status: string;
    isLiked: boolean;
    cropType: {
      id: string;
      name: string;
      category: string;
    };
    field: {
      id: string;
      city: string;
      postalCode: string;
      latitude: number;
      longitude: number;
    };
    owner: {
      id: string;
      name: string;
      image: string | null;
    };
  }>;
  mapAnnouncements: MapAnnouncement[];
}

export function DynamicAnnouncementResults() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{
    announcements: Announcement[];
    mapAnnouncements: MapAnnouncement[];
  } | null>(null);

  // convertir les chaines de date en objets date
  const convertAnnouncementDates = (
    apiData: ApiResponse,
  ): {
    announcements: Announcement[];
    mapAnnouncements: MapAnnouncement[];
  } => {
    return {
      ...apiData,
      announcements: apiData.announcements.map((announcement) => ({
        ...announcement,
        startDate: announcement.startDate
          ? new Date(announcement.startDate)
          : null,
        endDate: announcement.endDate ? new Date(announcement.endDate) : null,
        createdAt: new Date(announcement.createdAt),
      })) as Announcement[],
    };
  };

  // chargement initial
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/search?initial=true&_t=${Date.now()}`,
        );

        if (!response.ok) {
          throw new Error(`erreur: ${response.status}`);
        }

        const result = (await response.json()) as ApiResponse;

        // convertir les dates
        const processedData = convertAnnouncementDates(result);
        setData(processedData);

        window.updateAnnouncementResults = (newData) => {
          setData(newData);
        };
      } catch (err) {
        console.error("erreur de chargement:", err);
        setError(err instanceof Error ? err : new Error("erreur inconnue"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // nettoyage
    return () => {
      window.updateAnnouncementResults = undefined;
    };
  }, []);

  // afficher un loader
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-muted-foreground">chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        erreur: {error.message}
      </div>
    );
  }

  // si pas de données
  if (!data || data.announcements.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        aucune annonce disponible
      </div>
    );
  }

  // donnes disponibles
  const { announcements, mapAnnouncements } = data;

  return (
    <>
      <div className="md:hidden mt-2">
        <AnnouncementTabs
          listContent={<AnnouncementList announcements={announcements} />}
          mapContent={<AnnouncementMap announcements={mapAnnouncements} />}
        />
      </div>

      <div className="hidden md:grid md:grid-cols-12 gap-4 mt-2">
        <div className="md:col-span-6 lg:col-span-5">
          <AnnouncementList announcements={announcements} />
        </div>
        <div className="md:col-span-6 lg:col-span-7">
          <AnnouncementMap announcements={mapAnnouncements} />
        </div>
      </div>
    </>
  );
}
