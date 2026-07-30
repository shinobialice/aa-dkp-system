import calculateGuildTenureBonus from "./calculateGuildTenureBonus";
import calculateRequiredGearScore from "./calculateRequiredGearScore";
import calculateSalaryWeight from "./calculateSalaryWeight";
import type { SalaryEligibilityContext } from "@/actions/financeActions";

export type SalaryWeightUser = {
  id: number;
  joined_at: string | null;
  active: boolean;
  is_eligible_for_salary: boolean;
  class?: string | null;
  class_gear_score?: number | null;
};

type SalaryWeightUserData = {
  attendance: { primePercent: number; aglPercent: number; totalPercent: number };
  tags: string[];
  penaltyPoints: number;
  individualBonusPercent: number;
};

// Чистая часть computeUserSalaryWeight — без походов в БД, принимает уже
// готовые данные. Вынесена в отдельный (не "use server") модуль, чтобы
// getSalaryReasons могла один раз батчем забрать attendance/tags/penalty/bonus
// на всю гильдию и не дергать per-user запросы (см. getUserTagsBatch/
// getUserPenaltyPointsBatch/getCustomBonusBatch/computeMonthlyAttendanceForUsers).
// Next.js требует, чтобы все экспорты из файла с "use server" были async
// функциями — эта функция синхронная, поэтому не может жить в financeActions.ts.
export function buildSalaryWeightResult(
  user: SalaryWeightUser,
  asOf: Date,
  context: SalaryEligibilityContext,
  data: SalaryWeightUserData,
) {
  const { attendance, tags, penaltyPoints, individualBonusPercent } = data;
  const tenureBonusPercent = calculateGuildTenureBonus(user.joined_at, asOf);
  const { settings } = context;
  const isTwoHanded = tags.includes("Двурук");
  const requiredGearScore = settings.gsEnabled
    ? calculateRequiredGearScore(user.class, context.averageGuildGS, isTwoHanded)
    : null;

  const weightResult = calculateSalaryWeight({
    active: user.active,
    isEligibleForSalary: user.is_eligible_for_salary,
    joinedAt: user.joined_at,
    tags,
    primePercent: attendance.primePercent,
    totalPercent: attendance.totalPercent,
    basePoints: attendance.totalPercent,
    tenureBonusPercent,
    individualBonusPercent,
    penaltyPoints,
    asOf,
    primeEnabled: settings.primeEnabled,
    primeThresholdPercent: settings.primeThresholdPercent,
    pointsEnabled: settings.pointsEnabled,
    pointsThresholdPercent: settings.pointsThresholdPercent,
    dvBypassEnabled: settings.dvBypassEnabled,
    gsEnabled: settings.gsEnabled,
    classGearScore: user.class_gear_score ?? null,
    requiredGearScore,
  });

  return {
    userId: user.id,
    basePoints: attendance.totalPercent,
    tenureBonusPercent,
    individualBonusPercent,
    aglPercent: attendance.aglPercent,
    primePercent: attendance.primePercent,
    totalPercent: attendance.totalPercent,
    ...weightResult,
  };
}
