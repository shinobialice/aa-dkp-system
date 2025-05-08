import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.pathname.split("/").pop();

  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 400 });
  }

  const { data: result, error } = await supabase
    .from("link_token")
    .select("*, user(username)")
    .eq("token", token)
    .maybeSingle();

  if (
    error ||
    !result ||
    result.used ||
    new Date(result.expiresAt) < new Date()
  ) {
    return NextResponse.json({ error: "Invalid or expired" }, { status: 404 });
  }

  return NextResponse.json({
    username: result.user?.username,
    expiresAt: new Date(result.expiresAt).toISOString(),
  });
}
