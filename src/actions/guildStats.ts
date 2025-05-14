// src/actions/guildStats.ts
"use server";

import supabase from "@/lib/supabase";

async function getRaidData(year: number, month?: number) {
  const { data: raids, error } = await supabase
    .from("raid")
    .select("id, start_date, type, dkp_summary");

  if (error || !raids) throw new Error("Ошибка при загрузке рейдов");

  return raids.filter((r) => {
    if (!r.start_date) return false;
    const d = new Date(r.start_date);
    return (
      d.getFullYear() === year &&
      (month === undefined || d.getMonth() === month)
    );
  });
}

async function getAttendances() {
  const { data: attendances, error } = await supabase
    .from("raid_attendance")
    .select("user_id, raid_id");

  if (error || !attendances)
    throw new Error("Ошибка при загрузке посещаемости");

  return attendances;
}

function calculateDailyAverage(
  raids: { id: number; start_date: string; dkp_summary: number | null }[],
  attendances: { user_id: number; raid_id: number }[]
) {
  const raidMap = new Map<number, { dkp: number; date: string }>();
  const dailyMap = new Map<
    string,
    { dkpTotal: number; userDkp: Map<number, number> }
  >();
  let totalDkp = 0;
  const userMap = new Map<number, number>();

  for (const raid of raids) {
    if (!raid.start_date) continue;
    const dkp = raid.dkp_summary ?? 0;
    totalDkp += dkp;
    raidMap.set(raid.id, { dkp, date: raid.start_date });

    const date = raid.start_date.split("T")[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { dkpTotal: 0, userDkp: new Map() });
    }
    dailyMap.get(date)!.dkpTotal += dkp;
  }

  for (const att of attendances) {
    const raid = raidMap.get(att.raid_id);
    if (!raid) continue;
    const date = raid.date.split("T")[0];
    const day = dailyMap.get(date);
    if (!day) continue;
    day.userDkp.set(
      att.user_id,
      (day.userDkp.get(att.user_id) ?? 0) + raid.dkp
    );
    userMap.set(att.user_id, (userMap.get(att.user_id) ?? 0) + raid.dkp);
  }

  const daily = Array.from(dailyMap.entries()).map(
    ([date, { dkpTotal, userDkp }]) => {
      const total = Array.from(userDkp.values()).reduce(
        (acc, val) => acc + (dkpTotal > 0 ? (val / dkpTotal) * 100 : 0),
        0
      );
      const avg = userDkp.size ? total / userDkp.size : 0;
      return { date, value: avg };
    }
  );

  const totalPercent = Array.from(userMap.values()).reduce(
    (acc, val) => acc + (totalDkp > 0 ? (val / totalDkp) * 100 : 0),
    0
  );
  const avgPercent = userMap.size ? totalPercent / userMap.size : 0;

  return { percent: avgPercent, daily };
}

export async function getGuildAttendancePrime({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const raids = (await getRaidData(year, month)).filter(
    (r) => r.type === "Прайм"
  );
  const attendances = await getAttendances();
  return calculateDailyAverage(raids, attendances);
}

export async function getGuildAttendanceAgl({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const raids = (await getRaidData(year, month)).filter(
    (r) => r.type === "АГЛ"
  );
  const attendances = await getAttendances();
  return calculateDailyAverage(raids, attendances);
}

export async function getGuildAttendanceTotal({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const raids = await getRaidData(year, month);
  const attendances = await getAttendances();

  const raidMap = new Map<number, number>();
  let totalDkp = 0;

  for (const raid of raids) {
    const dkp = raid.dkp_summary ?? 0;
    totalDkp += dkp;
    raidMap.set(raid.id, dkp);
  }

  const userMap = new Map<number, number>();

  for (const att of attendances) {
    const dkp = raidMap.get(att.raid_id);
    if (!dkp) continue;
    userMap.set(att.user_id, (userMap.get(att.user_id) ?? 0) + dkp);
  }

  const total = Array.from(userMap.values()).reduce(
    (acc, val) => acc + (totalDkp > 0 ? (val / totalDkp) * 100 : 0),
    0
  );
  const avg = userMap.size ? total / userMap.size : 0;

  return { percent: avg };
}

export async function getGuildPrimeStatsByYear(year: number) {
  const raids = (await getRaidData(year)).filter((r) => r.type === "Прайм");
  const attendances = await getAttendances();

  const primeByMonth = new Array(12)
    .fill(0)
    .map((_, i) => ({ month: i, dkpMax: 0, users: new Map<number, number>() }));
  const raidMap = new Map<number, { month: number; dkp: number }>();

  for (const raid of raids) {
    const d = new Date(raid.start_date!);
    const m = d.getMonth();
    const dkp = raid.dkp_summary ?? 0;
    raidMap.set(raid.id, { month: m, dkp });
    primeByMonth[m].dkpMax += dkp;
  }

  for (const att of attendances) {
    const raid = raidMap.get(att.raid_id);
    if (!raid) continue;
    const month = raid.month;
    const userMap = primeByMonth[month].users;
    userMap.set(att.user_id, (userMap.get(att.user_id) ?? 0) + raid.dkp);
  }

  return primeByMonth.map((entry, i) => {
    const totalPercent = Array.from(entry.users.values()).reduce(
      (acc, dkp) => acc + (entry.dkpMax > 0 ? (dkp / entry.dkpMax) * 100 : 0),
      0
    );
    const avg = entry.users.size ? totalPercent / entry.users.size : 0;
    return {
      month: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ][i],
      percent: avg,
    };
  });
}

export async function getGuildAglStatsByYear(year: number) {
  const { data: raids, error } = await supabase
    .from("raid")
    .select("id, start_date, type, dkp_summary");

  if (error || !raids) throw new Error("Ошибка при загрузке рейдов");

  const aglByMonth = new Array(12)
    .fill(0)
    .map((_, i) => ({ month: i, dkpMax: 0, users: new Map<number, number>() }));
  const raidMap = new Map<number, { month: number; dkp: number }>();

  for (const raid of raids) {
    if (!raid.start_date || raid.type !== "АГЛ") continue;
    const d = new Date(raid.start_date);
    if (d.getFullYear() !== year) continue;
    const m = d.getMonth();
    const dkp = raid.dkp_summary ?? 0;
    raidMap.set(raid.id, { month: m, dkp });
    aglByMonth[m].dkpMax += dkp;
  }

  const { data: attendances, error: attError } = await supabase
    .from("raid_attendance")
    .select("user_id, raid_id");

  if (attError || !attendances)
    throw new Error("Ошибка при загрузке посещаемости");

  for (const att of attendances) {
    const raid = raidMap.get(att.raid_id);
    if (!raid) continue;
    const month = raid.month;
    const userMap = aglByMonth[month].users;
    userMap.set(att.user_id, (userMap.get(att.user_id) ?? 0) + raid.dkp);
  }

  return aglByMonth.map((entry, i) => {
    const totalPercent = Array.from(entry.users.values()).reduce(
      (acc, dkp) => acc + (entry.dkpMax > 0 ? (dkp / entry.dkpMax) * 100 : 0),
      0
    );
    const avg = entry.users.size ? totalPercent / entry.users.size : 0;
    return {
      month: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ][i],
      праймы: 0, // заполним позже
      агл: avg,
    };
  });
}
