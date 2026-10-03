"use server";

import sql from "@/shared/lib/db";
import type { SalaryRow, UserRow } from "@/shared/lib/dbTypes";
import { shiftYearMonth } from "@/shared/config/months";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";
import { computeMonthlyAttendanceForUsers } from "@/server/attendance";

export type RosterClassStat = {
  className: string;
  count: number;
  avgGearScore: number | null;
  avgAttendancePercent: number;
  salaryCount: number;
};

const CLASS_ORDER = [
  "Тактик",
  "Бард",
  "Танцор",
  "Хил",
  "Маг",
  "Лук",
  "Милик",
  "Стрелок",
];

const CLASS_LABELS: Record<string, string> = {
  Тактик: "Тактики",
  Бард: "Барды",
  Танцор: "Танцоры",
  Хил: "Хилы",
  Маг: "Маги",
  Лук: "Лучники",
  Милик: "Милики",
  Стрелок: "Стрелки",
};

// Посещаемость и зарплата берутся за прошлый месяц: текущий в начале почти
// всегда пустой.
function getPreviousMonth() {
  return shiftYearMonth(getMoscowYearMonth(new Date()), -1);
}

type RosterUser = Pick<
  UserRow,
  "id" | "class" | "class_gear_score" | "joined_at"
>;

export async function getRosterComposition(): Promise<RosterClassStat[]> {
  let users: RosterUser[];
  try {
    users = await sql<RosterUser[]>`
      SELECT id, class, class_gear_score, joined_at FROM "user"
      WHERE active = true
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `;
  } catch (usersError) {
    console.error("Ошибка при получении состава гильдии:", usersError);
    throw new Error("Не удалось загрузить состав гильдии");
  }

  const { month, year } = getPreviousMonth();

  let attendance: Awaited<ReturnType<typeof computeMonthlyAttendanceForUsers>>;
  let salaryRows: Pick<SalaryRow, "userId" | "total">[];
  try {
    [attendance, salaryRows] = await Promise.all([
      computeMonthlyAttendanceForUsers(users, month, year),
      sql<
        Pick<SalaryRow, "userId" | "total">[]
      >`SELECT "userId", total FROM "Salary" WHERE month = ${month} AND year = ${year}`,
    ]);
  } catch (error) {
    console.error("Ошибка при получении зарплат:", error);
    throw new Error("Не удалось загрузить зарплаты");
  }

  const paidUserIds = new Set(
    salaryRows
      .filter((salary) => salary.total > 0)
      .map((salary) => salary.userId),
  );

  function buildStat(
    className: string,
    members: RosterUser[],
  ): RosterClassStat {
    const gearScores = members
      .map((m) => m.class_gear_score)
      .filter((gs): gs is number => gs != null);
    const attendancePercents = members.map(
      (m) => attendance[m.id]?.primePercent ?? 0,
    );

    return {
      className,
      count: members.length,
      avgGearScore: gearScores.length
        ? gearScores.reduce((sum, gs) => sum + gs, 0) / gearScores.length
        : null,
      avgAttendancePercent: members.length
        ? attendancePercents.reduce((sum, p) => sum + p, 0) / members.length
        : 0,
      salaryCount: members.filter((m) => paidUserIds.has(m.id)).length,
    };
  }

  const rows = CLASS_ORDER.map((cls) =>
    buildStat(
      CLASS_LABELS[cls],
      users.filter((u) => u.class === cls),
    ),
  );

  return [buildStat("Общее", users), ...rows];
}
