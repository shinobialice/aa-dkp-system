import { Flame } from "lucide-react";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import { cn } from "@/shared/lib/tw-merge";

function pluralizeDays(days: number) {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дня";
  return "дней";
}

function getStreakTierClass(streak: number) {
  if (streak >= 120) {
    return "bg-purple-500/15 text-purple-600 dark:text-purple-400";
  }
  if (streak >= 90) return "bg-pink-500/15 text-pink-600 dark:text-pink-400";
  if (streak >= 60) return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
  if (streak >= 30) return "bg-red-500/15 text-red-600 dark:text-red-400";
  return "bg-orange-500/15 text-orange-600 dark:text-orange-400";
}

export default function PrimeStreakBadge({
  streak,
  isOnSkip,
  skipsUsedThisMonth,
  skipAllowance,
}: PrimeStreak) {
  if (streak < 2) return null;

  const title = isOnSkip
    ? `${streak} ${pluralizeDays(streak)} подряд на Прайме — сегодня пропуск, серия сохранена. Пропущено ${skipsUsedThisMonth} из ${skipAllowance} в этом месяце`
    : `${streak} ${pluralizeDays(streak)} подряд на Прайме. Пропущено ${skipsUsedThisMonth} из ${skipAllowance} в этом месяце`;

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-semibold whitespace-nowrap",
        isOnSkip
          ? "bg-muted text-muted-foreground"
          : getStreakTierClass(streak),
      )}
      title={title}
    >
      <Flame className="size-3.5" />
      {streak} {pluralizeDays(streak)}
      <span className="hidden sm:inline">на праймах подряд</span>
    </span>
  );
}
