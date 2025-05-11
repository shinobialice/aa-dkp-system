import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state, device_id } = req.query;

  if (
    typeof code !== "string" ||
    typeof state !== "string" ||
    typeof device_id !== "string"
  ) {
    return res.status(400).send("Missing query params");
  }

  const cookies = parse(req.headers.cookie || "");
  const savedState = cookies.vk_state;
  const codeVerifier = cookies.vk_code_verifier;

  if (!savedState || !codeVerifier || state !== savedState) {
    return res.status(400).send("Invalid state or verifier");
  }

  // Exchange code for access_token
  const tokenRes = await fetch("https://id.vk.com/oauth2/auth", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.VK_CLIENT_ID!,
      redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/vk/callback",
      code,
      code_verifier: codeVerifier,
      device_id,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return res.status(400).json({
      error: "Token exchange failed",
      data: tokenData,
    });
  }

  // Optionally fetch user info (avatar, name)
  const userInfoRes = await fetch("https://id.vk.com/oauth2/user_info", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: tokenData.access_token,
      client_id: process.env.VK_CLIENT_ID!,
    }),
  });

  const { user } = await userInfoRes.json();

  // 👇 Здесь можно авторизовать или создать пользователя в БД
  console.log("VK User:", user);

  // Простой редирект в личный кабинет (или куда хочешь)
  res.redirect("/dashboard");
}
