"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LinkAccountComplete() {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove("link-token");

    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 text-center">
      <div className="flex justify-center mb-6">
        <Loader className="animate-spin h-10 w-10 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Аккаунт привязан</h1>
      <p className="mt-2">
        Вы успешно вошли и ваш аккаунт был привязан к профилю.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Перенаправление на главную через 3 секунды...
      </p>
    </div>
  );
}
