import { useQuery } from "@tanstack/react-query";

export type BelgianPostalItem = {
  code_postal: string;
  localite: string;
};

export type PostalMapData = {
  byCity: Map<string, string[]>;
  byPostal: Map<string, string[]>;
  allItems: BelgianPostalItem[];
};

const POSTAL_QUERY_OPTIONS = {
  staleTime: 1000 * 60 * 60 * 24,
  cacheTime: 1000 * 60 * 60 * 24 * 7,
  retry: 3,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
  refetchOnWindowFocus: false,
};

async function fetchPostalData(): Promise<PostalMapData> {
  // récupérer les données depuis l'api
  const response = await fetch("/api/belgian-postal");

  if (!response.ok) {
    throw new Error(
      `échec de récupération des codes postaux: ${response.status}`,
    );
  }

  const items = (await response.json()) as BelgianPostalItem[];
  const byCity = new Map<string, string[]>();
  const byPostal = new Map<string, string[]>();

  for (const item of items) {
    if (!byCity.has(item.localite)) {
      byCity.set(item.localite, []);
    }
    byCity.get(item.localite)?.push(item.code_postal);
    if (!byPostal.has(item.code_postal)) {
      byPostal.set(item.code_postal, []);
    }
    byPostal.get(item.code_postal)?.push(item.localite);
  }
  for (const [key, values] of byCity.entries()) {
    byCity.set(key, [...new Set(values)]);
  }

  for (const [key, values] of byPostal.entries()) {
    byPostal.set(key, [...new Set(values)]);
  }

  return {
    byCity,
    byPostal,
    allItems: items,
  };
}

export function useBelgianPostalData() {
  const { data, isLoading, isError, error, refetch } = useQuery<PostalMapData>({
    queryKey: ["belgian-postal-data"],
    queryFn: fetchPostalData,
    ...POSTAL_QUERY_OPTIONS,
  });

  const getCitiesForPostalCode = (postalCode: string): string[] => {
    if (!data) return [];
    return data.byPostal.get(postalCode) || [];
  };

  const getPostalCodesForCity = (city: string): string[] => {
    if (!data) return [];
    return data.byCity.get(city) || [];
  };

  const searchPostalData = (
    query: string,
    type: "city" | "postal" = "city",
    limit = 10,
  ): BelgianPostalItem[] => {
    if (!data || !query || query.length < 2) return [];

    const searchLower = query.toLowerCase().trim();

    if (type === "city") {
      return data.allItems
        .filter((item) => item.localite.toLowerCase().includes(searchLower))
        .sort((a, b) => {
          const aStarts = a.localite.toLowerCase().startsWith(searchLower);
          const bStarts = b.localite.toLowerCase().startsWith(searchLower);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localite.localeCompare(b.localite);
        })
        .slice(0, limit);
    } else {
      return data.allItems
        .filter((item) => item.code_postal.includes(searchLower))
        .sort((a, b) => {
          const aStarts = a.code_postal.startsWith(searchLower);
          const bStarts = b.code_postal.startsWith(searchLower);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.code_postal.localeCompare(b.code_postal);
        })
        .slice(0, limit);
    }
  };

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    getCitiesForPostalCode,
    getPostalCodesForCity,
    searchPostalData,
  };
}
