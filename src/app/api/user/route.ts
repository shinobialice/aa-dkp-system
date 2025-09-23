import { hasTag } from "@/actions/hasTag";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return NextResponse.json(
      { hasTag: false, error: "Missing token" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");

  if (!tag) {
    return NextResponse.json(
      { hasTag: false, error: "Missing tag param" },
      { status: 400 },
    );
  }

  try {
    const isValid = await hasTag(token, ["ADMIN"]);
    return NextResponse.json({ hasTag: isValid }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ hasTag: false, error }, { status: 500 });
  }
}
