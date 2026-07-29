import isProbationOver from "./isProbationOver";
import calculateRequiredGearScore from "./calculateRequiredGearScore";

type UserForEligibility = {
  active: boolean;
  joined_at: string | Date | null;
  class?: string | null;
  class_gear_score?: number | null;
};

type UserTag = {
  tag: string;
};

export type SalaryEligibilityCheck = {
  // Жёсткие блокеры — переключатель не сработает, пока они есть.
  hardErrors: string[];
  // ГС — не жёсткий блокер: показывается как предупреждение с
  // подтверждением ("ты уверен?"), которое админ может обойти. Присутствует
  // только если проверка ГС включена в настройках (gsEnabled).
  gsWarning: string | null;
};

function getSalaryEligibilityErrors(
  user: UserForEligibility,
  averageGuildGS: number,
  tags: UserTag[],
  gsEnabled: boolean,
): SalaryEligibilityCheck {
  const hardErrors: string[] = [];

  if (!user.active) {
    hardErrors.push("Игрок не активен");
  }

  if (!user.joined_at) {
    hardErrors.push("Дата вступления не указана");
  } else if (!isProbationOver(user.joined_at)) {
    const day = new Date(user.joined_at).getDate();
    const needMonths = day <= 20 ? 1 : 2;
    hardErrors.push(
      `Испытательный срок не завершён: нужно ≥ ${needMonths} мес.`,
    );
  }

  let gsWarning: string | null = null;
  if (gsEnabled) {
    const isTwoHanded = tags.some((t) => t.tag === "Двурук");
    const requiredGS = calculateRequiredGearScore(
      user.class,
      averageGuildGS,
      isTwoHanded,
    );

    const actualGS = user.class_gear_score ?? 0;
    if (actualGS < requiredGS) {
      gsWarning = `Недостаточный ГС: у игрока ${actualGS}, требуется ≥ ${requiredGS}`;
    }
  }

  return { hardErrors, gsWarning };
}

export default getSalaryEligibilityErrors;
