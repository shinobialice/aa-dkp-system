import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import supabase from "@/shared/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.session_token;

  if (!token) return res.status(401).send("Not authenticated");

  const { data: user } = await supabase
    .from("user")
    .select("id, username")
    .eq("session_token", token)
    .single();

  if (!user) return res.status(401).send("Invalid token");

  return res.status(200).json({
    id: user.id,
    name: user.username,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`,
  });
}
