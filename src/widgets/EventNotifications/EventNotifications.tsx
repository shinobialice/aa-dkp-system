"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Card } from "@/shared/ui";
import { useUpcomingEvents, bossImages } from "@/hooks/useUpcomingEvents";

const notifyBeforeMin = 10;

function playAlertSound() {
  const audio = new Audio("/images/notification/notification.wav");
  audio.play().catch(() => {});
}

type ToastItem = { id: string; boss: string };

export function EventNotifications() {
  const events = useUpcomingEvents();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const notifiedKeysRef = useRef<Set<string>>(new Set());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    for (const e of events) {
      if (e.startsInMin === undefined) continue;
      if (e.startsInMin <= 0 || e.startsInMin > notifyBeforeMin) continue;

      if (notifiedKeysRef.current.has(e.key)) continue;
      notifiedKeysRef.current.add(e.key);

      setToasts((prev) => [...prev, { id: e.key, boss: e.boss }]);
      playAlertSound();
      setTimeout(() => dismissToast(e.key), 15_000);
    }
  }, [events, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Card
          key={t.id}
          className="flex-row items-center gap-3 border-primary bg-muted shadow-lg py-3 px-4 animate-in slide-in-from-bottom-2"
        >
          {bossImages[t.boss] && (
            <Image
              src={bossImages[t.boss]}
              alt={t.boss}
              width={40}
              height={40}
              className="shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="text-sm">
            <span className="font-semibold">{t.boss}</span> через{" "}
            {notifyBeforeMin} мин!
          </div>
          <button
            onClick={() => dismissToast(t.id)}
            className="ml-2 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Закрыть"
          >
            <X className="size-4" />
          </button>
        </Card>
      ))}
    </div>
  );
}
