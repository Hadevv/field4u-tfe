import { NextResponse } from "next/server";

/**
 * test de l'api odwb
 */
export async function GET() {
  try {
    // appel à l'api odwb
    const url =
      "https://www.odwb.be/api/explore/v2.1/catalog/datasets/code-postaux-belge/records?limit=5";

    console.log("test api: appel vers", url);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Field4u-Gleaning-App",
      },
    });

    if (!response.ok) {
      throw new Error(
        `échec de la requête: ${response.status} ${response.statusText}`,
      );
    }

    const rawData = await response.text();
    console.log("réponse brute:", rawData.substring(0, 200) + "...");

    try {
      const data = JSON.parse(rawData);
      return NextResponse.json({
        status: "success",
        apiStatus: response.status,
        totalCount: data.total_count,
        results: data.results,
        rawDataPreview: rawData.substring(0, 200) + "...",
      });
    } catch (parseError) {
      return NextResponse.json(
        {
          status: "json_parse_error",
          error:
            parseError instanceof Error
              ? parseError.message
              : "erreur de parsing json",
          rawData: rawData,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("erreur test api belgian-postal:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "erreur inconnue",
      },
      { status: 500 },
    );
  }
}
