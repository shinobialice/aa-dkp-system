import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;

  if (typeof code !== "string" || typeof state !== "string") {
    return res.status(400).send("Missing query params");
  }

  const cookies = parse(req.headers.cookie || "");
  const linkToken = cookies["link-token"];
  const savedState = cookies["google_state"];

  if (state !== savedState) {
    return res.status(400).send("Invalid state");
  }

  // Получаем access_token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${baseUrl}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return res
      .status(400)
      .json({ error: "Token exchange failed", data: tokenData });
  }

  // Получаем инфу о пользователе
  const userInfoRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  const profile = await userInfoRes.json();

  if (!profile.id) {
    return res.status(400).send("Failed to fetch user profile");
  }

  // 🎯 Привязка по link-token
  if (linkToken) {
    const { data: linkRow } = await supabase
      .from("link_token")
      .select("userId")
      .eq("token", linkToken)
      .eq("used", false)
      .gt("expiresAt", new Date().toISOString())
      .single();

    if (!linkRow) {
      return res.status(400).send("Link token expired or invalid");
    }

    const sessionToken = generateSessionToken();

    await supabase
      .from("user")
      .update({
        google_id: profile.id,
        session_token: sessionToken,
      })
      .eq("id", linkRow.userId);

    await supabase
      .from("link_token")
      .update({ used: true })
      .eq("token", linkToken);

    res.setHeader("Set-Cookie", [
      serialize("link-token", "", { path: "/", maxAge: -1 }),
      serialize("session_token", sessionToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ]);

    return res.redirect("/link-account/complete");
  }

  // 🧍‍♂️ Обычный вход (без привязки)
  const sessionToken = generateSessionToken();

  const { data: existingUser } = await supabase
    .from("user")
    .select("*")
    .eq("google_id", profile.id)
    .single();

  if (!existingUser) {
    return res.redirect("/login-error");
  }

  await supabase
    .from("user")
    .update({ session_token: sessionToken })
    .eq("id", existingUser.id);

  res.setHeader(
    "Set-Cookie",
    serialize("session_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
  );

  return res.redirect("/");
}
