"use server";

import sql from "@/shared/lib/db";
import { computeMonthlyAttendanceForUsers } from "@/actions/getAllUsersActivityWithPercent";

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
];

const CLASS_LABELS: Record<string, string> = {
  Тактик: "Тактики",
  Бард: "Барды",
  Танцор: "Танцоры",
  Хил: "Хилы",
  Маг: "Маги",
  Лук: "Лучники",
  Милик: "Милики",
};

// Посещаемость и зарплата считаются за последний завершённый календарный
// месяц: текущий месяц в начале почти всегда пустой (нет рейдов/начислений).
function getPreviousMonth(): { month: number; year: number } {
  const now = new Date();
  const month = now.getMonth(); // 0-based текущий -> предыдущий как 1-based
  const year = month === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return { month: month === 0 ? 12 : month, year };
}

type RosterUser = {
  id: number;
  class: string | null;
  class_gear_score: number | null;
  joined_at: string | null;
};

export async function getRosterComposition(): Promise<RosterClassStat[]> {
  let users;
  try {
    users = await sql<any[]>`
      SELECT id, class, class_gear_score, joined_at FROM "user" WHERE active = true
    `;
  } catch (usersError) {
    console.error("Ошибка при получении состава гильдии:", usersError);
    throw new Error("Не удалось загрузить состав гильдии");
  }

  const { month, year } = getPreviousMonth();

  let attendance: Awaited<ReturnType<typeof computeMonthlyAttendanceForUsers>>;
  let salaryRows;
  try {
    [attendance, salaryRows] = await Promise.all([
      computeMonthlyAttendanceForUsers(users, month, year),
      sql<any[]>`SELECT "userId", total FROM "Salary" WHERE month = ${month} AND year = ${year}`,
    ]);
  } catch (error) {
    console.error("Ошибка при получении зарплат:", error);
    throw new Error("Не удалось загрузить зарплаты");
  }

  const paidUserIds = new Set(
    (salaryRows ?? [])
      .filter((s) => (s.total ?? 0) > 0)
      .map((s) => s.userId),
  );

  function buildStat(className: string, members: RosterUser[]): RosterClassStat {
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
