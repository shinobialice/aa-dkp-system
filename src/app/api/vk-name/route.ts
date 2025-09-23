import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vkName = searchParams.get("username");

  if (!vkName) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const accessToken = process.env.VK_ACCESS_TOKEN;
  const apiVersion = "5.131";

  const url = `https://api.vk.ru/method/users.get?user_ids=${vkName}&access_token=${accessToken}&v=${apiVersion}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.response && data.response.length > 0) {
      const user = data.response[0];
      return NextResponse.json({
        name: `${user.first_name} ${user.last_name}`,
      });
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch VK data" },
      { status: 500 },
    );
  }
}
