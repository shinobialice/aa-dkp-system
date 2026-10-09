import { ENGRAVING_STAT } from "../engravingBonuses";

export type StatEffect = {
  label: string;
  unit: string;
  decimals: number;
  isReduction?: boolean;
};

export type StatBonuses = Map<string, number>;

export const STAT_LABEL = {
  STR: "Сила",
  INT: "Интеллект",
  DEX: "Ловкость",
  SPI: "Сила духа",
  STA: "Выносливость",
  MELEE_ACCURACY: "Точность ударов в ближнем бою",
  RANGED_ACCURACY: "Точность ударов в дальнем бою",
  SPELL_ACCURACY: "Точность заклинаний",
  MELEE_BACKSTAB: "Урон в ближнем бою со спины",
  RANGED_BACKSTAB: "Урон в дальнем бою со спины",
  SPELL_BACKSTAB: "Урон заклинаниями со спины",
  MELEE_SKILL_DMG: "Доп. урон умений в ближнем бою",
  RANGED_SKILL_DMG: "Доп. урон умений в дальнем бою",
  SPELL_SKILL_DMG: "Доп. урон умений заклинаниями",
  DEFENSE_BYPASS: "Шанс обхода обороны",
  CRIT_RESIST_IGNORE: "Игнорирование устойчивости к критическому урону",
  PVP_RESIST_IGNORE: "Игнорирование устойчивости к атакам в PvP",
  SIEGE_VULN: "Уязвимость к осадному урону",
  SIEGE_RESIST_IGNORE: "Игнорирование устойчивости к осадному урону",
  PVE_VULN: "Уязвимость при сражении с монстрами",
  MELEE_RESIST_IGNORE: "Игнорирование устойчивости к атакам ближнего боя",
  RANGED_RESIST_IGNORE: "Игнорирование устойчивости к атакам дальнего боя",
  SPELL_RESIST_IGNORE: "Игнорирование устойчивости к заклинаниям",
  MELEE_FIXED_RESIST: "Показатель устойчивости в ближнем бою",
  RANGED_FIXED_RESIST: "Показатель устойчивости в дальнем бою",
  SPELL_FIXED_RESIST: "Показатель устойчивости к заклинаниям",
  MELEE_PVE_RESIST: "Устойчивость к атакам монстров в ближнем бою",
  RANGED_PVE_RESIST: "Устойчивость к атакам монстров в дальнем бою",
  SPELL_PVE_RESIST: "Устойчивость к атакам монстров заклинаниями",
  HEALER_SKILL_BONUS: "Доп. эффективность умений целителя",
  HEALING_SKILL_DMG: "Урон исцеляющими умениями",
  HEALING_SKILL_DMG_PVE: "Урон исцеляющими умениями в PvE",
  HEALTH_REGEN: "Восстановление здоровья",
  MANA_REGEN: "Восстановление маны",
  COMBAT_HEALTH_REGEN: "Восстановление здоровья в бою",
  COMBAT_MANA_REGEN: "Восстановление маны в бою",
  STEALTH_DETECTION: "Дальность обнаружения скрытых существ",
  CAST_PUSHBACK: "Задержка применения умений при получении удара",
  DAMAGE_TAKEN: "Получаемый урон",
  SPELL_POWER_INCREASE: "Повышение силы заклинаний",
  HEAL_POWER_INCREASE: "Повышение эффективности исцеления",
} as const;

// Названия статов в описаниях рун и в статах предметов отличаются от наших.
const STAT_LABEL_ALIASES: Record<string, string> = {
  "Доп. урон умений ближнего боя": STAT_LABEL.MELEE_SKILL_DMG,
  "Доп. урон умений дальнего боя": STAT_LABEL.RANGED_SKILL_DMG,
  "Доп. урон умений заклинателя": STAT_LABEL.SPELL_SKILL_DMG,
  "Дальность обнаружения скрытных существ": STAT_LABEL.STEALTH_DETECTION,
  "Доп. урон умений ближнего боя в PvP": ENGRAVING_STAT.MELEE_SKILL_DMG_PVP,
  "Доп. урон умений дальнего боя в PvP": ENGRAVING_STAT.RANGED_SKILL_DMG_PVP,
  "Доп. урон умений заклинателя в PvP": ENGRAVING_STAT.SPELL_SKILL_DMG_PVP,
  "Доп. урон умений ближнего боя по монстрам":
    ENGRAVING_STAT.MELEE_SKILL_DMG_PVE,
  "Доп. урон умений дальнего боя по монстрам":
    ENGRAVING_STAT.RANGED_SKILL_DMG_PVE,
  "Доп. урон умений заклинателя по монстрам":
    ENGRAVING_STAT.SPELL_SKILL_DMG_PVE,
  "Урон исцеляющими умениями по монстрам": STAT_LABEL.HEALING_SKILL_DMG_PVE,
  "Получаемый урон от монстров": STAT_LABEL.PVE_VULN,
  "Объем здоровья": ENGRAVING_STAT.HEALTH,
  "Максимум маны": ENGRAVING_STAT.MANA,
};

