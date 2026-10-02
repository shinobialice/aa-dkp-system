const PREVIOUS_FORMULA_UNTIL = Date.UTC(2026, 9, 1);

function fullMonthsBetween(from: Date, to: Date): number {
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth()) -
    (to.getDate() < from.getDate() ? 1 : 0);
  return Math.max(0, months);
}

function previousFormula(joined: Date, asOf: Date): number {
  const days = Math.floor((asOf.getTime() - joined.getTime()) / 86_400_000);
  let bonusPercent = 0;
  if (days > 30.5) bonusPercent += (days / 30.5) * 1 - 1;
  if (days > 182) bonusPercent += 5;
  return Math.round(bonusPercent);
}

export default function calculateGuildTenureBonus(
  joinedAt: string | Date | null,
  asOf: Date = new Date(),
): number {
  if (!joinedAt) return 0;

  const joined = new Date(joinedAt);
  if (asOf.getTime() <= PREVIOUS_FORMULA_UNTIL) {
    return previousFormula(joined, asOf);
  }

  const halfYears = Math.floor(fullMonthsBetween(joined, asOf) / 6);
  return halfYears > 0 ? 10 + (halfYears - 1) * 5 : 0;
}
