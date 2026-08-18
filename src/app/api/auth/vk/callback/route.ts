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
  const device_id = searchParams.get("device_id");

  if (
    typeof code !== "string" ||
    typeof state !== "string" ||
    typeof device_id !== "string"
  ) {
    return NextResponse.json("Missing query params", { status: 400 });
  }

  const cookieStore = await cookies();

  const savedState = cookieStore.get("vk_state")?.value;
  const codeVerifier = cookieStore.get("vk_code_verifier")?.value;
  const linkToken = cookieStore.get("link-token")?.value;

  if (!savedState || !codeVerifier || state !== savedState) {
    return NextResponse.json("Invalid state or verifier", { status: 400 });
  }

  const tokenRes = await fetch("https://id.vk.ru/oauth2/auth", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.VK_CLIENT_ID!,
      redirect_uri: `${baseUrl}/api/auth/vk/callback`,
      code,
      code_verifier: codeVerifier,
      device_id,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: "Token exchange failed", data: tokenData },
      { status: 400 },
    );
  }

  const userInfoRes = await fetch("https://id.vk.ru/oauth2/user_info", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: tokenData.access_token,
      client_id: process.env.VK_CLIENT_ID!,
    }),
  });

  const { user } = await userInfoRes.json();

  if (linkToken) {
    const [linkRow] = await sql<any[]>`
      SELECT "userId" FROM link_token
      WHERE token = ${linkToken} AND used = false AND "expiresAt" > now()
    `;

    if (!linkRow) {
      return NextResponse.json("Link token expired or invalid", {
        status: 400,
      });
    }

    const sessionToken = generateSessionToken();

    // 🔗 Привязываем VK к существующему пользователю и сохраняем session_token
    try {
      await sql<any[]>`
        UPDATE "user" SET vk_id = ${user.user_id}, session_token = ${sessionToken}
        WHERE id = ${linkRow.userId}
      `;
    } catch (userUpdateError) {
      console.error("Ошибка при обновлении пользователя:", userUpdateError);
      return NextResponse.json("Failed to link VK account", { status: 500 });
    }

    await sql<any[]>`
      UPDATE link_token SET used = true WHERE token = ${linkToken}
    `;

    const response = NextResponse.redirect(
      new URL("/link-account/complete", baseUrl),
    );

    response.cookies.set("link-token", "", { path: "/", maxAge: -1 });
    response.cookies.set("session_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  }

  const sessionToken = generateSessionToken();

  const [existingUser] = await sql<any[]>`
    SELECT * FROM "user" WHERE vk_id = ${user.user_id}
  `;

  let userId: number;

  if (!existingUser) {
    return NextResponse.redirect(new URL("/login-error", baseUrl));
  } else {
    await sql<any[]>`
      UPDATE "user" SET session_token = ${sessionToken} WHERE id = ${existingUser.id}
    `;

    userId = existingUser.id;
  }

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
