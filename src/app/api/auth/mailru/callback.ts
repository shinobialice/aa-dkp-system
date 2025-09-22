import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code, state } = req.query;

  if (typeof code !== "string" || typeof state !== "string") {
    return res.status(400).send("Missing query params");
  }

  const cookies = parse(req.headers.cookie || "");
  const linkToken = cookies["link-token"];
  const savedState = cookies["mailru_state"];

  if (state !== savedState) {
    return res.status(400).send("Invalid state");
  }

  // Обмениваем код на токен
  const tokenRes = await fetch("https://oauth.mail.ru/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.MAILRU_CLIENT_ID}:${process.env.MAILRU_CLIENT_SECRET}`,
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/mailru/callback",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return res
      .status(400)
      .json({ error: "Token exchange failed", data: tokenData });
  }

  // Получаем данные пользователя
  const userInfoRes = await fetch(
    `https://oauth.mail.ru/userinfo?access_token=${tokenData.access_token}`,
  );
  const profile = await userInfoRes.json();

  if (!profile.id) {
    return res.status(400).send("Failed to fetch user profile");
  }

  // Привязка к пользователю по link-token
  if (linkToken) {
    const { data: linkRow } = await supabase
      .from("link_token")
      .select("userId")
      .eq("token", linkToken)
      .eq("used", false)
      .gt("expiresAt", new Date().toISOString())
      .single();

    if (!linkRow) return res.status(400).send("Invalid link token");

    const sessionToken = generateSessionToken();

    await supabase
      .from("user")
      .update({
        mail_id: profile.id,
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

  // Обычный вход: только если mail_id уже привязан
  const sessionToken = generateSessionToken();

  const { data: existingUser } = await supabase
    .from("user")
    .select("*")
    .eq("mail_id", profile.id)
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
    }),
  );

  return res.redirect("/");
}
