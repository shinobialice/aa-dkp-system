"use client";

import Cookies from "js-cookie";
import { GoogleIcon } from "./authIcons";
import { Button } from "@/components/ui/button";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    const state = crypto.randomUUID();

    Cookies.set("google_state", state, {
      path: "/",
      expires: 0.1,
    });
    const origin = process.env.NEXT_PUBLIC_BASE_URL!;
    
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: `${origin}/api/auth/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline", // чтобы получить refresh_token
      include_granted_scopes: "true",
      state,
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full gap-2 cursor-pointer"
      variant="outline"
    >
      <GoogleIcon />
      Войти через Google
    </Button>
  );
}
