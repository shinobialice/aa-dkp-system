// Проходной ГС гильдии: средний ГС по гильдии, округлённый вниз до 500,
// затем поправка по классу/комплекту.
export default function calculateRequiredGearScore(
  className: string | null | undefined,
  averageGuildGS: number,
  isTwoHanded: boolean,
): number {
  const roundedGS = Math.floor(averageGuildGS / 500) * 500;
  const cls = className?.toLowerCase() || "";

  if (["тактик", "бард", "танцор"].some((c) => cls.includes(c))) {
    return roundedGS - 2000;
  }
  if (["хил", "целитель"].some((c) => cls.includes(c))) {
    return roundedGS + (isTwoHanded ? -500 : 0);
  }
  if (["маг", "милик", "лучник"].some((c) => cls.includes(c))) {
    return roundedGS + (isTwoHanded ? -500 : 500);
  }
  return roundedGS;
}
