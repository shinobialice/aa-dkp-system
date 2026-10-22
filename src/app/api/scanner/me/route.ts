import { NextResponse } from "next/server";
import { getScannerUser } from "@/server/scanner/auth";

export async function GET(request: Request) {
  const user = await getScannerUser(request);
  if (!user) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }
  return NextResponse.json({ id: user.id, username: user.username });
}
