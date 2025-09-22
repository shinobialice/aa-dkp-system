import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { hasTag } from "@/actions/hasTag";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies["session_token"];

  if (!token) {
    return NextResponse.json(
      { hasTag: false, error: "Missing token" },
      { status: 401 },
    );
  }

  const tag = req.query.tag as string;
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
