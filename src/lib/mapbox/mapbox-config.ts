/**
 * configuration pour mapbox
 */
import { env } from "@/lib/env";

export const MAPBOX_ACCESS_TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const MAP_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

export const DEFAULT_CENTER = [4.6667145, 50.6402809];
export const DEFAULT_ZOOM = 8;
export const FIELD_ZOOM = 15;
