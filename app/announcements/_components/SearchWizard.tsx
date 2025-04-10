"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, MapPin, Search, RotateCcw, X, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LocationField } from "./LocationField";
import { toast } from "sonner";
import { useSearch } from "../_hooks/useSearch";
import {
  CropType,
  FilterBadgeProps,
  PERIOD_LABELS,
  SearchWizardProps,
} from "./types";

// Composant pour les badges de filtre
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

interface CropTypeFilterProps {
  cropTypes: CropType[];
  selectedCropType: string | null;
  onChange: (value: string) => void;
}

const CropTypeFilter = ({
  cropTypes,
  selectedCropType,
  onChange,
}: CropTypeFilterProps) => {
  return (
    <RadioGroup
      value={selectedCropType || ""}
      onValueChange={(value) => onChange(value)}
      className="flex flex-col space-y-1"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="" id="all-crops" />
        <Label htmlFor="all-crops">Toutes cultures</Label>
      </div>
      {cropTypes.map((type) => (
        <div key={type.id} className="flex items-center space-x-2">
          <RadioGroupItem value={type.id} id={`crop-${type.id}`} />
          <Label htmlFor={`crop-${type.id}`}>{type.name}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export function SearchWizard({ cropTypes, initialFilters }: SearchWizardProps) {
  const { filters, ui, actions } = useSearch(initialFilters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.handleSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-1.5 sm:p-2">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:rounded-full border shadow-sm bg-white p-1 sm:p-2">
            {/* Recherche */}
            <Popover open={ui.isSearchOpen} onOpenChange={ui.setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full sm:w-auto rounded-full px-4 h-10 flex justify-start border-none",
                    filters.query && "font-medium",
                  )}
                >
                  <Search className="h-4 w-4 mr-2 text-primary" />
                  <span className="truncate">
                    {filters.query || "Rechercher"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(80vw,320px)] p-3" align="start">
                <div className="space-y-2">
                  <h4 className="font-medium">Recherche</h4>
                  <Input
                    placeholder="Rechercher..."
                    value={filters.query || ""}
                    onChange={(e) =>
                      actions.setSearchQuery(e.target.value || null)
                    }
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        ui.setIsSearchOpen(false);
                        actions.handleSearchSubmit();
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Separator
              orientation="horizontal"
              className="w-full h-[1px] sm:hidden"
            />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* Localisation */}
            <Popover
              open={ui.isLocationOpen}
              onOpenChange={ui.setIsLocationOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full sm:w-auto rounded-full px-4 h-10 flex justify-start border-none",
                    filters.location && "font-medium",
                  )}
                >
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span className="truncate">{filters.location || "Lieu"}</span>
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

            {/* Filtres */}
            <Popover open={ui.isFilterOpen} onOpenChange={ui.setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full sm:w-auto rounded-full px-4 h-10 flex justify-start border-none",
                    (filters.period || filters.cropTypeId) && "font-medium",
                  )}
                >
                  <Leaf className="h-4 w-4 mr-2 text-primary" />
                  <span className="truncate">Filtres</span>
                  {(filters.period || filters.cropTypeId) && (
                    <Badge className="ml-2 rounded-full h-5 min-w-5 p-0 flex items-center justify-center">
                      {(filters.period ? 1 : 0) + (filters.cropTypeId ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(90vw,350px)] p-3" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Type de culture</h4>
                    <CropTypeFilter
                      cropTypes={cropTypes}
                      selectedCropType={filters.cropTypeId ?? null}
                      onChange={(value) => {
                        actions.setSelectedCropType(value || null);
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Période</h4>
                    <RadioGroup
                      value={filters.period || ""}
                      onValueChange={(value: string) => {
                        actions.setPeriodValue(value || null);
                      }}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted">
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
                          Toutes périodes
                        </Label>
                      </div>
                      <div className="flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted">
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
                          Aujourd'hui
                        </Label>
                      </div>
                      <div className="flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted">
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
                          Cette semaine
                        </Label>
                      </div>
                      <div className="flex flex-col items-center space-y-1 border rounded-lg p-2 cursor-pointer hover:bg-muted">
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
                          Ce mois-ci
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Bouton de recherche */}
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-full px-4 h-10"
            >
              <Search className="h-4 w-4 sm:mr-0 md:mr-2" />
              <span className="hidden md:inline">Rechercher</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges de filtres */}
      {ui.hasFilters && (
        <div className="flex flex-wrap items-center gap-2 p-1">
          {filters.query && (
            <FilterBadge
              label={filters.query}
              onRemove={() => {
                actions.setSearchQuery(null);
                actions.handleSearchSubmit();
              }}
            />
          )}
          {filters.location && (
            <FilterBadge
              label={filters.location}
              icon={<MapPin className="h-3 w-3" />}
              onRemove={() => {
                actions.handleLocationChange(null);
              }}
            />
          )}
          {filters.cropTypeId && (
            <FilterBadge
              label={
                cropTypes.find((type) => type.id === filters.cropTypeId)
                  ?.name || ""
              }
              onRemove={() => {
                actions.setSelectedCropType(null);
                actions.handleSearchSubmit();
              }}
            />
          )}
          {filters.period && (
            <FilterBadge
              label={PERIOD_LABELS[filters.period]}
              icon={<Calendar className="h-3 w-3" />}
              onRemove={() => {
                actions.setPeriodValue(null);
                actions.handleSearchSubmit();
              }}
            />
          )}
          {filters.radius !== "25" && (
            <FilterBadge
              label={`Rayon ${filters.radius} km`}
              onRemove={() => {
                actions.handleRadiusChange("25");
                actions.handleSearchSubmit();
              }}
            />
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-destructive rounded-full h-7 px-3"
            onClick={actions.resetAllFilters}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Réinitialiser tout
          </Button>
        </div>
      )}
    </form>
  );
}
