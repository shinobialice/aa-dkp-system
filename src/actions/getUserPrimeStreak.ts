"use server";
import sql from "@/shared/lib/db";
import { getMoscowISOString } from "@/utils/getMoscowISOString";

const MONTHLY_SKIP_ALLOWANCE = 7;
const MAX_DAYS = 400;

export type PrimeStreak = {
  streak: number;
  isOnSkip: boolean;
  skipsUsedThisMonth: number;
  skipAllowance: number;
};

type PrimeDay = { day: string; attended: boolean };

export async function getUserPrimeStreak(userId: number): Promise<PrimeStreak> {
  const nowNaive = getMoscowISOString(new Date());

  let days: PrimeDay[];
  try {
    days = await sql<PrimeDay[]>`
      SELECT
        r.start_date::date::text AS day,
        bool_or(ra.user_id IS NOT NULL) AS attended
      FROM raid r
      LEFT JOIN raid_attendance ra ON ra.raid_id = r.id AND ra.user_id = ${userId}
      WHERE r.type = 'Прайм' AND r.start_date <= ${nowNaive}
      GROUP BY day
      ORDER BY day DESC
      LIMIT ${MAX_DAYS}
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

  const { streak, isOnSkip, skipsUsedByMonth } = countStreak(days);
  return {
    streak,
    isOnSkip,
    skipsUsedThisMonth: skipsUsedByMonth.get(nowNaive.slice(0, 7)) ?? 0,
    skipAllowance: MONTHLY_SKIP_ALLOWANCE,
  };
}

// Пропущенный день не обрывает серию, пока не исчерпан лимит пропусков месяца
// этого дня, как заморозка серии в Duolingo.
function countStreak(days: PrimeDay[]) {
  const skipsUsedByMonth = new Map<string, number>();
  let streak = 0;
  let isOnSkip = false;

  for (const [index, { day, attended }] of days.entries()) {
    if (attended) {
      streak += 1;
      continue;
    }

    const monthKey = day.slice(0, 7);
    const skipsUsed = skipsUsedByMonth.get(monthKey) ?? 0;
    if (skipsUsed >= MONTHLY_SKIP_ALLOWANCE) break;

    skipsUsedByMonth.set(monthKey, skipsUsed + 1);
    if (index === 0) isOnSkip = true;
  }

  return { streak, isOnSkip, skipsUsedByMonth };
}
