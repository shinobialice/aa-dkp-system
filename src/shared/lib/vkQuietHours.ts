import "server-only";

export function isQuietHours(
  start: number,
  end: number,
  now: Date = new Date(),
): boolean {
  if (start === end) return false;

  const moscowHour = Number(
    now.toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      hour12: false,
    }),
  );

  return start < end
    ? moscowHour >= start && moscowHour < end
    : moscowHour >= start || moscowHour < end;
}

export function getVkMentionTag(
  quietHoursEnabled: boolean,
  quietHoursStart: number,
  quietHoursEnd: number,
  now: Date = new Date(),
): "@all" | "@online" {
  return quietHoursEnabled && isQuietHours(quietHoursStart, quietHoursEnd, now)
    ? "@online"
    : "@all";
}
