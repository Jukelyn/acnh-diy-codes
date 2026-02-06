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

/**
 * These items are stick items and should not be requested therefore I will opt
 * to just blacklist them from the search. Some of the items here have their
 * "good" versions that won't stick and those are searchable (e.g. glowing moss,
 *  vine, etc.).
 */
export const ITEM_BLACKLIST = new Set<string>([
  // Moss
  "02F7",
  // Vine
  "02F8",
  // Meuniere
  "35D3",
  // Pumpkin Pie
  "35D6",
  // Weeds
  "02F6",
  // Clam chowder
  "35D5",
  // Gratin
  "35D4",
  // Bridge construction kit
  "01CA",
  // Bridge construction kit
  "1C2B",
  // Dream bridge kit
  "038D",
  // Bridge marker kit
  "10D6",
  // Campsite construction kit
  "142E",
  // Campsite construction kit
  "01CD",
  // Campsite moving kit
  "1AB9",
  // Shop construction kit
  "0AC4",
  // Tailors construction kit
  "113B",
  // Dream moving kit
  "038A",
  // Moving kit
  "14EE",
  // Shop Moving kit
  "14F0",
  // Museum Moving kit
  "14F1",
  // Tailors Moving kit
  "14EF",
  // Housing kit
  "0D15",
  // Plot 1 housing kit
  "16C3",
  // Plot 2 housing kit
  "16C4",
  // Plot 3 housing kit
  "16C5",
  // Delivery box
  "1095",
  // Decorated cedar tree
  "373D",
  // Gift
  "35E1",
  // Message bottle
  "16A1",
  // Pocket Organization Guide
  "235C",
  // Various permits
  "2245",
  "2246",
  "2247",
  "2248",
  "2249",
  "224A",
  "224B",
  "224C",
  "224D",
  "262B",
  // Customizable Phone Case Kit
  "2238",
  // Other Phone Apps
  "2F99",
  "338B",
  "374E",
  "3964",
  "3966",
  // Present
  "1180",
  // Viva Festivale Reaction Set
  "36EC",
  // New Reactions Reactions Notebook
  "39EC",
  // Recipe
  "1E37",
  // Rock
  "3738",
  // Tent
  "0ABE",
  // Blather's Tent Marker
  "0AC3",
  // Transfer Kit
  "3422",
  // Treasure
  "09F1",
  // Wallpaper
  "02F1",
  // Wisp spirit piece
  "125E",
  // Produce Start
  "02F5",
  // Ladder set-up kit
  "02EF",
  // Hairstyles
  "2359",
  "235A",
  "35C6",
  "39ED",
  // Be a Chef! DIY Recipes+
  "3963",
  // Body-Paint Costume Tips
  "33C8",
  // Exploring new eye colors
  "33C9",
  // Hip Reaction Collection
  "352A",
  // Island Life 101 Service
  "39CC",
  // Pretty Good Tools Recipes
  "2405",
  // Pro Camera App
  "3967",
  // Pro Construction License
  "3A42",
  // Pro Decorating License
  "3965",
  // Tool Ring: It's Essential!
  "2590",
  // Ultimate Pocket Stuffing
  "2B84",
]);
