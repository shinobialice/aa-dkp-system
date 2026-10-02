import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const UPLOADS_DIR = process.env.UPLOADS_DIR || "/data/uploads";
const DEV_FALLBACK_URL =
  process.env.NODE_ENV === "development"
    ? process.env.UPLOADS_FALLBACK_URL?.replace(/\/+$/, "")
    : undefined;

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

async function fetchFromFallback(segments: string[]) {
  if (!DEV_FALLBACK_URL) return null;
  const url = `${DEV_FALLBACK_URL}/api/uploads/${segments.map(encodeURIComponent).join("/")}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return {
      data: new Uint8Array(await response.arrayBuffer()),
      contentType: response.headers.get("content-type"),
    };
  } catch {
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  const root = path.resolve(UPLOADS_DIR);
  const filePath = path.resolve(root, ...segments);

  // Защита от выхода за пределы папки загрузок через "../".
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    const remote = await fetchFromFallback(segments);
    if (remote) {
      return new NextResponse(remote.data, {
        headers: {
          "Content-Type": remote.contentType ?? "application/octet-stream",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
