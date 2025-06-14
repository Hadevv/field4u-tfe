"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBelgianPostalData } from "../../hooks/useBelgianPostal";
import { useDebounce } from "@/hooks/useDebounce";

export type BelgianPostalItem = {
  code_postal: string;
  localite: string;
};

export type BelgianPostalSearchProps = {
  searchType: "city" | "postal";
  value?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onCityChange?: (city: string) => void;
  onPostalCodeChange?: (postalCode: string) => void;
  className?: string;
  disabled?: boolean;
};

export function BelgianPostalSearch({
  searchType = "city",
  value = "",
  placeholder,
  onValueChange,
  onCityChange,
  onPostalCodeChange,
  className,
  disabled = false,
}: BelgianPostalSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedValue, setSelectedValue] = useState(value);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    getCitiesForPostalCode,
    getPostalCodesForCity,
    searchPostalData,
  } = useBelgianPostalData();

  // Log des données pour le debugging
  useEffect(() => {
    if (data) {
      console.log(
        "Données postales chargées:",
        Object.keys(data).length,
        "codes postaux",
      );
    }
  }, [data]);

  useEffect(() => {
    if (value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value, selectedValue]);

  // placeholder
  const defaultPlaceholder =
    searchType === "city"
      ? "sélectionner une ville..."
      : "sélectionner un code postal...";
  const displayPlaceholder = placeholder || defaultPlaceholder;

  const handleSelect = (selected: string, item?: BelgianPostalItem) => {
    setSelectedValue(selected);
    setOpen(false);
    setSearch("");
    if (item) {
      if (searchType === "city") {
        onValueChange?.(item.localite);
        onCityChange?.(item.localite);
        onPostalCodeChange?.(item.code_postal);
      } else {
        onValueChange?.(item.code_postal);
        onPostalCodeChange?.(item.code_postal);
        onCityChange?.(item.localite);
      }
      return;
    }
    if (searchType === "city") {
      onValueChange?.(selected);
      onCityChange?.(selected);

      // auto-selection du code postal si une seule ville
      const postalCodes = getPostalCodesForCity(selected);
      if (postalCodes.length === 1) {
        onPostalCodeChange?.(postalCodes[0]);
      }
    } else {
      // auto-selection de la ville si un seul code postal
      onValueChange?.(selected);
      onPostalCodeChange?.(selected);

      // auto-selection de la ville si un seul code postal
      const cities = getCitiesForPostalCode(selected);
      if (cities.length === 1) {
        onCityChange?.(cities[0]);
      }
    }
  };

  const handleRetry = async () => {
    try {
      await refetch();
      setSearch("");
    } catch (err) {
      console.error("erreur lors de la retentative:", err);
    }
  };

  // utiliser searchPostalData au lieu de faire un appel api
  const searchResults =
    debouncedSearch.length >= 2
      ? searchPostalData(debouncedSearch, searchType)
      : [];

  const isNoResults =
    debouncedSearch.length >= 2 && searchResults.length === 0 && !isError;
  const errorMessage =
    error?.message || "erreur de chargement des données postales";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {selectedValue || displayPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`rechercher ${searchType === "city" ? "une ville" : "un code postal"}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  chargement...
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-3 space-y-2">
                  <div className="text-destructive text-sm text-center">
                    {errorMessage}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetry}
                    className="flex items-center"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    réessayer
                  </Button>
                </div>
              ) : isNoResults ? (
                "aucun résultat trouvé"
              ) : (
                "commencez à taper pour rechercher"
              )}
            </CommandEmpty>

            {searchResults.length > 0 && (
              <CommandGroup>
                {searchResults.map((item, index) => {
                  const itemValue =
                    searchType === "city" ? item.localite : item.code_postal;
                  const secondaryValue =
                    searchType === "city" ? item.code_postal : item.localite;
                  const itemKey = `${item.code_postal}-${item.localite}-${index}`;

                  return (
                    <CommandItem
                      key={itemKey}
                      value={itemKey}
                      onSelect={() => handleSelect(itemValue, item)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === itemValue
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="font-medium">{itemValue}</span>
                      {secondaryValue && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({secondaryValue})
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
