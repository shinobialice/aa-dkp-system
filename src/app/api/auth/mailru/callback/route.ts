import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

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
      redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/mailru/callback",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: "Token exchange failed", data: tokenData },
      { status: 400 },
    );
  }

  // Получаем данные пользователя
  const userInfoRes = await fetch(
    `https://oauth.mail.ru/userinfo?access_token=${tokenData.access_token}`,
  );
  const profile = await userInfoRes.json();

  if (!profile.id) {
    return NextResponse.json("Failed to fetch user profile", { status: 400 });
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

    if (!linkRow) {
      return NextResponse.json("Invalid link token", { status: 400 });
    }

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

    const response = NextResponse.redirect(
      new URL("/link-account/complete", req.url),
    );

    response.cookies.set("link-token", "", { path: "/", maxAge: -1 });
    response.cookies.set("session_token-token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  }

  // Обычный вход: только если mail_id уже привязан
  const sessionToken = generateSessionToken();

  const { data: existingUser } = await supabase
    .from("user")
    .select("*")
    .eq("mail_id", profile.id)
    .single();

  if (!existingUser) {
    return NextResponse.redirect(new URL("/login-error", req.url));
  }

  await supabase
    .from("user")
    .update({ session_token: sessionToken })
    .eq("id", existingUser.id);

  const response = NextResponse.redirect(new URL("/", req.url));

  response.cookies.set("session_token", sessionToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
