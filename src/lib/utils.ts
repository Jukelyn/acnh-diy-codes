import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Bump this when CSV files are updated
 * This makes cache invalidation automatic because the URL changes.
 */
export const DATA_VERSION = "2026";

/**
 * Add or remove as needed.
 */
export const datasets = [
  "accessories",
  "artwork",
  "bags",
  "bottoms",
  "ceiling_decor",
  "clothing_other",
  "dress_up",
  "fencing",
  "fish",
  "floors",
  "fossils",
  "gyroids",
  "headwear",
  "housewares",
  "insects",
  "interior_structures",
  "miscellaneous",
  "music",
  "other",
  "photos",
  "posters",
  "recipes",
  "rugs",
  "sea_creatures",
  "shoes",
  "socks",
  "tools_goods",
  "tops",
  "umbrellas",
  "wall_mounted",
  "wallpaper",
];
