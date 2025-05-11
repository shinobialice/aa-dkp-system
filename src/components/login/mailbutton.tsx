import { MailIcon } from "./authIcons";
import { Button } from "@/components/ui/button";

export default function MailLoginButton() {
  const handleLogin = () => {
    const state = crypto.randomUUID();
    localStorage.setItem("mailru_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_MAILRU_CLIENT_ID!,
      redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/mailru/callback",
      state,
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
      Войти через Mail
    </Button>
  );
}
