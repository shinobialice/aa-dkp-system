import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export async function POST(req: Request) {
  const { vk_id, linkToken } = await req.json();

  if (!vk_id) {
    return NextResponse.json({ success: false, error: "vk_id отсутствует" });
  }

  if (linkToken) {
    const { data: tokenRecord, error } = await supabase
      .from("link_token")
      .select("id, token, userId, user(*)")
      .eq("token", linkToken)
      .eq("used", false)
      .gt("expiresAt", new Date().toISOString())
      .maybeSingle();

    if (!tokenRecord || error) {
      return NextResponse.json({
        success: false,
        error: "Недействительный link-token",
      });
    }

    const { data: updated, error: updateError } = await supabase
      .from("user")
      .update({ vk_id: String(vk_id) })
      .eq("id", tokenRecord.userId)
      .select();

    if (updateError || !updated?.[0]) {
      return NextResponse.json({
        success: false,
        error: updateError?.message || "Ошибка при обновлении пользователя",
      });
    }

    await supabase
      .from("link_token")
      .update({ used: true })
      .eq("id", tokenRecord.id);

    const user = updated[0];

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        active: user.active,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      NEXTAUTH_SECRET
    );

    const cookie = serialize(COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    const res = NextResponse.json({
      success: true,
      redirect: "/link-account/complete",
    });
    res.headers.set("Set-Cookie", cookie);
    return res;
  }

  // 🔐 Обычный логин по vk_id
  const { data: user } = await supabase
    .from("user")
    .select("id, username, active")
    .eq("vk_id", vk_id)
    .eq("active", true)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({
      success: false,
      error: "Пользователь не найден",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      active: user.active,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    NEXTAUTH_SECRET
  );

  const cookie = serialize(COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
