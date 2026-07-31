// raid.start_date хранится как naive-строка без таймзоны (см. getEvents.ts).
// Нельзя использовать date.toISOString() — он конвертирует в UTC и сдвигает
// время на разницу с МСК в зависимости от таймзоны сервера/браузера.
export function getMoscowISOString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}
