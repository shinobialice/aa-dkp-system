import supabase from "@/shared/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: user } = await supabase
    .from("user")
    .select("id, username")
    .eq("session_token", token)
    .single();

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json(
    {
      id: user.id,
      name: user.username,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`,
    },
    { status: 200 },
  );
}
