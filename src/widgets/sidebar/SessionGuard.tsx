"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Проверяет валидность сессии при каждом переходе по меню. proxy.ts кэширует
// результат проверки на 20 секунд и вдобавок не всегда доходит до сервера
// при клиентской навигации Next.js (роутер может отдать закэшированный
// переход без нового запроса) — из-за этого деактивированного пользователя
// раньше выкидывало только после жёсткого рефреша. Здесь проверка идёт
// с client-side при каждой смене страницы, напрямую и без кэша.
export function SessionGuard() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Первый рендер уже прошёл проверку в proxy.ts на этом же запросе —
    // не дублируем её лишним обращением сразу при заходе на страницу.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    fetch("/api/me", { cache: "no-store" }).then((res) => {
      if (!res.ok) {
        window.location.href = "/login";
      }
    });
  }, [pathname]);

  return null;
}
