// pages/login-vk.tsx
import { generateCodeChallenge, generateCodeVerifier } from "@/src/utils/pkce";
import Cookies from "js-cookie";

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

    window.location.href = `https://id.vk.com/authorize?${params}`;
    Cookies.set("vk_code_verifier", codeVerifier);
    Cookies.set("vk_state", state);
  };

  return <button onClick={handleLogin}>Войти через VK</button>;
}
