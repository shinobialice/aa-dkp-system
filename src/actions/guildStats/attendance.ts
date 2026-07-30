"use server";

import supabase from "@/shared/lib/supabaseAdmin";

// raid.start_date хранится как naive-строка без таймзоны (мск. время без
// смещения, см. createRaidEvent.ts). Границы месяца/года строим той же
// naive-арифметикой по числам, без Date.UTC()/toISOString() — те применили
// бы к наивной строке смещение часового пояса и сдвинули бы границу.
function monthRangeBounds(year: number, month?: number) {
  const startMonthIndex = year * 12 + (month ?? 0);
  const endMonthIndex = month === undefined ? (year + 1) * 12 : startMonthIndex + 1;

  const toDateString = (monthIndex: number) => {
    const y = Math.floor(monthIndex / 12);
    const m = monthIndex % 12;
    return `${y}-${String(m + 1).padStart(2, "0")}-01T00:00:00`;
  };

  return { start: toDateString(startMonthIndex), end: toDateString(endMonthIndex) };
}

export async function getRaidData(year: number, month?: number) {
  const { start, end } = monthRangeBounds(year, month);

  const { data: raids, error } = await supabase
    .from("raid")
    .select("id, start_date, type, active_user_count")
    .gte("start_date", start)
    .lt("start_date", end);

  if (error || !raids) throw new Error("Ошибка при загрузке рейдов");

  return raids;
}

export async function getAttendances(raidIds?: number[]) {
  let query = supabase.from("raid_attendance").select("user_id, raid_id");
  if (raidIds) {
    if (raidIds.length === 0) return [];
    query = query.in("raid_id", raidIds);
  }

  const { data: attendances, error } = await query;

  if (error || !attendances)
    throw new Error("Ошибка при загрузке посещаемости");

  return attendances;
}

export async function calculateDailyAverage(
  raids: { id: number; start_date: string; active_user_count: number | null }[],
  attendances: { user_id: number; raid_id: number }[],
) {
  const raidDate = new Map<number, string>();
  const raidActive = new Map<number, number>();

  for (const raid of raids) {
    if (!raid.start_date) continue;
    raidDate.set(raid.id, raid.start_date.split("T")[0]);
    raidActive.set(raid.id, raid.active_user_count ?? 0);
  }

  const attendeesPerRaid = new Map<number, Set<number>>();
  for (const att of attendances) {
    if (!raidDate.has(att.raid_id)) continue;
    if (!attendeesPerRaid.has(att.raid_id)) {
      attendeesPerRaid.set(att.raid_id, new Set());
    }
    attendeesPerRaid.get(att.raid_id)!.add(att.user_id);
  }

  // Рейды одного типа в один день считаются отдельно (у каждого свой
  // active_user_count), а на графике день агрегирует средним по своим рейдам.
  const percentsPerDate = new Map<string, number[]>();
  for (const [raidId, date] of raidDate) {
    const active = raidActive.get(raidId) ?? 0;
    const attendeeCount = attendeesPerRaid.get(raidId)?.size ?? 0;
    const percent = active > 0 ? (attendeeCount / active) * 100 : 0;
    if (!percentsPerDate.has(date)) percentsPerDate.set(date, []);
    percentsPerDate.get(date)!.push(percent);
  }

  const daily = Array.from(percentsPerDate.entries()).map(
    ([date, percents]) => ({
      date,
      value: percents.reduce((acc, p) => acc + p, 0) / percents.length,
    }),
  );

  const avgPercent =
    daily.reduce((acc, d) => acc + d.value, 0) / (daily.length || 1);

  return { percent: avgPercent, daily };
}
