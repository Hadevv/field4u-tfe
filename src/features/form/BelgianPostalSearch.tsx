// BelgianPostalSearch.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "use-debounce";
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
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { useMemo } from "react";

type PostalData = {
  column_1: string;
  column_2: string;
  recordid: string;
};

type BelgianPostalSearchProps = {
  searchType: "city" | "postal";
  value: string;
  onChange: (value: { city: string; postalCode: string }) => void;
  className?: string;
  options?: PostalData[];
};

const API_BASE_URL =
  "https://www.odwb.be/api/explore/v2.1/catalog/datasets/code-postaux-belge/records";

export function BelgianPostalSearch({
  searchType,
  value,
  onChange,
  className,
  options = [],
}: BelgianPostalSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [results, setResults] = useState<PostalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(new AbortController());
  const mountedRef = useRef(false);

  const buildQueryParams = useCallback(
    (search: string) => {
      const params = new URLSearchParams({
        select: "column_1,column_2",
        lang: "fr",
        rows: "100",
        sort: searchType === "city" ? "column_2 asc" : "column_1 asc",
      });

      if (searchType === "city") {
        params.set("q", `column_2:"${search}*"`);
        params.set("exclude", "column_2:undefined");
      }
    },
    [searchType],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      abortControllerRef.current.abort();
      const newAbortController = new AbortController();
      abortControllerRef.current = newAbortController;

      if (debouncedSearch.length < (searchType === "city" ? 2 : 1)) return;

      setIsLoading(true);

      try {
        const queryParams = buildQueryParams(debouncedSearch);
        const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
          signal: newAbortController.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        let filteredResults =
          data.results?.filter(
            (item: PostalData) => item.column_1 && item.column_2,
          ) || [];

        if (searchType === "city") {
          filteredResults = filteredResults.sort(
            (a: PostalData, b: PostalData) => {
              const aStarts = a.column_2
                .toLowerCase()
                .startsWith(search.toLowerCase());
              const bStarts = b.column_2
                .toLowerCase()
                .startsWith(search.toLowerCase());

              if (aStarts === bStarts) {
                return a.column_2.localeCompare(b.column_2);
              }
              return aStarts ? -1 : 1;
            },
          );
        }

        if (mountedRef.current) setResults(filteredResults);
      } catch (error) {
        if ((error as Error).name !== "AbortError" && mountedRef.current) {
          logger.error("API Error:", error);
          setResults([]);
        }
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, searchType, buildQueryParams]);

  const allResults = [...options, ...results].filter(
    (item, index, self) =>
      self.findIndex(
        (t) =>
          t.column_1 === item.column_1 &&
          t.column_2.toLowerCase() === item.column_2.toLowerCase(),
      ) === index,
  );

  const displayValue = useMemo(() => {
    const normalizedValue =
      searchType === "city"
        ? value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        : value.padStart(4, "0");

    return allResults.find((item) => {
      const itemValue =
        searchType === "city"
          ? item.column_2
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          : item.column_1;

      return itemValue === normalizedValue;
    });
  }, [allResults, value, searchType]);

  const handleSelect = useCallback(
    (item: PostalData) => {
      onChange({
        city: item.column_2,
        postalCode: item.column_1,
      });
      setSearch("");
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setSearch("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {displayValue
            ? searchType === "city"
              ? displayValue.column_2
              : displayValue.column_1
            : `Sélectionnez ${searchType === "city" ? "une ville" : "un code postal"}...`}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Rechercher ${searchType === "city" ? "une ville" : "un code postal"}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && (
              <CommandItem className="justify-center">
                <Loader2 className="size-4 animate-spin" />
              </CommandItem>
            )}
            {!isLoading && allResults.length === 0 && (
              <CommandEmpty>Aucun résultat</CommandEmpty>
            )}
            {allResults.length > 0 && (
              <CommandGroup>
                {allResults.map((item) => (
                  <CommandItem
                    key={`${item.column_1}-${item.column_2}`}
                    onSelect={() => handleSelect(item)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div>
                        {searchType === "city" ? (
                          <>
                            <span className="font-medium">{item.column_2}</span>
                            <span className="ml-2 text-muted-foreground">
                              ({item.column_1})
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium">{item.column_1}</span>
                            <span className="ml-2 text-muted-foreground">
                              {item.column_2}
                            </span>
                          </>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          (
                            searchType === "city"
                              ? item.column_2.toLowerCase() ===
                                value.toLowerCase()
                              : item.column_1 === value.padStart(4, "0")
                          )
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
