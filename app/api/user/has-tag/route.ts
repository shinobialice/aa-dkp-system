import { NextResponse } from "next/server";
import { hasUserTag } from "@/src/actions/hasUserTag";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") ?? "";

  const hasTag = await hasUserTag(tag);
  return NextResponse.json({ hasTag });
}
