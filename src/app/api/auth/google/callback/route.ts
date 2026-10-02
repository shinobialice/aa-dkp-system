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
    console.error("Token exchange failed:", tokenData);
    return loginErrorRedirect("provider");
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
    return loginErrorRedirect("provider");
  }

  return completeSocialAuth("google_id", String(profile.id), linkToken);
}
