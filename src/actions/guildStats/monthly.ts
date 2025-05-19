import { getRaidData, getAttendances } from "./attendance";

const MONTHS = [
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
];

export async function getGuildPrimeStatsByYear(year: number) {
  const raids = (await getRaidData(year)).filter((r) => r.type === "Прайм");
  const attendances = await getAttendances();

  const primeByMonth = new Array(12)
    .fill(0)
    .map(() => ({ totalPercent: 0, count: 0 }));
  const raidMap = new Map<number, { month: number; active: number }>();

  for (const raid of raids) {
    const d = new Date(raid.start_date!);
    const m = d.getMonth();
    const active = raid.active_user_count ?? 0;
    raidMap.set(raid.id, { month: m, active });
  }

  const attendancePerRaid = new Map<number, Set<number>>();
  for (const att of attendances) {
    if (!attendancePerRaid.has(att.raid_id)) {
      attendancePerRaid.set(att.raid_id, new Set());
    }
    attendancePerRaid.get(att.raid_id)!.add(att.user_id);
  }

  for (const [raidId, users] of attendancePerRaid) {
    const raid = raidMap.get(raidId);
    if (!raid) continue;
    const { month, active } = raid;
    if (active === 0) continue;
    const percent = (users.size / active) * 100;
    primeByMonth[month].totalPercent += percent;
    primeByMonth[month].count += 1;
  }

  return primeByMonth.map((entry, i) => ({
    month: MONTHS[i],
    percent: entry.count ? entry.totalPercent / entry.count : 0,
  }));
}

export async function getGuildAglStatsByYear(year: number) {
  const raids = (await getRaidData(year)).filter((r) => r.type === "АГЛ");
  const attendances = await getAttendances();

  const aglByMonth = new Array(12)
    .fill(0)
    .map(() => ({ totalPercent: 0, count: 0 }));
  const raidMap = new Map<number, { month: number; active: number }>();

  for (const raid of raids) {
    const d = new Date(raid.start_date!);
    const m = d.getMonth();
    const active = raid.active_user_count ?? 0;
    raidMap.set(raid.id, { month: m, active });
  }

  const attendancePerRaid = new Map<number, Set<number>>();
  for (const att of attendances) {
    if (!attendancePerRaid.has(att.raid_id)) {
      attendancePerRaid.set(att.raid_id, new Set());
    }
    attendancePerRaid.get(att.raid_id)!.add(att.user_id);
  }

  for (const [raidId, users] of attendancePerRaid) {
    const raid = raidMap.get(raidId);
    if (!raid) continue;
    const { month, active } = raid;
    if (active === 0) continue;
    const percent = (users.size / active) * 100;
    aglByMonth[month].totalPercent += percent;
    aglByMonth[month].count += 1;
  }

  return aglByMonth.map((entry, i) => ({
    month: MONTHS[i],
    percent: entry.count ? entry.totalPercent / entry.count : 0,
  }));
}
