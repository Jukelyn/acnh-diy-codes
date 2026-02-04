"use client";

import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CSVItem, SelectedItem } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SelectedItemsTable } from "@/components/SelectedItemsTable";
import { SearchSection } from "@/components/SearchSection";
import { DATA_VERSION } from "@/lib/utils";

export default function App() {
  const [data, setData] = useState<CSVItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        const merged = Object.values(json.datasets).flat() as CSVItem[];
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

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex-1" />
            <h1 className="text-3xl font-bold">Omega ToGo Order Maker</h1>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </header>

          <SearchSection
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
          />

          <Card>
            <CardHeader>
              <CardTitle>Order Command</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                className="min-h-24 font-mono resize-none"
                placeholder="[prefix]order ..."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </TooltipProvider>
  );
}
