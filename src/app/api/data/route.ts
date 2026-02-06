// Streaming + Parsing json
import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import path from "path";

export async function GET() {
  const jsonPath = path.join(process.cwd(), "src", "lib", "data.json");

  // Create a Node.js Readable stream
  const nodeStream = createReadStream(jsonPath);

  // Convert Node stream to Web Stream (Next.js requirement)
  const stream = new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/json",
      // Keep your caching strategy
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

/**
useEffect(() => {
  let cancelled = false;

  async function loadAll() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/data?v=${DATA_VERSION}`);
      
      if (!res.ok) throw new Error("Failed to fetch");
      if (!res.body) throw new Error("No body in response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let allItems: CSVItem[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (cancelled) {
          reader.cancel();
          return;
        }

        buffer += decoder.decode(value, { stream: true });

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
            break;
          }
        }

        buffer = buffer.slice(lastIndex);

        if (newBatch.length > 0) {
          allItems = [...allItems, ...newBatch];
          setData([...allItems]);
        }
      }

      if (!cancelled) {
        setData((current) => [...current].sort((a, b) => 
          a.Name.localeCompare(b.Name)
        ));
      }

    } catch (err) {
      console.error("Streaming error:", err);
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  }

  loadAll();
  return () => { cancelled = true; };
}, []);
 */
