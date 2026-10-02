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
    console.error("Token exchange failed:", tokenData);
    return loginErrorRedirect("provider");
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

  if (!user?.user_id) {
    return loginErrorRedirect("provider");
  }

  return completeSocialAuth("vk_id", String(user.user_id), linkToken);
}
