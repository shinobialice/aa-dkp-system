import axios from "axios";
import { NextRequest } from "next/server";
import extractNamesFromReadOCR from "@/utils/AI/extractNamesFromOCR";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const visionRes = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }],
            imageContext: { languageHints: ["ru", "en"] },
          },
        ],
      },
    );

    const annotation = visionRes.data.responses?.[0];

    if (annotation?.error) {
      return new Response(
        JSON.stringify({
          error: annotation.error.message ?? "Vision API error",
        }),
        { status: 500 },
      );
    }

    const words: {
      description: string;
      boundingPoly?: { vertices?: { x?: number; y?: number }[] };
    }[] = annotation?.textAnnotations?.slice(1) ?? [];

    const resultData = {
      readResults: [
        {
          lines: words.map((w) => {
            const vertices = w.boundingPoly?.vertices ?? [];
            const xs = vertices.map((v) => v.x ?? 0);
            const ys = vertices.map((v) => v.y ?? 0);
            return {
              text: w.description,
              box: vertices.length
                ? {
                    x: Math.min(...xs),
                    y: Math.min(...ys),
                    width: Math.max(...xs) - Math.min(...xs),
                    height: Math.max(...ys) - Math.min(...ys),
                  }
                : null,
            };
          }),
        },
      ],
    };

    const names = extractNamesFromReadOCR(resultData);

    return new Response(JSON.stringify({ names, raw: resultData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    let message = "Unknown error";

    if (err instanceof Error) {
      message = err.message;
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}
