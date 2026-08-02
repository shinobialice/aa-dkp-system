"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";

function getAnniversaryYears(joinedAt: string | null): number | null {
  if (!joinedAt) return null;
  const joined = new Date(joinedAt);
  const today = new Date();

  if (
    joined.getDate() !== today.getDate() ||
    joined.getMonth() !== today.getMonth()
  ) {
    return null;
  }

  const years = today.getFullYear() - joined.getFullYear();
  return years > 0 ? years : null;
}

function pluralizeYears(years: number) {
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 === 1 && mod100 !== 11) return "год";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "года";
  return "лет";
}

export default function AnniversaryCelebration({
  joinedAt,
}: {
  joinedAt: string | null;
}) {
  const [years] = useState(() => getAnniversaryYears(joinedAt));

  useEffect(() => {
    if (!years) return;

    let cancelled = false;

    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;

      const colors = ["#2f9e62", "#e89d35", "#5a36a5", "#d764a8"];
      const end = Date.now() + 2500;

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end && !cancelled) {
          requestAnimationFrame(frame);
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [years]);

  if (!years) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center px-4">
      <div className="anniversary-banner pointer-events-auto flex max-w-[92%] flex-col items-center gap-0.5 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary via-chart-1 to-chart-5 px-6 py-3 text-center text-white shadow-lg backdrop-blur">
        <div className="flex items-center gap-2 text-base font-bold md:text-lg">
          <PartyPopper className="size-5 shrink-0 animate-bounce" />
          <span>
            {years} {pluralizeYears(years)} в гильдии!
          </span>
          <PartyPopper className="size-5 -scale-x-100 shrink-0 animate-bounce" />
        </div>
        <div className="text-xs font-medium opacity-90 md:text-sm">
          Спасибо, что ты с нами!
        </div>
      </div>
    </div>
  );
}
