import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";

import { datasets, DATA_VERSION } from "@/lib/utils";

export async function GET() {
  try {
    const allData: Record<string, Record<string, string>[]> = {};

    for (const ds of datasets) {
      const csvPath = path.join(process.cwd(), "processed_data", `${ds}.csv`);

      const file = await fs.readFile(csvPath, "utf8");

      const parsed = Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        console.error(`CSV parse error in ${ds}:`, parsed.errors);
        return NextResponse.json(
          { error: `Failed to parse dataset: ${ds}` },
          { status: 500 },
        );
      }

      allData[ds] = parsed.data;
    }

    return NextResponse.json(
      {
        version: DATA_VERSION,
        datasets: allData,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
    );
  } catch (err) {
    console.error("Failed to load datasets:", err);
    return NextResponse.json(
      { error: "Failed to load datasets" },
      { status: 500 },
    );
  }
}
