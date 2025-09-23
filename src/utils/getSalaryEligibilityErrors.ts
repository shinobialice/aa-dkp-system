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

  const now = new Date();
  const joined = user.joined_at ? new Date(user.joined_at) : null;
  if (!joined) {
    errors.push("Дата вступления не указана");
  } else {
    const day = joined.getDate();
    const monthsPassed =
      now.getFullYear() * 12 +
      now.getMonth() -
      (joined.getFullYear() * 12 + joined.getMonth());

    const probationOver =
      (day <= 20 && monthsPassed >= 1) || (day > 20 && monthsPassed >= 2);

    if (!probationOver) {
      const needMonths = day <= 20 ? 1 : 2;
      errors.push(
        `Испытательный срок не завершён: прошло ${monthsPassed} мес., нужно ≥ ${needMonths}`,
      );
    }
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
