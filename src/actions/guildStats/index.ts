// src/actions/guildStats/index.ts
export * from "./attendance";
export * from "./monthly";

// Реализация getGuildAttendancePrime и getGuildAttendanceAgl
import {
  getRaidData,
  getAttendances,
  calculateDailyAverage,
} from "./attendance";

export async function getGuildAttendancePrime({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const raids = (await getRaidData(year, month)).filter(
    (r) => r.type === "Прайм",
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
    (r) => r.type === "АГЛ",
  );
  const attendances = await getAttendances();
  return calculateDailyAverage(raids, attendances);
}
