// pages/login-vk.tsx
import { generateCodeChallenge, generateCodeVerifier } from "@/utils/pkce";
import Cookies from "js-cookie";
import { VkIcon } from "./authIcons";
import { Button } from "@/shared/ui";

export default function VkLoginButton() {
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = crypto.randomUUID();

    localStorage.setItem("vk_code_verifier", codeVerifier);
    localStorage.setItem("vk_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_VK_CLIENT_ID!,
      redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/vk/callback",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
    });

    window.location.href = `https://id.vk.ru/authorize?${params}`;
    Cookies.set("vk_code_verifier", codeVerifier);
    Cookies.set("vk_state", state);
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full gap-2 cursor-pointer"
      variant="outline"
    >
      <VkIcon />
      Войти через VK
    </Button>
  );
}
