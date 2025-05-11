// pages/api/vk/callback.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next"; // или можно использовать own logic

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;

  if (!code) return res.status(400).send("Missing code");

  try {
    const tokenRes = await axios.get("https://oauth.vk.com/access_token", {
      params: {
        client_id: process.env.VK_CLIENT_ID,
        client_secret: process.env.VK_CLIENT_SECRET,
        redirect_uri: "https://yourdomain.com/api/vk/callback",
        code,
      },
    });

    const { access_token, user_id } = tokenRes.data;

    const profileRes = await axios.get("https://api.vk.com/method/users.get", {
      params: {
        user_ids: user_id,
        access_token,
        v: "5.199",
        fields: "photo_200,screen_name",
      },
    });

    const user = profileRes.data.response?.[0];

    // Создай JWT
    const jwtToken = jwt.sign(
      {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        username: user.screen_name,
        image: user.photo_200,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Сохраняем в cookie
    setCookie("token", jwtToken, {
      req,
      res,
      httpOnly: true,
      maxAge: 7 * 86400,
    });

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Ошибка авторизации");
  }
}
