"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import AuthShell from "@/widgets/login/AuthShell";

export default function LoginPage() {
  useEffect(() => {
    Cookies.remove("link-token", { path: "/" });
  }, []);

  return (
    <AuthShell
      title="Вход в систему"
      subtitle="Войдите через аккаунт, привязанный к вашему профилю"
      footer={
        <>
          Впервые здесь или сменили аккаунт?
          <br />
          Попросите у администратора ссылку для привязки.
        </>
      }
    />
  );
}
