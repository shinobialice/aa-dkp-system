const MOSCOW = "Europe/Moscow";

function moscowDayKey(date: Date) {
  return date.toLocaleDateString("ru-RU", { timeZone: MOSCOW });
}

export function formatMoscowHM(date: Date) {
  return date.toLocaleTimeString("ru-RU", {
    timeZone: MOSCOW,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoscowShort(date: Date, now: Date = new Date()) {
  if (moscowDayKey(date) === moscowDayKey(now)) return formatMoscowHM(date);
  const day = date.toLocaleDateString("ru-RU", {
    timeZone: MOSCOW,
    day: "2-digit",
    month: "2-digit",
  });
  return `${day}, ${formatMoscowHM(date)}`;
}

export function formatDuration(totalMinutes: number) {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} мин`;
  if (rest === 0) return `${hours} ч`;
  return `${hours} ч ${rest} мин`;
}
