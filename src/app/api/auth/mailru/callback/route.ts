import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBaseUrl } from "@/shared/lib";
import {
  completeSocialAuth,
  loginErrorRedirect,
} from "@/shared/lib/socialAuth";

const baseUrl = getBaseUrl();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (typeof code !== "string" || typeof state !== "string") {
    return NextResponse.json("Missing query params", { status: 400 });
  }

  const cookieStore = await cookies();

  const linkToken = cookieStore.get("link-token")?.value;
  const savedState = cookieStore.get("mailru_state")?.value;

  if (state !== savedState) {
    return NextResponse.json("Invalid state", { status: 400 });
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
      redirect_uri: `${baseUrl}/api/auth/mailru/callback`,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.error("Token exchange failed:", tokenData);
    return loginErrorRedirect("provider");
  }

  // Получаем данные пользователя
  const userInfoRes = await fetch(
    `https://oauth.mail.ru/userinfo?access_token=${tokenData.access_token}`,
  );
  const profile = await userInfoRes.json();

  if (!profile.id) {
    return loginErrorRedirect("provider");
  }

  return completeSocialAuth("mail_id", String(profile.id), linkToken);
}
