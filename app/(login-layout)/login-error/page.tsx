"use client";

import { Suspense } from "react";
import Link from "next/link";

export default function LoginErrorPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 text-center">
      <Suspense fallback={<p>Загрузка...</p>}>
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Доступ запрещён
          </h1>
          <p className="text-muted-foreground mb-6">
            Этот аккаунт не связан с приглашённым пользователем.
          </p>
          <Link href="/login" className="text-primary underline">
            Вернуться к входу
          </Link>
        </>
      </Suspense>

      <div className="mb-6">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/48AieXPNnZc?autoplay=1&mute=1"
          title="Access Denied"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-lg mt-6"
        />
      </div>
    </div>
  );
}
