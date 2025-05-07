import axios from "axios";
import { NextRequest } from "next/server";
import extractNamesFromReadOCR from "@/src/utils/AI/extractNamesFromOCR";

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
    const buffer = Buffer.from(arrayBuffer);

    const postRes = await axios.post(
      `${process.env.AZURE_ENDPOINT}/vision/v3.2/read/analyze`,
      buffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY!,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    const operationLocation = postRes.headers["operation-location"];

    if (!operationLocation) {
      return new Response(
        JSON.stringify({ error: "No operation location returned" }),
        { status: 500 }
      );
    }

    let resultData;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const getRes = await axios.get(operationLocation, {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY!,
        },
      });

      if (getRes.data.status === "succeeded") {
        resultData = getRes.data.analyzeResult;
        break;
      } else if (getRes.data.status === "failed") {
        return new Response(JSON.stringify({ error: "OCR failed" }), {
          status: 500,
        });
      }
    }

    if (!resultData) {
      return new Response(
        JSON.stringify({ error: "Timed out waiting for OCR result" }),
        { status: 504 }
      );
    }

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
