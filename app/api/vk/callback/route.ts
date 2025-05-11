import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/");
  }

  const params = new URLSearchParams({
    client_id: process.env.VK_CLIENT_ID!,
    client_secret: process.env.VK_CLIENT_SECRET!,
    redirect_uri: process.env.VK_REDIRECT_URI!,
    code,
  });

  const tokenRes = await fetch(
    `https://oauth.vk.com/access_token?${params.toString()}`
  );
  const tokenData = await tokenRes.json();

  // Проверка на ошибку
  if (tokenData.error) {
    console.error("VK Error:", tokenData);
    return NextResponse.redirect("/?error=vk");
  }

  // Здесь ты получаешь токен и данные:
  // tokenData = { access_token, expires_in, user_id, email }

  // Теперь можешь получить полную информацию о пользователе
  const userInfoRes = await fetch(
    `https://api.vk.com/method/users.get?user_ids=${tokenData.user_id}&fields=photo_200&access_token=${tokenData.access_token}&v=5.131`
  );
  const userInfoData = await userInfoRes.json();

  const user = {
    id: tokenData.user_id,
    email: tokenData.email,
    name: `${userInfoData.response[0].first_name} ${userInfoData.response[0].last_name}`,
    photo: userInfoData.response[0].photo_200,
  };

  console.log("VK USER:", user);

  // Тут ты можешь авторизовать или зарегистрировать пользователя
  // Например, создать куку, JWT, записать в Supabase и т.д.

  return NextResponse.redirect("/");
}
