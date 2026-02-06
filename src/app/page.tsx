"use client";

import { useState, useEffect, useMemo } from "react";

import { CopyButton } from "@/components/ui/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/disclaimer";
import { Footer } from "@/components/footer";
import { PrefixSelector } from "@/components/prefix-selector";
import { SelectedItemsTable } from "@/components/SelectedItemsTable";
import { ItemSearchSection } from "@/components/ItemSearchSection";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ThemeToggle";

import {
  DATA_VERSION,
  getEncodedItemVariant,
  ITEM_BLACKLIST,
  unpackTuple,
} from "@/lib/utils";

import { CSVItem, SelectedItem } from "@/lib/types";

export default function App() {
  const [data, setData] = useState<CSVItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prefix, setPrefix] = useState("$");

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/data?v=${DATA_VERSION}`);

        if (!res.ok) {
          throw new Error("Failed to fetch all datasets");
        }

        const json = await res.json();

        const merged = (
          Object.values(json.datasets).flat() as CSVItem[]
        ).filter((item) => !ITEM_BLACKLIST.has(item["Internal ID as hex"]));

        const sortedMerged = [...merged].sort((a, b) =>
          a.Name.localeCompare(b.Name),
        );

        if (!cancelled) {
          setData(sortedMerged);
        }
      } catch (err) {
        console.error("Failed to load datasets:", err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const uniqueNames = new Map<string, CSVItem>();

    data.forEach((item) => {
      const matches = query === "" || item.Name.toLowerCase().includes(query);

      if (matches && !uniqueNames.has(item.Name)) {
        uniqueNames.set(item.Name, item);
      }
    });

    return Array.from(uniqueNames.values());
  }, [searchQuery, data]);

  const getVariationsForItem = (itemName: string) => {
    const variations = new Set<string>();
    data.forEach((item) => {
      if (item.Name === itemName && item.Variation) {
        variations.add(item.Variation);
      }
    });
    return Array.from(variations);
  };

  const getPatternsForItem = (itemName: string) => {
    const patterns = new Set<string>();
    data.forEach((item) => {
      if (item.Name === itemName && item.Pattern) {
        patterns.add(item.Pattern);
      }
    });
    return Array.from(patterns);
  };

  const getItemData = (
    itemName: string,
    variation: string,
    pattern: string,
  ): CSVItem | undefined => {
    return data.find(
      (item) =>
        item.Name === itemName &&
        (item.Variation === variation || (!item.Variation && !variation)) &&
        (item.Pattern === pattern || (!item.Pattern && !pattern)),
    );
  };

  const addItem = (item: CSVItem) => {
    const variations = getVariationsForItem(item.Name);
    const patterns = getPatternsForItem(item.Name);

    const newItem: SelectedItem = {
      ...item,
      id: `${item.Name}-${Date.now()}`,
      selectedVariation: variations[0] || "",
      selectedPattern: patterns[0] || "",
    };

    const matchingItem = getItemData(
      item.Name,
      newItem.selectedVariation,
      newItem.selectedPattern,
    );
    if (matchingItem) {
      newItem["Variant ID"] = matchingItem["Variant ID"];
      newItem["Internal ID"] = matchingItem["Internal ID"];
      newItem["Internal ID as hex"] = matchingItem["Internal ID as hex"];
      newItem["Variant Pattern Encoded"] =
        matchingItem["Variant Pattern Encoded"];
    }

    setSelectedItems((prev) => [...prev, newItem]);
    setSearchQuery("");
  };

  const updateItemVariation = (id: string, variation: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const matchingItem = getItemData(
            item.Name,
            variation,
            item.selectedPattern,
          );
          return {
            ...item,
            selectedVariation: variation,
            "Variant ID": matchingItem?.["Variant ID"] || item["Variant ID"],
            "Internal ID": matchingItem?.["Internal ID"] || item["Internal ID"],
            "Internal ID as hex":
              matchingItem?.["Internal ID as hex"] ||
              item["Internal ID as hex"],
            "Variant Pattern Encoded":
              matchingItem?.["Variant Pattern Encoded"] ||
              item["Variant Pattern Encoded"],
          };
        }
        return item;
      }),
    );
  };

  const updateItemPattern = (id: string, pattern: string) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const matchingItem = getItemData(
            item.Name,
            item.selectedVariation,
            pattern,
          );
          return {
            ...item,
            selectedPattern: pattern,
            "Variant ID": matchingItem?.["Variant ID"] || item["Variant ID"],
            "Internal ID": matchingItem?.["Internal ID"] || item["Internal ID"],
            "Internal ID as hex":
              matchingItem?.["Internal ID as hex"] ||
              item["Internal ID as hex"],
            "Variant Pattern Encoded":
              matchingItem?.["Variant Pattern Encoded"] ||
              item["Variant Pattern Encoded"],
          };
        }
        return item;
      }),
    );
  };

  const orderCommand = useMemo(() => {
    if (selectedItems.length === 0) return "";

    const encodedItems = selectedItems.map((item) => {
      // Unpack var pat encoding into separate variables
      const { variant, pattern } = unpackTuple(item["Variant Pattern Encoded"]);

      // Pass the item hex ID and the unpacked variables
      return getEncodedItemVariant(
        item["Internal ID as hex"],
        variant,
        pattern,
      );
    });

    return `${prefix}order ${encodedItems.join(" ")}`;
  }, [selectedItems, prefix]);

  return (
    <div>
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex-1" />
            <h1 className="text-3xl font-bold">Omega ToGo Order Maker</h1>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </header>

          <Disclaimer />

          <ItemSearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            addItem={addItem}
            isLoading={isLoading}
          />

          <SelectedItemsTable
            items={selectedItems}
            onRemove={(id) =>
              setSelectedItems((prev) => prev.filter((i) => i.id !== id))
            }
            onAdd={addItem}
            getVariations={getVariationsForItem}
            getPatterns={getPatternsForItem}
            onUpdateVariation={(id, newVariation) => {
              updateItemVariation(id, newVariation);
            }}
            onUpdatePattern={(id, newPattern) => {
              updateItemPattern(id, newPattern);
            }}
            onClear={() => setSelectedItems([])}
          />
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CardTitle>Order Command</CardTitle>
                  <CopyButton
                    variant="outline"
                    size="icon-xs"
                    value={orderCommand}
                  />
                </div>
                <PrefixSelector onPrefixChange={setPrefix} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                className="min-h-24 font-mono resize-none"
                placeholder="[prefix]order ..."
                value={orderCommand}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
