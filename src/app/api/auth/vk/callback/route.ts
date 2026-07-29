import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import supabase from "@/shared/lib/supabaseAdmin";

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
      redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/vk/callback",
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

    // 🔗 Привязываем VK к существующему пользователю и сохраняем session_token
    const { error: userUpdateError } = await supabase
      .from("user")
      .update({
        vk_id: user.user_id,
        session_token: sessionToken,
      })
      .eq("id", linkRow.userId);

    if (userUpdateError) {
      console.error("Ошибка при обновлении пользователя:", userUpdateError);
      return NextResponse.json("Failed to link VK account", { status: 500 });
    }

    await supabase
      .from("link_token")
      .update({ used: true })
      .eq("token", linkToken);

    const response = NextResponse.redirect(
      new URL("/link-account/complete", req.url),
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

  const { data: existingUser } = await supabase
    .from("user")
    .select("*")
    .eq("vk_id", user.user_id)
    .single();

  let userId: number;

  if (!existingUser) {
    return NextResponse.redirect(new URL("/login-error", req.url));
  } else {
    await supabase
      .from("user")
      .update({ session_token: sessionToken })
      .eq("id", existingUser.id);

    userId = existingUser.id;
  }

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
