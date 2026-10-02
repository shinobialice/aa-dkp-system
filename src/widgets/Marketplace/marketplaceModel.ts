const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function moscowDayNumber(time: number) {
  return Math.floor((time + MSK_OFFSET_MS) / DAY_MS);
}

export function formatListingDate(iso: string) {
  const created = new Date(iso).getTime();
  const diff = moscowDayNumber(Date.now()) - moscowDayNumber(created);
  if (diff === 0) return "сегодня";
  if (diff === 1) return "вчера";
  return new Date(created + MSK_OFFSET_MS)
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
    .replace(".", "");
}
