// pages/api/auth/vk/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;
  const savedState = req.cookies["vk_state"];
  const codeVerifier = req.cookies["vk_code_verifier"];

  if (!code || typeof code !== "string" || state !== savedState) {
    return res.status(400).send("Invalid state");
  }

  const deviceId = crypto.randomUUID();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.VK_CLIENT_ID!,
    redirect_uri: "https://your.site/api/auth/vk/callback",
    code,
    code_verifier: codeVerifier!,
    device_id: deviceId,
  });

  const tokenRes = await fetch("https://id.vk.com/oauth2/auth", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return res
      .status(400)
      .json({ error: "Token exchange failed", data: tokenData });
  }

  // 👇 ВСТАВЛЯЕШЬ ЗДЕСЬ
  const userInfoRes = await fetch("https://id.vk.com/oauth2/user_info", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: tokenData.access_token,
      client_id: process.env.VK_CLIENT_ID!,
    }),
  });

  const userInfo = await userInfoRes.json();

  // ТЕПЕРЬ МОЖНО:
  // - найти пользователя в базе по VK ID
  // - создать нового, если не существует
  // - выдать сессию (через cookie / JWT / auth-стейт)

  console.log("VK User Info:", userInfo);

  // редиректим авторизованного юзера
  res.redirect("/dashboard");
}
