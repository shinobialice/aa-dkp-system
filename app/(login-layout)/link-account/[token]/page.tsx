"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";

export default function LinkAccountPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { token } = params;

  useEffect(() => {
    if (!token) return;

    Cookies.set("link-token", token, { expires: 0.1 }); // 6 minutes
    signIn("google", { callbackUrl: "/link-account/complete" });
  }, [token]);

  return (
    <p className="p-4 text-center">Перенаправление на вход через Google...</p>
  );
}
