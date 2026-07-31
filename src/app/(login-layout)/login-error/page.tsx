"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function LoginErrorMessage() {
  const reason = useSearchParams().get("reason");
  const message =
    reason === "inactive"
      ? "Этот аккаунт помечен как неактивный. Обратитесь к главе гильдии."
      : "Этот аккаунт не связан с приглашённым пользователем.";

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Доступ запрещён
      </h1>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Link href="/login" className="text-primary underline">
        Вернуться к входу
      </Link>
    </>
  );
}

export default function LoginErrorPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 text-center">
      <Suspense fallback={<p>Загрузка...</p>}>
        <LoginErrorMessage />
      </Suspense>

      <div className="mb-6 mt-6">
        <Image
          src="/images/EYOapvrWoAAC2a0.jpg"
          alt="Access Denied"
          width={863}
          height={391}
          className="rounded-lg w-full h-auto"
        />
      </div>
    </div>
  );
}
