import { parse } from "cookie";
import { NextRequest } from "next/server";
import supabase from "./supabase";

export async function getUserFromRequest(req: NextRequest) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.session_token;

  if (!token) return null;

  const { data: user } = await supabase
    .from("user")
    .select("*")
    .eq("session_token", token)
    .single();

  return user || null;
}
