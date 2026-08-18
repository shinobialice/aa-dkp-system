import crypto from "crypto";
import sql from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
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
  const savedState = cookieStore.get("google_state")?.value;

  if (state !== savedState) {
    return NextResponse.json("Invalid state", { status: 400 });
  }

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
    return NextResponse.json(
      { error: "Token exchange failed", data: tokenData },
      { status: 400 },
    );
  }

  const userInfoRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    },
  );

  const profile = await userInfoRes.json();

  if (!profile.id) {
    return NextResponse.json("Failed to fetch user profile", { status: 400 });
  }

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

    await sql<any[]>`
      UPDATE "user" SET google_id = ${profile.id}, session_token = ${sessionToken}
      WHERE id = ${linkRow.userId}
    `;

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
    SELECT * FROM "user" WHERE google_id = ${profile.id}
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
