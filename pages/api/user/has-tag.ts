import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { createClient } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies["session_token"];

  if (!token) {
    return res.status(401).json({ hasTag: false, error: "Missing token" });
  }

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id")
    .eq("session_token", token)
    .single();

  if (!user || userError) {
    return res.status(401).json({ hasTag: false, error: "Invalid session" });
  }

  const tag = req.query.tag as string;
  if (!tag) {
    return res.status(400).json({ hasTag: false, error: "Missing tag param" });
  }

  const { data: tagRow, error: tagError } = await supabase
    .from("user_tags")
    .select("tag")
    .eq("user_id", user.id)
    .eq("tag", tag)
    .maybeSingle();

  if (tagError) {
    return res.status(500).json({ hasTag: false, error: tagError.message });
  }

  return res.status(200).json({ hasTag: !!tagRow });
}
