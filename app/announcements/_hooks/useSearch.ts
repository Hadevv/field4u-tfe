import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchFilters, PeriodFilter } from "../_components/types";

export const useSearch = (initialFilters?: SearchFilters) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useQueryState("q");
  const [selectedCropType, setSelectedCropType] = useQueryState("crop");
  const [periodValue, setPeriodValue] = useQueryState("period");
  const [radiusValue, setRadiusValue] = useQueryState("radius", {
    defaultValue: "25",
  });
  const [locationValue, setLocationValue] = useQueryState("location");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasFilters = !!(
    searchQuery ||
    selectedCropType ||
    locationValue ||
    radiusValue !== "25" ||
    periodValue
  );

  const resetAllFilters = async () => {
    try {
      // Réinitialiser tous les filtres
      await setSearchQuery(null);
      await setSelectedCropType(null);
      await setPeriodValue(null);
      await setRadiusValue("25");
      await setLocationValue(null);

      setIsSearchOpen(false);
      setIsLocationOpen(false);
      setIsFilterOpen(false);

      window.location.href = "/announcements";
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des filtres:", error);
      window.location.reload();
    }
  };

  const handleLocationChange = (value: string | null) => {
    setLocationValue(value);
    if (value === null) {
      router.push(window.location.pathname);
    }
  };

  const handleRadiusChange = (radius: string) => {
    setRadiusValue(radius);
  };

  const handleSearchSubmit = () => {
    setIsSearchOpen(false);
    setIsLocationOpen(false);
    setIsFilterOpen(false);
    router.push(window.location.pathname + window.location.search);
  };

  const currentFilters: SearchFilters = {
    query: searchQuery || null,
    cropTypeId: selectedCropType || null,
    location: locationValue || null,
    radius: radiusValue || "25",
    period: (periodValue || null) as PeriodFilter,
  };

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
      setSearchQuery,
      setSelectedCropType,
      setPeriodValue,
      handleLocationChange,
      handleRadiusChange,
      handleSearchSubmit,
      resetAllFilters,
    },
  };
};
