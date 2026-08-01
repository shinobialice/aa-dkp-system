const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;

// raid.start_date хранится как naive-строка без таймзоны (см. getEvents.ts).
// Нельзя читать date.getHours()/getMonth() и т.п. — они отражают локальную
// таймзону браузера/сервера, а не МСК, из-за чего сохранённое время
// "плывёт" в зависимости от того, где открыт сайт. date.getTime() — это
// абсолютный момент времени (не зависит от таймзоны), поэтому переводим его
// в МСК вручную через фиксированный сдвиг +3 часа и читаем UTC-геттеры.
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

// Обратная операция: превращает naive МСК-строку ("2026-08-01T16:00:00")
// в Date с корректным абсолютным моментом времени, не полагаясь на
// имплицитный локальный парсинг new Date(string) (который тоже зависит от
// таймзоны браузера/сервера).
export function parseMoscowISOString(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hh, mm, ss] = (timePart ?? "00:00:00").split(":").map(Number);

  return new Date(Date.UTC(year, month - 1, day, hh, mm, ss || 0) - MSK_OFFSET_MS);
}
