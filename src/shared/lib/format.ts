export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function formatNumber(value: number, fractionDigits = 3) {
  return value.toLocaleString("ru-RU", {
    maximumFractionDigits: fractionDigits,
  });
}

export function formatPercent(value: number, fractionDigits = 0) {
  return `${formatNumber(value, fractionDigits)}%`;
}

export function formatMoscowDateTime(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function avatarSrc(username: string, avatarUrl?: string | null) {
  return (
    avatarUrl ?? `https://api.dicebear.com/6.x/initials/svg?seed=${username}`
  );
}

export function attendanceTone(percent: number) {
  if (percent >= 80) {
    return { text: "text-green-700 dark:text-green-400", bar: "bg-green-600" };
  }
  if (percent >= 50) {
    return { text: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500" };
  }
  return { text: "text-red-700 dark:text-red-400", bar: "bg-red-500" };
}

export function formatMoscowHM(date: Date) {
  return date.toLocaleTimeString("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function vkProfileUrl(vkName: string | null, vkId: string | null) {
  if (vkName) return `https://vk.ru/${vkName}`;
  if (vkId) return `https://vk.com/id${vkId}`;
  return null;
}
