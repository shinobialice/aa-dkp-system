"use client";

import { useEffect, useMemo, useState } from "react";

function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

// Календарная разница в месяцах и днях (а не "мс / 30 дней") — учитывает
// разную длину месяцев, как в обычном "исполнилось X месяцев Y дней".
function diffMonthsDays(
  fromMs: number,
  toMs: number,
): { months: number; days: number } {
  const from = new Date(fromMs);
  const to = new Date(toMs);
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  months = Math.max(0, months);

  const monthsLater = new Date(from);
  monthsLater.setMonth(monthsLater.getMonth() + months);
  const days = Math.max(
    0,
    Math.floor((to.getTime() - monthsLater.getTime()) / 86_400_000),
  );
  return { months, days };
}

// Первые сутки — тикающий таймер "ЧЧ:ММ:СС". Дальше — "N дней", а после
// первого полного месяца — "N месяцев M дней" (без месяца, если его ещё не
// прошло). Экспортируется отдельно, чтобы WarHistoryDetail мог посчитать
// статичную длительность уже закрытого периода тем же способом.
export function formatDuration(fromMs: number, toMs: number): string {
  const ms = Math.max(0, toMs - fromMs);
  const totalSeconds = Math.floor(ms / 1000);

  if (totalSeconds < 86_400) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  const { months, days } = diffMonthsDays(fromMs, toMs);
  if (months === 0) {
    return `${days} ${pluralRu(days, "день", "дня", "дней")}`;
  }
  const monthsPart = `${months} ${pluralRu(months, "месяц", "месяца", "месяцев")}`;
  return days === 0
    ? monthsPart
    : `${monthsPart} ${days} ${pluralRu(days, "день", "дня", "дней")}`;
}

export default function WarLiveDuration({ startedAt }: { startedAt: string }) {
  const startMs = useMemo(() => new Date(startedAt).getTime(), [startedAt]);

  // `now` стартует как null и выставляется только внутри useEffect (уже
  // после монтирования) — серверный рендер и самый первый клиентский рендер
  // (до гидратации) из-за этого рисуют одну и ту же заглушку, без расхождения
  // между ними (иначе React ругнётся на hydration mismatch, т.к. "сейчас" на
  // сервере и на клиенте — два разных момента времени).
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return <span className="tabular-nums text-muted-foreground">—:—:—</span>;
  }

  return (
    <span className="text-lg font-semibold tabular-nums">
      {formatDuration(startMs, now)}
    </span>
  );
}
