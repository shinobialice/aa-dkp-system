import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { hasTag } from "@/src/actions/hasTag";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies["session_token"];

  if (!token) {
    return res.status(401).json({ hasTag: false, error: "Missing token" });
  }

  const tag = req.query.tag as string;
  if (!tag) {
    return res.status(400).json({ hasTag: false, error: "Missing tag param" });
  }

  try {
    const isValid = await hasTag(token, ["ADMIN"]);
    return res.status(200).json({ hasTag: isValid });
  } catch (error) {
    return res.status(500).json({ hasTag: false, error });
  }
}
