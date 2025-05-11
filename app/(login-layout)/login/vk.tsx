// login/vk.tsx (или внутренняя логика в login.tsx)
import { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function VkRedirectPage() {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (code && typeof code === "string") {
      signIn("vk", {
        code,
        callbackUrl: "/", // или куда нужно
      });
    }
  }, [code]);

  return <p>Загрузка...</p>;
}
