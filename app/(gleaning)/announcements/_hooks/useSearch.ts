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

  const resetAllFilters = () => {
    setSearchQuery(null);
    setSelectedCropType(null);
    setPeriodValue(null);
    setRadiusValue("25");
    setLocationValue(null);

    setIsSearchOpen(false);
    setIsLocationOpen(false);
    setIsFilterOpen(false);

    router.refresh();
  };

  const handleLocationChange = (value: string | null) => {
    setLocationValue(value);
    if (value === null) {
      router.refresh();
    }
  };

  const handleRadiusChange = (radius: string) => {
    setRadiusValue(radius);
  };

  const handleSearchSubmit = () => {
    setIsSearchOpen(false);
    setIsLocationOpen(false);
    setIsFilterOpen(false);
    router.refresh();
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
