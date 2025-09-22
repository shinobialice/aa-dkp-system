"use client";

import Cookies from "js-cookie";
import { MailIcon } from "./authIcons"; // если есть
import { Button } from "@/shared/ui";

export default function MailLoginButton() {
  const handleLogin = () => {
    const state = crypto.randomUUID();

    // сохраняем state в куку
    Cookies.set("mailru_state", state, {
      path: "/",
      expires: 0.1,
    });

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_MAILRU_CLIENT_ID!,
      redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/mailru/callback",
      state,
      scope: "userinfo",
    });

    window.location.href = `https://oauth.mail.ru/login?${params}`;
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full gap-2 cursor-pointer"
      variant="outline"
    >
      <MailIcon />
      Войти через Mail.ru
    </Button>
  );
}
