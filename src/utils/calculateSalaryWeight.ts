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
  primeEnabled: boolean;
  primeThresholdPercent: number;
  pointsEnabled: boolean;
  pointsThresholdPercent: number;
  dvBypassEnabled: boolean;
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

type Rejection = { reason: string; penaltyPercent: number };

const reject = (reason: string, penaltyPercent = 0): Rejection => ({
  reason,
  penaltyPercent,
});

export default function calculateSalaryWeight(
  input: SalaryWeightInput,
): SalaryWeightResult {
  const rejection =
    statusRejection(input) ??
    thresholdRejection(input) ??
    gearScoreRejection(input) ??
    penaltyRejection(input);
  if (rejection) return { eligible: false, finalWeight: 0, ...rejection };

  const penaltyPercent = calculatePenaltyPercent(input.penaltyPoints);
  const weight =
    input.basePoints *
    (1 + input.tenureBonusPercent / 100) *
    (1 + input.individualBonusPercent / 100) *
    (1 - penaltyPercent / 100);

  return { eligible: true, finalWeight: Math.max(0, weight), penaltyPercent };
}

function statusRejection(input: SalaryWeightInput) {
  if (!input.active) return reject("Игрок не активен");
  if (!input.isEligibleForSalary) {
    return reject("Лох, ГМ забрал зарплату у тебя");
  }
  if (!input.probationBypass && !isProbationOver(input.joinedAt, input.asOf)) {
    return reject("Испытательный срок не завершён");
  }
  if (input.tags.includes("АФК")) return reject("Пользователь в АФК");
  return null;
}

// Включённые пороги проверяются все разом: если включены и праймы, и баллы,
// нужно пройти оба. Тег ДВ может их обходить.
function thresholdRejection(input: SalaryWeightInput) {
  const checks = [
    {
      enabled: input.primeEnabled,
      passed: input.primePercent > input.primeThresholdPercent,
      label: `посещаемость праймов > ${input.primeThresholdPercent}%`,
    },
    {
      enabled: input.pointsEnabled,
      passed: input.totalPercent > input.pointsThresholdPercent,
      label: `учёт баллов > ${input.pointsThresholdPercent}%`,
    },
  ].filter((check) => check.enabled);

  const bypassedByDv = input.dvBypassEnabled && input.tags.includes("ДВ");
  if (bypassedByDv || checks.every((check) => check.passed)) return null;

  const criteria = checks.map((check) => check.label).join(" и ");
  return reject(
    input.dvBypassEnabled
      ? `Не выполнены критерии допуска (${criteria}, либо тег ДВ)`
      : `Не выполнены критерии допуска (${criteria})`,
  );
}

// ГС не обходится тегом ДВ: это про снаряжение, а не про посещаемость.
function gearScoreRejection(input: SalaryWeightInput) {
  if (!input.gsEnabled) return null;
  const required = input.requiredGearScore ?? 0;
  const actual = input.classGearScore ?? 0;
  if (actual >= required) return null;
  return reject(`Недостаточный ГС (${actual} < ${required})`);
}

function penaltyRejection(input: SalaryWeightInput) {
  if (input.penaltyPoints < PENALTY_BLOCK_THRESHOLD) return null;
  return reject(
    `Заблокирован штрафами (${input.penaltyPoints} >= ${PENALTY_BLOCK_THRESHOLD})`,
    100,
  );
}
