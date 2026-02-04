"use client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SelectedItem, CSVItem } from "@/lib/types";

import { ArrowUpDown, Plus, X } from "lucide-react";

interface Props {
  items: SelectedItem[];
  onRemove: (id: string) => void;
  onAdd: (item: CSVItem) => void;
  onUpdateVariation: (id: string, val: string) => void;
  onUpdatePattern: (id: string, val: string) => void;
  getVariations: (name: string) => string[];
  getPatterns: (name: string) => string[];
}

export function SelectedItemsTable({
  items,
  onRemove,
  onAdd,
  onUpdateVariation,
  onUpdatePattern,
  getVariations,
  getPatterns,
}: Props) {
  const columns: ColumnDef<SelectedItem>[] = [
    {
      accessorKey: "Name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue("Name") as string;

        return <div className="capitalize">{name}</div>;
      },
    },

    {
      id: "variation",
      header: "Variation",
      cell: ({ row }) => (
        <VariationSelect
          current={row.original.selectedVariation}
          options={getVariations(row.original.Name)}
          onSelect={(val) => onUpdateVariation(row.original.id, val)}
        />
      ),
    },

    {
      id: "pattern",
      header: "Pattern",
      cell: ({ row }) => (
        <VariationSelect
          current={row.original.selectedPattern}
          options={getPatterns(row.original.Name)}
          onSelect={(val) => onUpdatePattern(row.original.id, val)}
        />
      ),
    },

    {
      accessorKey: "Internal ID as hex",
      header: "Internal ID (hex)",
    },

    {
      accessorKey: "Variation ID",
      header: "Variation ID",
      cell: ({ row }) => {
        const variationID = row.original["Variant ID"];

        return <div>{variationID}</div>;
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex w-full justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={() => onAdd(row.original)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add another</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(row.original.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Remove</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Items ({items.length})</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={columns}
          data={items}
        />
      </CardContent>
    </Card>
  );
}

function VariationSelect({
  current,
  options,
  onSelect,
}: {
  current: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  if (!options.length) return <span>N/A</span>;

  return (
    <Select
      value={current}
      onValueChange={onSelect}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
