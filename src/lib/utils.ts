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

/**
 * Encode an item ID with either one or two customization options into a
 * 16-digit hex string.
 *
 * @param itemId - The item ID as a hex string.
 * @param variation - Variation index (typically 0-9). Defaults to 0.
 * @param pattern - Pattern value (must be a multiple of 32). Defaults to 0.
 * @returns 16-character hex string encoding.
 */
export function getEncodedItemVariant(
  itemId: string,
  variation: number = 0,
  pattern: number = 0,
): string {
  if (!Number.isInteger(variation)) {
    throw new TypeError("Variation needs to be an integer.");
  }

  if (!Number.isInteger(pattern)) {
    throw new TypeError("Pattern needs to be an integer.");
  }

  if (pattern % 32 !== 0) {
    throw new Error("Pattern needs to be a multiple of 32.");
  }

  // If both variants are zero, return the itemId as-is (default item)
  if (variation === 0 && pattern === 0) {
    return itemId;
  }

  // Combine pattern and variation, convert to hex, and pad to 2 chars
  const combinedHex = (pattern + variation)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");

  // Build the 16-character string: 6 zeros + hex pair + 4 zeros + itemId
  // itemID is always 4-digits
  return `000000${combinedHex}0000${itemId}`;
}

/**
 * I stored the variant + pattern data as a Python tuple that is read here
 * as a string so I have to parse that and seperate them to use
 *
 * @param tupleStr - The variant and pattern tuple string
 * @returns The variant and pattern parts.
 */
export const unpackTuple = (tupleStr: string | undefined) => {
  if (!tupleStr) return { variant: 0, pattern: 0 };

  const matches = tupleStr.match(/\d+/g);

  if (!matches || matches.length < 2) return { variant: 0, pattern: 0 };

  return {
    variant: parseInt(matches[0], 10),
    pattern: parseInt(matches[1], 10),
  };
};
