// Разбираем "HH:MM" на часы/минуты для двух отдельных числовых полей —
// это (в отличие от <input type="time">) даёт гарантированно 24-часовой
// формат независимо от локали браузера/ОС пользователя.
export function splitPrimeTime(value: string | null): [string, string] {
  if (!value) return ["", ""];
  const [h, m] = value.split(":");
  return [h ?? "", m ?? ""];
}

export function joinPrimeTime(hour: string, minute: string): string | null {
  if (hour === "" && minute === "") return null;
  const h = String(Math.min(23, Math.max(0, Number(hour) || 0))).padStart(
    2,
    "0",
  );
  const m = String(Math.min(59, Math.max(0, Number(minute) || 0))).padStart(
    2,
    "0",
  );
  return `${h}:${m}`;
}

export const weekDays: { label: string; value: number }[] = [
  { label: "Пн", value: 1 },
  { label: "Вт", value: 2 },
  { label: "Ср", value: 3 },
  { label: "Чт", value: 4 },
  { label: "Пт", value: 5 },
  { label: "Сб", value: 6 },
  { label: "Вс", value: 0 },
];
