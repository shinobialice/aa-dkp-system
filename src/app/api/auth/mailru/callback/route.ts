import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import sql from "@/shared/lib/db";
import { getBaseUrl } from "@/shared/lib";

const baseUrl = getBaseUrl();

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
      redirect_uri: `${baseUrl}/api/auth/mailru/callback`,
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
    const [linkRow] = await sql<any[]>`
      SELECT "userId" FROM link_token
      WHERE token = ${linkToken} AND used = false AND "expiresAt" > now()
    `;

    if (!linkRow) {
      return NextResponse.json("Invalid link token", { status: 400 });
    }

    const sessionToken = generateSessionToken();

    await sql<any[]>`
      UPDATE "user" SET mail_id = ${profile.id}, session_token = ${sessionToken}
      WHERE id = ${linkRow.userId}
    `;

    await sql<any[]>`
      UPDATE link_token SET used = true WHERE token = ${linkToken}
    `;

    const response = NextResponse.redirect(
      new URL("/link-account/complete", baseUrl),
    );

    response.cookies.set("link-token", "", { path: "/", maxAge: -1 });
    // Примечание: в оригинале здесь было имя куки "session_token-token" (опечатка) —
    // сохраняю поведение как есть, не в рамках этой миграции.
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

  const [existingUser] = await sql<any[]>`
    SELECT * FROM "user" WHERE mail_id = ${profile.id}
  `;

  if (!existingUser) {
    return NextResponse.redirect(new URL("/login-error", baseUrl));
  }

  await sql<any[]>`
    UPDATE "user" SET session_token = ${sessionToken} WHERE id = ${existingUser.id}
  `;

  const response = NextResponse.redirect(new URL("/", baseUrl));

  response.cookies.set("session_token", sessionToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
