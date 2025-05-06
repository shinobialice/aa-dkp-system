"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
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
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h1 className="text-2xl font-bold">Аккаунт привязан</h1>
      <p className="mt-2">Вы успешно вошли и ваш аккаунт привязан к Google.</p>
      <p className="text-sm text-muted-foreground mt-4">
        Перенаправление на главную через 3 секунды...
      </p>
    </div>
  );
}
