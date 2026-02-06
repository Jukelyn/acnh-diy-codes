"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Search, Plus } from "lucide-react";
import { CSVItem } from "@/lib/types";
import { Button } from "./ui/button";

interface ItemSearchSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: CSVItem[];
  addItem: (item: CSVItem) => void;
  isLoading: boolean;
}

export function ItemSearchSection({
  searchQuery,
  setSearchQuery,
  searchResults,
  addItem,
  isLoading,
}: ItemSearchSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const SEARCH_LIMIT = 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Items ({searchResults.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            autoFocus
            placeholder="Search for items by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            className={searchResults.length == 0 ? "text-red-400" : ""}
          />
          {isOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-accent-foreground/60 bg-popover shadow-xl">
              <ScrollArea className="h-60 w-full rounded-md p-1">
                <div className="flex flex-col">
                  {searchResults.slice(0, SEARCH_LIMIT).map((item) => (
                    <Button
                      variant="ghost"
                      key={item.Name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addItem(item);
                        setIsOpen(false);
                      }}
                      className="cursor-pointer flex w-full items-center justify-between px-4 py-2 text-left hover:bg-accent rounded-sm"
                    >
                      <span className="capitalize">{item.Name}</span>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        {isLoading && (
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        )}
      </CardContent>
    </Card>
  );
}
