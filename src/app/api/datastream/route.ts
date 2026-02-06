// Streaming + parsing CSV
import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import path from "path";
import Papa from "papaparse";
import { datasets, DATA_VERSION } from "@/lib/utils";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(`{"version":"${DATA_VERSION}","datasets":{`),
        );

        for (let i = 0; i < datasets.length; i++) {
          const ds = datasets[i];
          const csvPath = path.join(
            process.cwd(),
            "processed_data",
            `${ds}.csv`,
          );

          // Add key for the dataset
          controller.enqueue(encoder.encode(`"${ds}":[`));

          await new Promise((resolve, reject) => {
            let firstRow = true;
            const nodeStream = createReadStream(csvPath, "utf8");

            Papa.parse(nodeStream, {
              header: true,
              skipEmptyLines: true,
              step: (results) => {
                // Add a comma between objects, but not before the first one
                const chunk =
                  (firstRow ? "" : ",") + JSON.stringify(results.data);
                controller.enqueue(encoder.encode(chunk));
                firstRow = false;
              },
              complete: resolve,
              error: reject,
            });
          });

          controller.enqueue(encoder.encode("]"));

          // Add comma if there's another dataset coming
          if (i < datasets.length - 1) {
            controller.enqueue(encoder.encode(","));
          }
        }

        // Close the JSON
        controller.enqueue(encoder.encode("}}"));
        controller.close();
      } catch (err) {
        console.error("Streaming error:", err);
        controller.error(err);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Transfer-Encoding": "chunked",
    },
  });
}

/**
useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/datastream?v=${DATA_VERSION}`);

        if (!res.ok) throw new Error("Failed to fetch");
        if (!res.body) throw new Error("No body in response");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        let allProcessedItems: CSVItem[] = [];

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (cancelled) {
            await reader.cancel();
            return;
          }

          buffer += decoder.decode(value, { stream: true });

          // 2. Get valid JSON objects from the buffer
          // This regex looks for {} objects in the arrays
          const regex = /{[^{}]*}/g;
          let match;
          let lastIndex = 0;
          const newBatch: CSVItem[] = [];

          while ((match = regex.exec(buffer)) !== null) {
            try {
              const item = JSON.parse(match[0]) as CSVItem;

              
              if (!ITEM_BLACKLIST.has(item["Internal ID as hex"])) {
                newBatch.push(item);
              }
              lastIndex = regex.lastIndex;
            } catch (e) {
              // If it's a partial object, the regex might catch it prematurely
              // but JSON.parse will fail. Stop + wait for more data.
              break;
            }
          }

          buffer = buffer.slice(lastIndex);

          if (newBatch.length > 0) {
            allProcessedItems = [...allProcessedItems, ...newBatch];
            setData([...allProcessedItems]);
          }
        }

        // Sort once everything is in
        if (!cancelled) {
          setData((prev) =>
            [...prev].sort((a, b) => a.Name.localeCompare(b.Name)),
          );
        }
      } catch (err) {
        console.error("Streaming error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);
 */
