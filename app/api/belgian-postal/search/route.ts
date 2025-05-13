import { NextResponse } from "next/server";
import { BelgianPostalItem } from "../route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const type = searchParams.get("type") || "city"; // "city" ou "postal"
    const limit = parseInt(searchParams.get("limit") || "15");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // récupération des données depuis l'API
    const res = await fetch(
      `${new URL(request.url).origin}/api/belgian-postal`,
      {
        next: { revalidate: 3600 }, // revalider toutes les heures
      },
    );

    if (!res.ok) {
      throw new Error(`erreur récupération données postales (${res.status})`);
    }

    const items = (await res.json()) as BelgianPostalItem[];
    const searchLower = query.toLowerCase().trim();

    // recherche selon le type (ville ou code postal)
    let results: BelgianPostalItem[] = [];
    if (type === "city") {
      // recherche par ville
      results = items
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
      results = items
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
  } catch (error) {
    console.error("erreur recherche codes postaux:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "erreur inconnue",
        results: [],
      },
      { status: 500 },
    );
  }
}
