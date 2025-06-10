"use client";

import React, { useState, useEffect } from "react";
import { AnnouncementList } from "./AnnouncementList";
import { AnnouncementMap } from "./_map/AnnouncementMap";
import { AnnouncementTabs } from "./AnnouncementTabs";
import { Announcement, MapAnnouncement } from "@/types/announcement";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function AnnouncementCardSkeleton() {
  return (
    <Card className="overflow-hidden mb-4 rounded-lg">
      <div className="flex">
        <Skeleton className="w-[180px] min-w-[180px] h-[160px]" />
        <div className="flex-1 p-4 relative">
          <div className="absolute top-3 right-3">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <div className="mb-3 pr-10">
            <Skeleton className="h-4 w-36 mb-1" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-1 mb-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-1.5 mt-auto">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-36" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-52" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AnnouncementListSkeleton() {
  return (
    <div className="space-y-4 overflow-auto max-h-[calc(100vh-14rem)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <AnnouncementCardSkeleton key={index} />
      ))}
    </div>
  );
}

function AnnouncementMapSkeleton() {
  return <Skeleton className="h-[calc(100vh-12rem)] w-full rounded-lg" />;
}

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
};

export function DynamicAnnouncementResults() {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{
    announcements: Announcement[];
    mapAnnouncements: MapAnnouncement[];
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleAnnouncementZoom = (announcementId: string) => {
    // déclencher l'événement de zoom sur la carte
    const event = new CustomEvent("zoomToAnnouncement", {
      detail: { announcementId },
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/search?initial=true&_t=${Date.now()}`,
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Erreur inconnue" }));
          const errorMessage =
            errorData.message || `Erreur: ${response.status}`;
          throw new Error(errorMessage);
        }

        const result = (await response.json()) as ApiResponse;

        const processedData = convertAnnouncementDates(result);
        setData(processedData);
        setHasSearched(true);

        window.updateAnnouncementResults = (newData) => {
          setData(newData);
          setHasSearched(true);
        };
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(err instanceof Error ? err : new Error("Erreur inconnue"));
        setHasSearched(true);
        setData({ announcements: [], mapAnnouncements: [] });
      } finally {
        setIsLoading(false);
      }
    };

    let retryCount = 0;
    const maxRetries = 3;

    const attemptFetch = () => {
      fetchInitialData().catch((error) => {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Nouvelle tentative de chargement (${retryCount}/${maxRetries})...`,
          );
          setTimeout(attemptFetch, 1000);
        } else {
          console.error("Abandon après plusieurs tentatives échouées:", error);
        }
      });
    };

    attemptFetch();

    return () => {
      window.updateAnnouncementResults = undefined;
    };
  }, []);

  if (isLoading && !hasSearched) {
    return (
      <>
        <div className="md:hidden mt-2">
          <AnnouncementListSkeleton />
        </div>
        <div className="hidden md:grid md:grid-cols-12 gap-4 mt-2">
          <div className="md:col-span-6 lg:col-span-5">
            <AnnouncementListSkeleton />
          </div>
          <div className="md:col-span-6 lg:col-span-7">
            <AnnouncementMapSkeleton />
          </div>
        </div>
      </>
    );
  }

  if (hasSearched && (!data || data.announcements.length === 0)) {
    return (
      <>
        <div className="md:hidden mt-2">
          <AnnouncementList
            announcements={[]}
            onAnnouncementZoom={handleAnnouncementZoom}
          />
        </div>
        <div className="hidden md:grid md:grid-cols-12 gap-4 mt-2">
          <div className="md:col-span-6 lg:col-span-5">
            <AnnouncementList
              announcements={[]}
              onAnnouncementZoom={handleAnnouncementZoom}
            />
          </div>
          <div className="md:col-span-6 lg:col-span-7">
            <AnnouncementMap announcements={[]} />
          </div>
        </div>
      </>
    );
  }

  const { announcements, mapAnnouncements } = data || {
    announcements: [],
    mapAnnouncements: [],
  };

  return (
    <>
      <div className="md:hidden mt-2">
        <AnnouncementTabs
          listContent={
            <AnnouncementList
              announcements={announcements}
              onAnnouncementZoom={handleAnnouncementZoom}
            />
          }
          mapContent={<AnnouncementMap announcements={mapAnnouncements} />}
        />
      </div>

      <div className="hidden md:grid md:grid-cols-12 gap-4 mt-2">
        <div className="md:col-span-6 lg:col-span-5">
          <AnnouncementList
            announcements={announcements}
            onAnnouncementZoom={handleAnnouncementZoom}
          />
        </div>
        <div className="md:col-span-6 lg:col-span-7">
          <AnnouncementMap announcements={mapAnnouncements} />
        </div>
      </div>
    </>
  );
}
