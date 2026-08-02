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
  probationBypass: boolean;
  tags: string[];
  primePercent: number;
  totalPercent: number;
  basePoints: number;
  tenureBonusPercent: number;
  individualBonusPercent: number;
  penaltyPoints: number;
  asOf?: Date;
  // Критерии допуска — редактируются админом в Настройках, см.
  // salaryEligibilitySettings.ts.
  primeEnabled: boolean;
  primeThresholdPercent: number;
  pointsEnabled: boolean;
  pointsThresholdPercent: number;
  dvBypassEnabled: boolean;
  // ГС: включается отдельным тумблером, не обходится тегом ДВ — это
  // проверка снаряжения, а не посещаемости. requiredGearScore уже посчитан
  // вызывающей стороной по формуле гильдии (calculateRequiredGearScore).
  gsEnabled: boolean;
  classGearScore: number | null;
  requiredGearScore: number | null;
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
    probationBypass,
    tags,
    primePercent,
    totalPercent,
    basePoints,
    tenureBonusPercent,
    individualBonusPercent,
    penaltyPoints,
    asOf,
    primeEnabled,
    primeThresholdPercent,
    pointsEnabled,
    pointsThresholdPercent,
    dvBypassEnabled,
    gsEnabled,
    classGearScore,
    requiredGearScore,
  } = input;

  if (!active) {
    return { eligible: false, reason: "Игрок не активен", finalWeight: 0, penaltyPercent: 0 };
  }

  if (!isEligibleForSalary) {
    return {
      eligible: false,
      reason: "Лох, ГМ забрал зарплату у тебя",
      finalWeight: 0,
      penaltyPercent: 0,
    };
  }

  if (!probationBypass && !isProbationOver(joinedAt, asOf)) {
    return { eligible: false, reason: "Испытательный срок не завершён", finalWeight: 0, penaltyPercent: 0 };
  }

  if (tags.includes("АФК")) {
    return { eligible: false, reason: "Пользователь в АФК", finalWeight: 0, penaltyPercent: 0 };
  }

  // Пороги допуска включаются/выключаются и настраиваются админом (см.
  // salaryEligibilitySettings.ts). Если оба порога выключены — критериев нет,
  // проверка проходит автоматически. Включённые пороги проверяются все разом
  // (И): например, если включены и Праймы, и Баллы, нужно пройти оба.
  const hasDv = tags.includes("ДВ");
  const thresholdChecks: boolean[] = [];
  if (primeEnabled) thresholdChecks.push(primePercent > primeThresholdPercent);
  if (pointsEnabled) thresholdChecks.push(totalPercent > pointsThresholdPercent);
  const meetsThresholds = thresholdChecks.every(Boolean);
  const bypassedByDv = dvBypassEnabled && hasDv;

  if (!bypassedByDv && !meetsThresholds) {
    const parts: string[] = [];
    if (primeEnabled) parts.push(`посещаемость праймов > ${primeThresholdPercent}%`);
    if (pointsEnabled) parts.push(`учёт баллов > ${pointsThresholdPercent}%`);
    const criteria = parts.join(" и ");
    return {
      eligible: false,
      reason: dvBypassEnabled
        ? `Не выполнены критерии допуска (${criteria}, либо тег ДВ)`
        : `Не выполнены критерии допуска (${criteria})`,
      finalWeight: 0,
      penaltyPercent: 0,
    };
  }

  // ГС — не обходится тегом ДВ, это про снаряжение, а не про посещаемость.
  if (gsEnabled) {
    const requiredGS = requiredGearScore ?? 0;
    const actualGS = classGearScore ?? 0;
    if (actualGS < requiredGS) {
      return {
        eligible: false,
        reason: `Недостаточный ГС (${actualGS} < ${requiredGS})`,
        finalWeight: 0,
        penaltyPercent: 0,
      };
    }
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
