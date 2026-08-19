// Те же русские названия дней и тот же порядок (индекс = Date.getDay(),
// 0 = воскресенье), что уже использует /schedule (см.
// src/app/(default-layout)/schedule/page.tsx) и таблица week_schedule_event.
export const WEEKDAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;

// День недели по МСК для абсолютного момента времени — как и в
// getMoscowISOString, нельзя использовать date.getDay() напрямую (это
// локальная таймзона браузера/сервера, не МСК).
export function getMoscowWeekday(date: Date): string {
  const msk = new Date(date.getTime() + MSK_OFFSET_MS);
  return WEEKDAY_NAMES[msk.getUTCDay()];
}
