import isProbationOver from "./isProbationOver";

export const PENALTY_BLOCK_THRESHOLD = 21;

// Штрафной процент по формуле гильдии: x^(e^1.25/2)/2, где x — число штрафных баллов.
// При x >= 21 значение превышает 100%, что естественным образом обнуляет вес.
export function calculatePenaltyPercent(penaltyPoints: number): number {
  if (penaltyPoints <= 0) return 0;
  const exponent = Math.exp(1.25) / 2;
  return Math.pow(penaltyPoints, exponent) / 2;
}

type SalaryWeightInput = {
  active: boolean;
  isEligibleForSalary: boolean;
  joinedAt: string | Date | null;
  tags: string[];
  primePercent: number;
  totalPercent: number;
  basePoints: number;
  tenureBonusPercent: number;
  individualBonusPercent: number;
  penaltyPoints: number;
};

type SalaryWeightResult = {
  eligible: boolean;
  reason?: string;
  finalWeight: number;
  penaltyPercent: number;
};

export default function calculateSalaryWeight(
  input: SalaryWeightInput,
): SalaryWeightResult {
  const {
    active,
    isEligibleForSalary,
    joinedAt,
    tags,
    primePercent,
    totalPercent,
    basePoints,
    tenureBonusPercent,
    individualBonusPercent,
    penaltyPoints,
  } = input;

  if (!active) {
    return { eligible: false, reason: "Игрок не активен", finalWeight: 0, penaltyPercent: 0 };
  }

  if (!isEligibleForSalary) {
    return { eligible: false, reason: "Нет права на зарплату", finalWeight: 0, penaltyPercent: 0 };
  }

  if (!isProbationOver(joinedAt)) {
    return { eligible: false, reason: "Испытательный срок не завершён", finalWeight: 0, penaltyPercent: 0 };
  }

  if (tags.includes("АФК")) {
    return { eligible: false, reason: "Пользователь в АФК", finalWeight: 0, penaltyPercent: 0 };
  }

  // Порог "Учёт баллов > 20%" временно отключён: формула этого показателя
  // в гильдейской таблице не воспроизводится (расхождение с посчитанным
  // здесь значением, источник не найден) — блокировать зарплату по
  // непроверенному числу нельзя. Оставлен только порог по Праймам, который
  // сверен и подтверждён точно.
  const hasDv = tags.includes("ДВ");
  const meetsThresholds = primePercent > 30;
  if (!hasDv && !meetsThresholds) {
    return {
      eligible: false,
      reason: "Не выполнены критерии допуска (посещаемость праймов > 30%, либо тег ДВ)",
      finalWeight: 0,
      penaltyPercent: 0,
    };
  }

  if (penaltyPoints >= PENALTY_BLOCK_THRESHOLD) {
    return {
      eligible: false,
      reason: `Заблокирован штрафами (${penaltyPoints} >= ${PENALTY_BLOCK_THRESHOLD})`,
      finalWeight: 0,
      penaltyPercent: 100,
    };
  }

  const penaltyPercent = calculatePenaltyPercent(penaltyPoints);

  const weight =
    basePoints *
    (1 + tenureBonusPercent / 100) *
    (1 + individualBonusPercent / 100) *
    (1 - penaltyPercent / 100);

  return {
    eligible: true,
    finalWeight: Math.max(0, weight),
    penaltyPercent,
  };
}
