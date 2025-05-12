"use client";

import { useQueryState } from "nuqs";
import { useState, useCallback } from "react";
import {
  SearchFilters,
  PeriodFilter,
  Announcement,
  MapAnnouncement,
} from "@/types/announcement";

type SearchResults = {
  announcements: Announcement[];
  mapAnnouncements: MapAnnouncement[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSearch = (initialFilters?: SearchFilters) => {
  // états url
  const [query, setQuery] = useQueryState("q", {
    shallow: true,
    throttleMs: 300,
  });

  const [crop, setCrop] = useQueryState("crop", {
    shallow: true,
    throttleMs: 300,
  });

  const [period, setPeriod] = useQueryState("period", {
    shallow: true,
    throttleMs: 300,
  });

  const [radius, setRadius] = useQueryState("radius", {
    defaultValue: "25",
    shallow: true,
    throttleMs: 300,
  });

  const [location, setLocation] = useQueryState("location", {
    shallow: true,
    throttleMs: 300,
  });

  // états ui
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const hasFilters = !!(query || crop || location || radius !== "25" || period);

  // filtres courant
  const currentFilters: SearchFilters = {
    query: query || null,
    cropTypeId: crop || null,
    location: location || null,
    radius: radius || "25",
    period: (period || null) as PeriodFilter,
  };

  const convertDates = useCallback((data: SearchResults): SearchResults => {
    if (!data) return data;

    return {
      ...data,
      announcements: data.announcements.map((announcement) => ({
        ...announcement,
        startDate: announcement.startDate
          ? new Date(announcement.startDate)
          : null,
        endDate: announcement.endDate ? new Date(announcement.endDate) : null,
        createdAt:
          announcement.createdAt instanceof Date
            ? announcement.createdAt
            : new Date(announcement.createdAt),
      })),
    };
  }, []);

  // fonction pour gerer le changement de localisation
  const handleLocationChange = useCallback(
    (value: string | null) => {
      if (value === "") {
        setLocation(null);
        return;
      }
      setLocation(value);
    },
    [setLocation],
  );

  // fonction pour lancer la recherche
  const performSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // construire l'url
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (crop) params.set("crop", crop);
      if (period) params.set("period", period);
      if (radius && radius !== "25") params.set("radius", radius);
      if (location) params.set("location", location);

      // éviter la mise en cache
      params.set("_t", Date.now().toString());

      console.log(`Envoi de la requête: /api/search?${params.toString()}`);
      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "erreur inconnue" }));
        const errorMessage = errorData.message || `erreur: ${response.status}`;
        throw new Error(errorMessage);
      }

      const rawData = await response.json();
      const data = convertDates(rawData as SearchResults);
      setResults(data);

      // mettre a jour
      if (window.updateAnnouncementResults) {
        window.updateAnnouncementResults(data);
      }
    } catch (err) {
      console.error("erreur de recherche:", err);
      setError(err instanceof Error ? err : new Error("erreur inconnue"));

      const emptyResults = { announcements: [], mapAnnouncements: [] };
      setResults(emptyResults);

      if (window.updateAnnouncementResults) {
        window.updateAnnouncementResults(emptyResults);
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, crop, period, radius, location, convertDates]);

  const handleSearch = useCallback(() => {
    setIsSearchOpen(false);
    setIsLocationOpen(false);
    setIsFilterOpen(false);
    performSearch();
  }, [performSearch]);

  const resetAllFilters = useCallback(async () => {
    setIsLoading(true);

    try {
      // reset tous les filtres
      await setQuery(null);
      await setCrop(null);
      await setPeriod(null);
      await setRadius("25");
      await setLocation(null);

      setIsSearchOpen(false);
      setIsLocationOpen(false);
      setIsFilterOpen(false);

      // effectuer une recherche sans filtres
      const response = await fetch(`/api/search?_t=${Date.now()}`);

      if (!response.ok) {
        throw new Error(`erreur: ${response.status}`);
      }

      const data = await response.json();
      const processedData = convertDates(data as SearchResults);
      setResults(processedData);

      // mettre a jour les resultats globaux
      if (window.updateAnnouncementResults) {
        window.updateAnnouncementResults(processedData);
      }
    } catch (error) {
      console.error("erreur lors de la réinitialisation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setQuery, setCrop, setPeriod, setRadius, setLocation, convertDates]);

  return {
    filters: currentFilters,
    ui: {
      isSearchOpen,
      setIsSearchOpen,
      isLocationOpen,
      setIsLocationOpen,
      isFilterOpen,
      setIsFilterOpen,
      hasFilters,
    },
    actions: {
      setSearchQuery: setQuery,
      setSelectedCropType: setCrop,
      setPeriodValue: setPeriod,
      handleLocationChange,
      handleRadiusChange: setRadius,
      handleSearch,
      resetAllFilters,
    },
    results: {
      data: results,
      isLoading,
      isError: !!error,
      error,
    },
  };
};
