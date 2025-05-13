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

/**
 * item représentant un code postal et sa localité
 */
export type BelgianPostalItem = {
  code_postal: string;
  localite: string;
};

/**
 * propriétés du composant de recherche de codes postaux belges
 */
export type BelgianPostalSearchProps = {
  /** type de recherche: "city" (ville) ou "postal" (code postal) */
  searchType: "city" | "postal";
  /** valeur sélectionnée */
  value?: string;
  /** texte d'instruction dans le champ vide */
  placeholder?: string;
  /** callback appelé quand une valeur est sélectionnée */
  onValueChange?: (value: string) => void;
  /** callback appelé quand une ville est sélectionnée */
  onCityChange?: (city: string) => void;
  /** callback appelé quand un code postal est sélectionné */
  onPostalCodeChange?: (postalCode: string) => void;
  /** classes CSS à appliquer au composant */
  className?: string;
  /** désactiver le composant */
  disabled?: boolean;
};

/**
 * composant de recherche de codes postaux belges avec synchronisation bidirectionnelle
 * ce composant permet de rechercher soit par ville, soit par code postal
 * et synchronise automatiquement l'autre champ si possible
 */
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
  // état local pour le composant
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedValue, setSelectedValue] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BelgianPostalItem[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // hook personnalisé pour les données postales belges
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    getCitiesForPostalCode,
    getPostalCodesForCity,
  } = useBelgianPostalData();

  // mise à jour lorsque la valeur change via les props
  useEffect(() => {
    if (value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value, selectedValue]);

  // effet pour rechercher lorsque la recherche change
  useEffect(() => {
    async function searchPostalData() {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/belgian-postal/search?query=${encodeURIComponent(debouncedSearch)}&type=${searchType}`,
        );

        if (!response.ok) {
          throw new Error(`erreur de recherche: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("erreur recherche codes postaux:", err);
        setSearchError(
          err instanceof Error ? err.message : "erreur de recherche",
        );
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }

    // ne déclencher la recherche que si la saisie a une longueur suffisante
    if (debouncedSearch.length >= 2) {
      searchPostalData();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearch, searchType]);

  // formattage du placeholder
  const defaultPlaceholder =
    searchType === "city"
      ? "sélectionner une ville..."
      : "sélectionner un code postal...";
  const displayPlaceholder = placeholder || defaultPlaceholder;

  // gérer la sélection d'un item
  const handleSelect = (selected: string, item?: BelgianPostalItem) => {
    setSelectedValue(selected);

    // fermer le popover
    setOpen(false);

    // réinitialiser la recherche
    setSearch("");

    // si on a sélectionné un item complet (avec code postal et ville)
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

    // comportement standard (sélection simple - rétrocompatibilité)
    if (searchType === "city") {
      // sélection d'une ville
      onValueChange?.(selected);
      onCityChange?.(selected);

      // si la ville n'a qu'un seul code postal, le sélectionner automatiquement
      const postalCodes = getPostalCodesForCity(selected);
      if (postalCodes.length === 1) {
        onPostalCodeChange?.(postalCodes[0]);
      }
    } else {
      // sélection d'un code postal
      onValueChange?.(selected);
      onPostalCodeChange?.(selected);

      // si le code postal n'a qu'une seule ville, la sélectionner automatiquement
      const cities = getCitiesForPostalCode(selected);
      if (cities.length === 1) {
        onCityChange?.(cities[0]);
      }
    }
  };

  // gérer une retentative en cas d'erreur
  const handleRetry = async () => {
    try {
      await refetch();
      // réinitialiser la recherche après la retentative
      setSearch("");
      setSearchError(null);
    } catch (err) {
      console.error("erreur lors de la retentative:", err);
    }
  };

  // gestion de l'état du composant
  const isInitialLoading = isLoading && !searchError;
  const hasError = isError || !!searchError;
  const errorMessage =
    searchError ||
    error?.message ||
    "erreur de chargement des données postales";
  const isNoResults =
    !isSearching &&
    debouncedSearch.length >= 2 &&
    searchResults.length === 0 &&
    !hasError;

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
              {isInitialLoading || isSearching ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  chargement...
                </div>
              ) : hasError ? (
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
                  // utiliser index pour garantir l'unicité des clés
                  const itemKey = `${item.code_postal}-${item.localite}-${index}`;
                  const compositeKey = `${item.code_postal} (${item.localite})`;

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
