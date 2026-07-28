import isProbationOver from "./isProbationOver";

type UserForEligibility = {
  active: boolean;
  joined_at: string | Date | null;
  class?: string | null;
  class_gear_score?: number | null;
};

type UserTag = {
  tag: string;
};

function getSalaryEligibilityErrors(
  user: UserForEligibility,
  averageGuildGS: number,
  tags: UserTag[],
): string[] {
  const errors: string[] = [];

  if (!user.active) {
    errors.push("Игрок не активен");
  }

  if (!user.joined_at) {
    errors.push("Дата вступления не указана");
  } else if (!isProbationOver(user.joined_at)) {
    const day = new Date(user.joined_at).getDate();
    const needMonths = day <= 20 ? 1 : 2;
    errors.push(`Испытательный срок не завершён: нужно ≥ ${needMonths} мес.`);
  }

  const isTwoHanded = tags.some((t) => t.tag === "Двурук");
  const className = user.class?.toLowerCase() || "";
  const roundedGS = Math.floor(averageGuildGS / 500) * 500;
  let requiredGS = roundedGS;

  if (["тактик", "бард", "танцор"].some((c) => className.includes(c))) {
    requiredGS -= 2000;
  } else if (["хил", "целитель"].some((c) => className.includes(c))) {
    requiredGS += isTwoHanded ? -500 : 0;
  } else if (["маг", "милик", "лучник"].some((c) => className.includes(c))) {
    requiredGS += isTwoHanded ? -500 : 500;
  }

  const actualGS = user.class_gear_score ?? 0;
  if (actualGS < requiredGS) {
    errors.push(
      `Недостаточный ГС: у игрока ${actualGS}, требуется ≥ ${requiredGS}`,
    );
  }

  return errors;
}

export default getSalaryEligibilityErrors;
