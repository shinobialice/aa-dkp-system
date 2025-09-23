import crypto from "crypto";
import supabase from "@/shared/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
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

  const linkTokenCookie = cookieStore.get("link-token");
  const linkToken = linkTokenCookie ? linkTokenCookie.value : undefined;

  const savedStateCookie = cookieStore.get("google_state");
  const savedState = savedStateCookie ? savedStateCookie.value : undefined;

  console.log("state, savedState", state, savedState);

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
    const { data: linkRow } = await supabase
      .from("link_token")
      .select("userId")
      .eq("token", linkToken)
      .eq("used", false)
      .gt("expiresAt", new Date().toISOString())
      .single();

    if (!linkRow) {
      return NextResponse.json("Link token expired or invalid", {
        status: 400,
      });
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

    const response = NextResponse.redirect("/link-account/complete");

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

  const sessionToken = generateSessionToken();

  const { data: existingUser } = await supabase
    .from("user")
    .select("*")
    .eq("google_id", profile.id)
    .single();

  if (!existingUser) {
    return NextResponse.redirect("/login-error");
  }

  await supabase
    .from("user")
    .update({ session_token: sessionToken })
    .eq("id", existingUser.id);

  const response = NextResponse.redirect(`${baseUrl}/`);

  response.cookies.set("session_token", sessionToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
