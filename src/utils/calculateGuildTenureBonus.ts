// Бонус за срок пребывания в гильдии: растёт непрерывно ~1% в месяц (по дням),
// плюс фиксированные +5% после полугода. Без верхнего предела.
// Источник: (days>30.5 ? (days/30.5)*1% - 1% : 0) + (days>182 ? 5% : 0), days — дней с даты вступления.
export default function calculateGuildTenureBonus(
  joinedAt: string | Date | null,
  asOf: Date = new Date(),
): number {
  if (!joinedAt) return 0;

  const joined = new Date(joinedAt);
  const now = asOf;
  const days = Math.floor(
    (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24),
  );

  let bonusPercent = 0;
  if (days > 30.5) bonusPercent += (days / 30.5) * 1 - 1;
  if (days > 182) bonusPercent += 5;

  return bonusPercent;
}
