const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;

// raid.start_date и похожие поля хранятся как naive-строки в МСК. Локальные
// геттеры Date зависят от таймзоны браузера/сервера, поэтому момент времени
// сдвигается на фиксированные +3 часа и читается UTC-геттерами.
export function getMoscowISOString(date: Date): string {
  const msk = new Date(date.getTime() + MSK_OFFSET_MS);
  const year = msk.getUTCFullYear();
  const month = (msk.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = msk.getUTCDate().toString().padStart(2, "0");
  const hour = msk.getUTCHours().toString().padStart(2, "0");
  const minute = msk.getUTCMinutes().toString().padStart(2, "0");
  const second = msk.getUTCSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

export function getMoscowYearMonth(date: Date): {
  year: number;
  month: number;
} {
  const msk = new Date(date.getTime() + MSK_OFFSET_MS);
  return { year: msk.getUTCFullYear(), month: msk.getUTCMonth() + 1 };
}

export function parseMoscowISOString(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hh, mm, ss] = (timePart ?? "00:00:00").split(":").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day, hh, mm, ss || 0) - MSK_OFFSET_MS,
  );
}

// Без явного смещения new Date(naive) на клиенте разберёт строку в таймзоне
// браузера. У Москвы нет перехода на летнее время с 2014, так что +03:00 точен.
export function toMoscowIso(naive: string): string;
export function toMoscowIso(naive: string | null): string | null;
export function toMoscowIso(naive: string | null): string | null {
  if (!naive) return null;
  return /[+-]\d{2}:?\d{2}$|Z$/.test(naive) ? naive : `${naive}+03:00`;
}