export function canonicalStatLabel(label: string): string {
  return STAT_LABEL_ALIASES[label] ?? label;
}

const PERCENT = { unit: "%", decimals: 1 };
const POINTS = { unit: "", decimals: 0 };
const FRACTIONAL_POINTS = { unit: "", decimals: 1 };

// Коды эффектов — внутренние коды калькулятора, а не unit_attribute игры.
// Эффекты «на снижение» в данных положительные, а у нас хранятся со знаком минус,
// как у гравировок.
export const STAT_EFFECTS: Record<number, StatEffect> = {
  0: { label: ENGRAVING_STAT.HEALTH, ...POINTS },
  1: { label: ENGRAVING_STAT.MANA, ...POINTS },
  2: { label: ENGRAVING_STAT.MELEE_ATTACK, ...FRACTIONAL_POINTS },
  3: { label: ENGRAVING_STAT.RANGED_ATTACK, ...FRACTIONAL_POINTS },
  4: { label: ENGRAVING_STAT.SPELL_POWER, ...FRACTIONAL_POINTS },
  5: { label: ENGRAVING_STAT.HEAL_POWER, ...FRACTIONAL_POINTS },
  6: { label: ENGRAVING_STAT.DEFENSE, ...POINTS },
  7: { label: ENGRAVING_STAT.RESIST, ...POINTS },
  8: { label: STAT_LABEL.STR, ...POINTS },
  9: { label: STAT_LABEL.INT, ...POINTS },
  10: { label: STAT_LABEL.DEX, ...POINTS },
  11: { label: STAT_LABEL.SPI, ...POINTS },
  12: { label: STAT_LABEL.STA, ...POINTS },
  13: { label: ENGRAVING_STAT.MOVE_SPEED, ...PERCENT },
  14: { label: ENGRAVING_STAT.SKILL_SPEED, ...PERCENT, isReduction: true },
  15: { label: ENGRAVING_STAT.PROFICIENCY, ...POINTS },
  16: { label: STAT_LABEL.MELEE_ACCURACY, ...PERCENT },
  17: { label: ENGRAVING_STAT.MELEE_CRIT_CHANCE, ...PERCENT },
  18: { label: ENGRAVING_STAT.MELEE_CRIT_DAMAGE, ...PERCENT },
  19: { label: STAT_LABEL.MELEE_BACKSTAB, ...PERCENT },
  20: { label: STAT_LABEL.MELEE_SKILL_DMG, ...PERCENT },
  21: { label: ENGRAVING_STAT.MELEE_SKILL_DMG_PVE, ...PERCENT },
  22: { label: ENGRAVING_STAT.MELEE_SKILL_DMG_PVP, ...PERCENT },
  23: { label: STAT_LABEL.RANGED_ACCURACY, ...PERCENT },
  24: { label: ENGRAVING_STAT.RANGED_CRIT_CHANCE, ...PERCENT },
  25: { label: ENGRAVING_STAT.RANGED_CRIT_DAMAGE, ...PERCENT },
  26: { label: STAT_LABEL.RANGED_BACKSTAB, ...PERCENT },
  27: { label: STAT_LABEL.RANGED_SKILL_DMG, ...PERCENT },
  28: { label: ENGRAVING_STAT.RANGED_SKILL_DMG_PVE, ...PERCENT },
  29: { label: ENGRAVING_STAT.RANGED_SKILL_DMG_PVP, ...PERCENT },
  30: { label: STAT_LABEL.SPELL_ACCURACY, ...PERCENT },
  31: { label: ENGRAVING_STAT.SPELL_CRIT_CHANCE, ...PERCENT },
  32: { label: ENGRAVING_STAT.SPELL_CRIT_DAMAGE, ...PERCENT },
  33: { label: STAT_LABEL.SPELL_BACKSTAB, ...PERCENT },
  34: { label: STAT_LABEL.SPELL_SKILL_DMG, ...PERCENT },
  35: { label: ENGRAVING_STAT.SPELL_SKILL_DMG_PVE, ...PERCENT },
  36: { label: ENGRAVING_STAT.SPELL_SKILL_DMG_PVP, ...PERCENT },
  37: { label: ENGRAVING_STAT.TACTICAL_READINESS, ...POINTS },
  38: { label: STAT_LABEL.DEFENSE_BYPASS, ...PERCENT },
  39: { label: ENGRAVING_STAT.ARMOR_PENETRATION, ...POINTS },
  40: { label: ENGRAVING_STAT.RESIST_IGNORE, ...POINTS },
  41: { label: ENGRAVING_STAT.PARRY, ...PERCENT },
  42: { label: ENGRAVING_STAT.BLOCK, ...PERCENT },
  43: { label: ENGRAVING_STAT.DODGE, ...PERCENT },
  44: { label: ENGRAVING_STAT.CRIT_DAMAGE_RESIST, ...POINTS },
  45: { label: STAT_LABEL.CRIT_RESIST_IGNORE, ...POINTS },
  46: { label: ENGRAVING_STAT.PVP_RESIST, ...FRACTIONAL_POINTS },
  47: { label: STAT_LABEL.PVP_RESIST_IGNORE, ...POINTS },
  48: { label: STAT_LABEL.SIEGE_VULN, ...PERCENT, isReduction: true },
  49: { label: STAT_LABEL.SIEGE_RESIST_IGNORE, ...PERCENT },
  50: { label: STAT_LABEL.PVE_VULN, ...PERCENT, isReduction: true },
  51: { label: ENGRAVING_STAT.MELEE_VULN, ...PERCENT, isReduction: true },
  52: { label: STAT_LABEL.MELEE_RESIST_IGNORE, ...PERCENT },
  53: { label: STAT_LABEL.MELEE_FIXED_RESIST, ...FRACTIONAL_POINTS },
  54: { label: STAT_LABEL.MELEE_PVE_RESIST, ...FRACTIONAL_POINTS },
  55: { label: ENGRAVING_STAT.RANGED_VULN, ...PERCENT, isReduction: true },
  56: { label: STAT_LABEL.RANGED_RESIST_IGNORE, ...PERCENT },
  57: { label: STAT_LABEL.RANGED_FIXED_RESIST, ...FRACTIONAL_POINTS },
  58: { label: STAT_LABEL.RANGED_PVE_RESIST, ...FRACTIONAL_POINTS },
  59: { label: ENGRAVING_STAT.SPELL_VULN, ...PERCENT, isReduction: true },
  60: { label: STAT_LABEL.SPELL_RESIST_IGNORE, ...PERCENT },
  61: { label: STAT_LABEL.SPELL_FIXED_RESIST, ...FRACTIONAL_POINTS },
  62: { label: STAT_LABEL.SPELL_PVE_RESIST, ...FRACTIONAL_POINTS },
  63: { label: ENGRAVING_STAT.HEAL_CRIT_CHANCE, ...PERCENT },
  64: { label: ENGRAVING_STAT.HEAL_CRIT_EFFECT, ...PERCENT },
  65: { label: STAT_LABEL.HEALER_SKILL_BONUS, ...PERCENT },
  66: { label: ENGRAVING_STAT.HEAL_EFFECTIVENESS_BONUS, ...PERCENT },
  67: { label: STAT_LABEL.HEALING_SKILL_DMG, ...PERCENT },
  68: { label: STAT_LABEL.HEALING_SKILL_DMG_PVE, ...PERCENT },
  69: { label: STAT_LABEL.HEALTH_REGEN, ...POINTS },
  71: { label: STAT_LABEL.MANA_REGEN, ...POINTS },
  73: { label: ENGRAVING_STAT.HEAL_RECEIVED, ...PERCENT },
  76: { label: STAT_LABEL.STEALTH_DETECTION, ...PERCENT },
  80: { label: STAT_LABEL.CAST_PUSHBACK, ...PERCENT, isReduction: true },
  81: { label: STAT_LABEL.DAMAGE_TAKEN, ...PERCENT, isReduction: true },
  82: { label: STAT_LABEL.COMBAT_HEALTH_REGEN, ...POINTS },
  83: { label: STAT_LABEL.COMBAT_MANA_REGEN, ...POINTS },
  84: { label: STAT_LABEL.SPELL_POWER_INCREASE, ...PERCENT },
  85: { label: STAT_LABEL.HEAL_POWER_INCREASE, ...PERCENT },
};

export function signedEffectValue(effect: StatEffect, value: number): number {
  return effect.isReduction ? -Math.abs(value) : value;
}

export function addStat(bonuses: StatBonuses, label: string, value: number) {
  const key = canonicalStatLabel(label);
  bonuses.set(key, (bonuses.get(key) ?? 0) + value);
}
