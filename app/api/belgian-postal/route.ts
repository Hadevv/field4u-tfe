import { NextResponse } from "next/server";

//TODO utiliser redis pour stocker les données
/**
 * api de données des codes postaux belges
 *
 * # routes disponibles
 * - GET /api/belgian-postal : liste complète des codes postaux et villes
 * - GET /api/belgian-postal/search?query=xxx&type=city|postal : recherche des codes postaux/villes
 * - GET /api/belgian-postal/test : test direct de l'api externe odwb
 *
 * les données sont mises en cache côté serveur pour optimiser les performances
 */

export type BelgianPostalItem = {
  code_postal: string;
  localite: string;
};

// source https://www.odwb.be/explore/dataset/code-postaux-belge/api
const API_URL =
  "https://www.odwb.be/api/explore/v2.1/catalog/datasets/code-postaux-belge/records";
const PAGE_SIZE = 100;

// type de repons
type OdwbResponse = {
  total_count: number;
  results: Array<{
    column_1: string; // code postal
    column_2: string; // localité
    column_3?: number; // longitude
    column_4?: number; // latitude
    coordonnees?: {
      lon: number;
      lat: number;
    };
    municipality_name_french?: string;
    arrondissement?: string;
    province?: string | null;
  }>;
};

// fonction pour récupérer toutes les données
async function fetchAllPostalData(): Promise<BelgianPostalItem[]> {
  let allData: BelgianPostalItem[] = [];
  let start = 0;
  let total = 0;

  try {
    do {
      const url = `${API_URL}?limit=${PAGE_SIZE}&start=${start}`;
      const res = await fetch(url, {
        next: { revalidate: 86400 },
        headers: {
          "User-Agent": "Field4u-Gleaning-App",
        },
      });

      if (!res.ok)
        throw new Error(
          `échec de récupération depuis l'api odwb: ${res.status}`,
        );

      const json = (await res.json()) as OdwbResponse;

      if (!json.results || !Array.isArray(json.results)) {
        throw new Error(
          `format de réponse invalide: ${JSON.stringify(json).substring(0, 100)}...`,
        );
      }

      const records = json.results;
      total = json.total_count || 0;
      // format attendu
      const mapped = records.map((record) => ({
        code_postal: record.column_1,
        localite: record.column_2,
      }));

      allData = [...allData, ...mapped];
      start += PAGE_SIZE;

      console.log(`récupération des codes postaux: ${allData.length}/${total}`);
    } while (allData.length < total && start < total);

    return allData;
  } catch (error) {
    console.error("erreur dans fetchAllPostalData:", error);
    throw error;
  }
}

// stockage en mémoire
let postalCache: {
  data: BelgianPostalItem[] | null;
  timestamp: number;
} = { data: null, timestamp: 0 };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // route de recherche
    if (pathname.endsWith("/search")) {
      return handleSearchRequest(url.searchParams);
    }

    // route principale récupération de toutes les données
    return handleMainRequest();
  } catch (error) {
    console.error("erreur GET /api/belgian-postal:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "échec récupération données postales",
      },
      { status: 500 },
    );
  }
}

async function handleMainRequest() {
  const now = Date.now();
  const cacheAge = now - postalCache.timestamp;
  const ONE_HOUR = 60 * 60 * 1000;

  // utiliser le cache si disponible et récent (moins d'une heure)
  if (postalCache.data && postalCache.data.length > 0 && cacheAge < ONE_HOUR) {
    console.log(`utilisation du cache (${postalCache.data.length} éléments)`);
    return NextResponse.json(postalCache.data);
  }

  console.log("récupération des données fraîches");
  const data = await fetchAllPostalData();

  if (!data || data.length === 0) {
    throw new Error("aucune donnée récupérée");
  }

  // mettre à jour le cache
  postalCache = {
    data,
    timestamp: now,
  };

  console.log(`${data.length} codes postaux récupérés et mis en cache`);
  return NextResponse.json(data);
}

async function handleSearchRequest(searchParams: URLSearchParams) {
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "city";
  const limit = parseInt(searchParams.get("limit") || "15");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  let postalData: BelgianPostalItem[];

  const now = Date.now();
  const cacheAge = now - postalCache.timestamp;
  const ONE_HOUR = 60 * 60 * 1000;

  if (postalCache.data && postalCache.data.length > 0 && cacheAge < ONE_HOUR) {
    console.log(
      `utilisation du cache pour recherche (${postalCache.data.length} éléments)`,
    );
    postalData = postalCache.data;
  } else {
    console.log("récupération des données fraîches pour recherche");
    postalData = await fetchAllPostalData();

    postalCache = {
      data: postalData,
      timestamp: now,
    };
  }

  const searchLower = query.toLowerCase().trim();

  let results: BelgianPostalItem[] = [];
  if (type === "city") {
    // recherche par ville
    results = postalData
      .filter((item) => item.localite.toLowerCase().includes(searchLower))
      .sort((a, b) => {
        // priorité aux résultats qui commencent par la recherche
        const aStarts = a.localite.toLowerCase().startsWith(searchLower);
        const bStarts = b.localite.toLowerCase().startsWith(searchLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localite.localeCompare(b.localite);
      })
      .slice(0, limit);
  } else {
    // recherche par code postal
    results = postalData
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

  return NextResponse.json({ results });
}
