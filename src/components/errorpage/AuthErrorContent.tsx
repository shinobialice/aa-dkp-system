"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещён</h1>
      <p className="text-muted-foreground mb-6">
        {error === "AccessDenied"
          ? "Этот аккаунт не связан с приглашённым пользователем."
          : "Произошла ошибка при входе."}
      </p>
      <Link href="/login" className="text-primary underline">
        Вернуться к входу
      </Link>
    </>
  );
}
