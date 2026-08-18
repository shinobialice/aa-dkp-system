"use server";
import sql from "@/shared/lib/db";
import { getMoscowTime } from "@/shared/config/fixedSchedule";

const MONTHLY_SKIP_ALLOWANCE = 7;

export type PrimeStreak = {
  streak: number;
  isOnSkip: boolean;
  skipsUsedThisMonth: number;
  skipAllowance: number;
};

// raid.start_date хранится как naive-строка без таймзоны в московском
// времени (см. getEvents.ts) — сравнивать её нужно с такой же naive-строкой,
// а не с toISOString(), иначе сравнение съезжает на разницу с UTC.
function toNaiveMoscowString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
  );
}

export async function getUserPrimeStreak(
  userId: number,
): Promise<PrimeStreak> {
  const moscowNow = getMoscowTime();
  const nowNaive = toNaiveMoscowString(moscowNow);
  const currentMonthKey = nowNaive.slice(0, 7);

  let raidRows;
  try {
    raidRows = await sql<any[]>`
      SELECT id, start_date FROM raid
      WHERE type = 'Прайм' AND start_date <= ${nowNaive}
      ORDER BY start_date DESC
      LIMIT 400
    `;
  } catch (error) {
    console.error("Ошибка при получении серии посещений Прайма:", error);
    return {
      streak: 0,
      isOnSkip: false,
      skipsUsedThisMonth: 0,
      skipAllowance: MONTHLY_SKIP_ALLOWANCE,
    };
  }

  const raidIds = raidRows.map((r) => r.id);
  let attendanceRows: { raid_id: number; user_id: number }[] = [];
  if (raidIds.length > 0) {
    attendanceRows = await sql<any[]>`
      SELECT raid_id, user_id FROM raid_attendance WHERE raid_id = ANY(${raidIds})
    `;
  }
  const attendedRaidIds = new Set(
    attendanceRows.filter((a) => a.user_id === userId).map((a) => a.raid_id),
  );

  // Несколько Праймов в один день — не редкость (пересозданные рейды и
  // т.п.), но серия считается по дням, а не по количеству рейдов: день
  // засчитан, если пользователь был хотя бы на одном Прайме в этот день.
  const dayMap = new Map<string, boolean>();
  for (const raid of raidRows) {
    const day = (raid.start_date ?? "").slice(0, 10);
    if (!day) continue;
    const attended = attendedRaidIds.has(raid.id);
    dayMap.set(day, (dayMap.get(day) ?? false) || attended);
  }

  const days = Array.from(dayMap.keys()).sort().reverse();

  // Пропущенный день не обрывает серию, пока не исчерпан месячный лимит
  // пропусков — как заморозка серии в Duolingo. Лимит считается по месяцу
  // самого дня, а не текущему, поэтому при уходе в прошлый месяц он
  // сбрасывается сам собой.
  const skipsUsedByMonth = new Map<string, number>();
  let streak = 0;
  let isOnSkip = false;

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const attended = dayMap.get(day) ?? false;

    if (attended) {
      streak += 1;
      continue;
    }

    const monthKey = day.slice(0, 7);
    const skipsUsed = skipsUsedByMonth.get(monthKey) ?? 0;

    if (skipsUsed >= MONTHLY_SKIP_ALLOWANCE) {
      break;
    }

    skipsUsedByMonth.set(monthKey, skipsUsed + 1);
    if (i === 0) isOnSkip = true;
  }

  return {
    streak,
    isOnSkip,
    skipsUsedThisMonth: skipsUsedByMonth.get(currentMonthKey) ?? 0,
    skipAllowance: MONTHLY_SKIP_ALLOWANCE,
  };
}
