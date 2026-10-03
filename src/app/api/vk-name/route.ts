import { type NextRequest, NextResponse } from "next/server";
import { getVkRealNames } from "@/shared/lib/vkNames";

export async function GET(request: NextRequest) {
  const vkName = request.nextUrl.searchParams.get("username")?.trim();
  if (!vkName) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const names = await getVkRealNames([vkName]);
  const name = names[vkName.toLowerCase()];
  if (!name) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ name });
}
