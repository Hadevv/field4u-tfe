import { route } from "@/lib/safe-route";
import { NextResponse } from "next/server";
import { z } from "zod";
import { LocationService } from "@/lib/geo/location-utils";

const SearchParamsSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

export const GET = route
  .query(SearchParamsSchema)
  .handler(async (req, { query }) => {
    const lat = parseFloat(query.lat);
    const lng = parseFloat(query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "invalid coordinates" },
        { status: 400 },
      );
    }

    try {
      const locationInfo = await LocationService.getLocationInfo(lat, lng);

      if (!locationInfo.success) {
        return NextResponse.json(
          { error: "geocoding failed" },
          { status: 500 },
        );
      }

      return NextResponse.json(locationInfo);
    } catch (error) {
      console.error("error in geocode API:", error);
      return NextResponse.json(
        { error: "geocoding service error" },
        { status: 500 },
      );
    }
  });
