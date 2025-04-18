"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  MapPin,
  ListFilterPlus,
  Search,
  RotateCcw,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LocationField } from "./LocationField";
import { useSearch } from "../_hooks/useSearch";
import {
  FilterBadgeProps,
  PERIOD_LABELS,
  SearchWizardProps,
  Announcement,
  MapAnnouncement,
} from "./types";

declare global {
  interface Window {
    updateAnnouncementResults?: (data: {
      announcements: Announcement[];
      mapAnnouncements: MapAnnouncement[];
    }) => void;
  }
}

const FilterBadge = ({ label, icon, onRemove }: FilterBadgeProps) => {
  return (
    <Badge variant="secondary" className="gap-1 rounded-full py-1">
      {icon}
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center justify-center"
      >
        <X className="h-3 w-3 cursor-pointer" />
      </button>
    </Badge>
  );
};

export function SearchWizard({
  cropTypes,
  initialFilters,
}: SearchWizardProps): React.ReactNode {
  const { filters, ui, actions, results } = useSearch(initialFilters);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const isPeriodSelectionRef = useRef(false);
  const isCropSelectionRef = useRef(false);

  // effectuer la recherche initiale
  useEffect(() => {
    if (ui.hasFilters) {
      actions.handleSearch();
    }
  }, []);

  // formulaire de recherche
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.handleSearch();
  };

  // gestion des filtres
  const handlePeriodChange = (value: string) => {
    isPeriodSelectionRef.current = true;

    setTimeout(() => {
      actions.setPeriodValue(value || null);
      isPeriodSelectionRef.current = false;
    }, 100);
  };

  const handleCropTypeChange = (value: string) => {
    isCropSelectionRef.current = true;

    setTimeout(() => {
      actions.setSelectedCropType(value || null);
      isCropSelectionRef.current = false;
    }, 100);
  };

  // fonction reset
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    actions.resetAllFilters();
  };

  const handlePopoverOpenChange = (
    open: boolean,
    type: "filter" | "search" | "location",
  ) => {
    if (!open && (isPeriodSelectionRef.current || isCropSelectionRef.current)) {
      return;
    }

    switch (type) {
      case "filter":
        ui.setIsFilterOpen(open);
        break;
      case "search":
        ui.setIsSearchOpen(open);
        if (open && searchInputRef.current) {
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        break;
      case "location":
        ui.setIsLocationOpen(open);
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 max-w-3xl mx-auto">
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-0 sm:p-0">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:rounded-full border p-1 sm:p-2">
            {/* recherche */}
            <Popover
              open={ui.isSearchOpen}
              onOpenChange={(open) => handlePopoverOpenChange(open, "search")}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "w-full sm:w-auto rounded-full px-4 h-10 flex justify-start border-none",
                    filters.query && "font-medium",
                  )}
                >
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">
                    {filters.query || "rechercher"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(80vw,320px)] p-3" align="start">
                <div className="space-y-2">
                  <h4 className="font-medium">recherche</h4>
                  <Input
                    ref={searchInputRef}
                    placeholder="rechercher..."
                    value={filters.query || ""}
                    onChange={(e) =>
                      actions.setSearchQuery(e.target.value || null)
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    la recherche s'effectue uniquement sur le titre des annonces
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Separator
              orientation="horizontal"
              className="w-full h-[1px] sm:hidden"
            />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <Popover
              open={ui.isLocationOpen}
              onOpenChange={(open) => handlePopoverOpenChange(open, "location")}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "w-full sm:w-auto rounded-full px-4 h-10 flex justify-start border-none",
                    filters.location && "font-medium",
                  )}
                >
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{filters.location || "lieu"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(90vw,320px)] p-3" align="start">
                <LocationField
                  value={filters.location ?? null}
                  onChange={actions.handleLocationChange}
                  radius={filters.radius || "25"}
                  onRadiusChange={actions.handleRadiusChange}
                />
              </PopoverContent>
            </Popover>

            <Separator
              orientation="horizontal"
              className="w-full h-[1px] sm:hidden"
            />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* filtres */}
            <Popover
              open={ui.isFilterOpen}
              onOpenChange={(open) => handlePopoverOpenChange(open, "filter")}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "w-full sm:w-auto rounded-full px-4 h-10 flex justify-start border-none",
                    (filters.period || filters.cropTypeId) && "font-medium",
                  )}
                >
                  <ListFilterPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">filtres</span>
                  {(filters.period || filters.cropTypeId) && (
                    <Badge className="ml-2 rounded-full h-5 min-w-5 p-0 flex items-center justify-center">
                      {(filters.period ? 1 : 0) + (filters.cropTypeId ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(90vw,350px)] p-3" align="start">
                <div className="space-y-4">
                  {/* type de culture */}
                  <div className="space-y-2">
                    <h4 className="font-medium">type de culture</h4>
                    <RadioGroup
                      value={filters.cropTypeId || ""}
                      onValueChange={handleCropTypeChange}
                      className="flex flex-col space-y-1 max-h-[200px] overflow-y-auto"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="all-crops" />
                        <Label htmlFor="all-crops" className="cursor-pointer">
                          toutes cultures
                        </Label>
                      </div>
                      {cropTypes.map((type) => (
                        <div
                          key={type.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={type.id}
                            id={`crop-${type.id}`}
                          />
                          <Label
                            htmlFor={`crop-${type.id}`}
                            className="cursor-pointer"
                          >
                            {type.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* periode */}
                  <div className="space-y-2">
                    <h4 className="font-medium">période</h4>
                    <RadioGroup
                      value={filters.period || ""}
                      onValueChange={handlePeriodChange}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div
                        onClick={() => handlePeriodChange("")}
                        className={cn(
                          "flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted",
                          !filters.period && "bg-primary/10",
                        )}
                      >
                        <RadioGroupItem
                          value=""
                          id="period-all"
                          className="sr-only"
                        />
                        <Calendar className="h-5 w-5 mb-1" />
                        <Label
                          htmlFor="period-all"
                          className="cursor-pointer text-sm text-center"
                        >
                          toutes périodes
                        </Label>
                      </div>
                      <div
                        onClick={() => handlePeriodChange("today")}
                        className={cn(
                          "flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted",
                          filters.period === "today" && "bg-primary/10",
                        )}
                      >
                        <RadioGroupItem
                          value="today"
                          id="period-today"
                          className="sr-only"
                        />
                        <Calendar className="h-5 w-5 mb-1" />
                        <Label
                          htmlFor="period-today"
                          className="cursor-pointer text-sm text-center"
                        >
                          aujourd'hui
                        </Label>
                      </div>
                      <div
                        onClick={() => handlePeriodChange("week")}
                        className={cn(
                          "flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted",
                          filters.period === "week" && "bg-primary/10",
                        )}
                      >
                        <RadioGroupItem
                          value="week"
                          id="period-week"
                          className="sr-only"
                        />
                        <Calendar className="h-5 w-5 mb-1" />
                        <Label
                          htmlFor="period-week"
                          className="cursor-pointer text-sm text-center"
                        >
                          cette semaine
                        </Label>
                      </div>
                      <div
                        onClick={() => handlePeriodChange("month")}
                        className={cn(
                          "flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted",
                          filters.period === "month" && "bg-primary/10",
                        )}
                      >
                        <RadioGroupItem
                          value="month"
                          id="period-month"
                          className="sr-only"
                        />
                        <Calendar className="h-5 w-5 mb-1" />
                        <Label
                          htmlFor="period-month"
                          className="cursor-pointer text-sm text-center"
                        >
                          ce mois-ci
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* bouton de recherche */}
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-full px-4 h-10"
              disabled={results.isLoading}
            >
              <Search className="h-4 w-4 sm:mr-0 md:mr-2" />
              <span className="hidden md:inline">rechercher</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* badges de filtres */}
      {ui.hasFilters && (
        <div className="flex flex-wrap items-center gap-2 p-1">
          {filters.query && (
            <FilterBadge
              label={filters.query}
              onRemove={() => actions.setSearchQuery(null)}
            />
          )}
          {filters.location && (
            <FilterBadge
              label={filters.location}
              icon={<MapPin className="h-3 w-3" />}
              onRemove={() => actions.handleLocationChange(null)}
            />
          )}
          {filters.cropTypeId && (
            <FilterBadge
              label={
                cropTypes.find((type) => type.id === filters.cropTypeId)
                  ?.name || ""
              }
              onRemove={() => actions.setSelectedCropType(null)}
            />
          )}
          {filters.period && (
            <FilterBadge
              label={PERIOD_LABELS[filters.period]}
              icon={<Calendar className="h-3 w-3" />}
              onRemove={() => actions.setPeriodValue(null)}
            />
          )}
          {filters.radius !== "25" && (
            <FilterBadge
              label={`rayon ${filters.radius} km`}
              onRemove={() => actions.handleRadiusChange("25")}
            />
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-destructive rounded-full h-7 px-3"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            réinitialiser tout
          </Button>
        </div>
      )}

      {/* affichage des erreurs */}
      {results.isError && (
        <div className="text-center p-2 text-destructive text-sm">
          erreur lors de la recherche. veuillez réessayer.
        </div>
      )}
    </form>
  );
}
