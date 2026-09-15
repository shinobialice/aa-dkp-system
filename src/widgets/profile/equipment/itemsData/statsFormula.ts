// Коэффициенты масштабирования по качеству (индекс = grade, 0-12) — сняты
// прямо из JS-кода страницы предмета на archeagecodex.com (var var_wearable_armor,
// var_holdable_dps и т.д. — один и тот же ряд для Защиты/Сопротивления/Урона/
// Силы заклинаний/Эффективности исцеления, у любого типа предмета — брони,
// оружия, щита).
const GRADE_MULTIPLIERS = [
  0.8, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.35, 1.5, 1.7, 1.9, 2.0, 2.1,
];

// Атрибуты (Сила/Ловкость/Выносливость/Интеллект/Сила духа) масштабируются
// ДРУГИМ рядом (var stat_multiplier в том же JS) — даже на одном и том же
// предмете он не совпадает с рядом выше. Совпадают оба ряда только на
// грейдах 0, 1 и 12 — поэтому баг было не увидеть на нашей "Эпохи Двенадцати"
// проверке.
const ATTRIBUTE_MULTIPLIERS = [
  0.8, 1.0, 1.08, 1.16, 1.24, 1.32, 1.4, 1.5, 1.6, 1.7, 1.85, 2.0, 2.1,
];

const ATTRIBUTE_STATS = new Set(["str", "dex", "sta", "int", "spi"]);

// Статы ожерелий доблести зашиты в конкретный предмет напрямую (проверено
// на archeagecodex.com: значения не меняются при переключении грейда через
// ?grade=N ни на клиенте, ни на сервере) — в отличие от обычной брони, где
// та же "Сила духа" масштабируется через stat_multiplier.
const FLAT_STATS = new Set([
  "flat_sta",
  "flat_spi",
  "skill_speed",
  "damage_taken_reduction",
  "pvp_resist",
  "crit_damage_resist",
  "tactical_readiness",
]);

export function scaleStatByGrade(base: number, grade: number): number {
  const mult = GRADE_MULTIPLIERS[grade] ?? GRADE_MULTIPLIERS[1];
  return Math.round(base * mult);
}

// Суммарный прирост базы от заточки эфенскими кубами (официальная таблица
// игры). До +10 куб поднимает предмет сразу с 0 до 10 — промежуточных
// уровней 1-9 не существует.
export const ENCHANT_BONUS_PERCENT: Record<number, number> = {
  0: 0,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  17: 17,
  18: 18,
  19: 19,
  20: 20,
  21: 20.5,
  22: 21,
  23: 21.5,
  24: 22,
  25: 22.5,
  26: 23,
  27: 23.5,
  28: 24,
  29: 24.5,
  30: 25,
  31: 26,
  32: 27.5,
  33: 29.5,
  34: 32,
  35: 35,
};

export const DEFAULT_ENCHANT = 0;
export const MAX_ENCHANT = 35;

export const DEFAULT_EXTRA_PROTECTION = 0;
export const MAX_EXTRA_PROTECTION = 5;
export const MAX_EXTRA_PROTECTION_WEAPON = 10;

const WEAPON_SLOT_KEYS = new Set(["weapon_main", "weapon_off", "weapon_ranged"]);

export function getMaxExtraProtectionLevel(slotKey: string): number {
  return WEAPON_SLOT_KEYS.has(slotKey)
    ? MAX_EXTRA_PROTECTION_WEAPON
    : MAX_EXTRA_PROTECTION;
}

// Защита от доп. урона оружия — уровень 0-5 у брони, 0-10 у оружия, просто
// отображается в тултипе (Lv.N), на статы не влияет.
export function isValidExtraProtectionLevel(
  level: number,
  slotKey: string,
): boolean {
  return (
    Number.isInteger(level) &&
    level >= 0 &&
    level <= getMaxExtraProtectionLevel(slotKey)
  );
}

// В самой игре куб прыгает сразу с 0 на 10 (промежуточных +1…+9 не бывает),
// но поле ввода — свободное число 0-35: для непопадающих в таблицу
// уровней bonus просто 0%, это безопасный фолбэк.
export function isValidEnchantLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 0 && level <= MAX_ENCHANT;
}

// Заточка увеличивает Защиту/Сопротивление у брони и щитов, Урон/Силу
// заклинаний/Исцеляющую силу у оружия — атрибуты не трогает.
const ENCHANT_AFFECTED_STATS = new Set([
  "wearable_armor",
  "wearable_magic_resistance",
  "weapon_dps",
  "weapon_magic_power",
  "weapon_heal_power",
]);

export function scaleStat(
  base: number,
  grade: number,
  enchant: number,
  statKey: string,
): number {
  if (FLAT_STATS.has(statKey)) return base;

  const multipliers = ATTRIBUTE_STATS.has(statKey)
    ? ATTRIBUTE_MULTIPLIERS
    : GRADE_MULTIPLIERS;
  const gradeMult = multipliers[grade] ?? multipliers[1];
  const gradeScaled = base * gradeMult;

  if (!ENCHANT_AFFECTED_STATS.has(statKey)) {
    return Math.round(gradeScaled);
  }

  const bonusPercent = ENCHANT_BONUS_PERCENT[enchant] ?? 0;
  return Math.round(gradeScaled * (1 + bonusPercent / 100));
}

export const STAT_ORDER = [
  "weapon_dps",
  "weapon_magic_power",
  "weapon_heal_power",
  "wearable_armor",
  "wearable_magic_resistance",
  "str",
  "dex",
  "sta",
  "int",
  "spi",
  "flat_sta",
  "flat_spi",
  "skill_speed",
  "damage_taken_reduction",
  "pvp_resist",
  "crit_damage_resist",
  "tactical_readiness",
  "crit_dmg_melee",
  "crit_dmg_ranged",
  "crit_dmg_spell",
  "heal_crit_effect",
  "crit_resist_ignore",
  "heal_effectiveness_bonus",
  "pvp_skill_dmg_melee",
  "pvp_skill_dmg_ranged",
  "pvp_skill_dmg_spell",
  "euphoria_cooldown",
  "atk_power_melee",
  "atk_power_ranged",
  "vuln_ignore_melee",
  "vuln_ignore_ranged",
  "vuln_ignore_spell",
  "heal_crit_chance",
  "armor_penetration",
  "resist_ignore",
  "euphoria_duration",
  "skill_dmg_melee",
  "skill_dmg_ranged",
  "skill_dmg_spell",
  "heal_skill_dmg",
  "pvp_resist_ignore",
];

export const STAT_LABELS: Record<string, string> = {
  weapon_dps: "Урон",
  weapon_magic_power: "Сила заклинаний",
  weapon_heal_power: "Эффективность исцеления",
  wearable_armor: "Защита",
  wearable_magic_resistance: "Сопротивление",
  str: "Сила",
  dex: "Ловкость",
  sta: "Выносливость",
  int: "Интеллект",
  spi: "Сила духа",
  flat_sta: "Выносливость",
  flat_spi: "Сила духа",
  skill_speed: "Время применения умений",
  damage_taken_reduction: "Получаемый урон",
  pvp_resist: "Устойчивость к атакам в PvP",
  crit_damage_resist: "Устойчивость к критическому урону",
  tactical_readiness: "Тактическая подготовка",
  crit_dmg_melee: "Критический урон в ближнем бою",
  crit_dmg_ranged: "Критический урон в дальнем бою",
  crit_dmg_spell: "Критический урон заклинаний",
  heal_crit_effect: "Критический эффект исцеления",
  crit_resist_ignore: "Игнорирование устойчивости к критическому урону",
  heal_effectiveness_bonus: "Дополнительная эффективность исцеления",
  pvp_skill_dmg_melee: "Доп. урон умений ближнего боя в PvP",
  pvp_skill_dmg_ranged: "Доп. урон умений дальнего боя в PvP",
  pvp_skill_dmg_spell: "Доп. урон умений заклинателя в PvP",
  euphoria_cooldown: "Время восстановления умения «Эйфория»",
  atk_power_melee: "Сила атаки в ближнем бою",
  atk_power_ranged: "Сила атаки в дальнем бою",
  vuln_ignore_melee: "Игнорирование устойчивости к атакам ближнего боя",
  vuln_ignore_ranged: "Игнорирование устойчивости к атакам дальнего боя",
  vuln_ignore_spell: "Игнорирование устойчивости к заклинаниям",
  heal_crit_chance: "Шанс критического эффекта исцеления",
  armor_penetration: "Пробивание брони",
  resist_ignore: "Игнорирование сопротивления",
  euphoria_duration: "Время действия эффекта неуязвимости умения «Эйфория»",
  skill_dmg_melee: "Дополнительный урон умений ближнего боя",
  skill_dmg_ranged: "Дополнительный урон умений дальнего боя",
  skill_dmg_spell: "Дополнительный урон умений заклинателя",
  heal_skill_dmg: "Урон исцеляющими умениями",
  pvp_resist_ignore: "Игнорирование устойчивости к атакам в PvP",
};

// Проценты выводим со знаком %, секунды — с пробелом перед "сек.", остальное — как есть (в ед.).
export const STAT_UNITS: Record<string, string> = {
  skill_speed: "%",
  damage_taken_reduction: "%",
  crit_dmg_melee: "%",
  crit_dmg_ranged: "%",
  crit_dmg_spell: "%",
  heal_crit_effect: "%",
  heal_effectiveness_bonus: "%",
  pvp_skill_dmg_melee: "%",
  pvp_skill_dmg_ranged: "%",
  pvp_skill_dmg_spell: "%",
  euphoria_cooldown: " сек.",
  vuln_ignore_melee: "%",
  vuln_ignore_ranged: "%",
  vuln_ignore_spell: "%",
  heal_crit_chance: "%",
  euphoria_duration: " сек.",
  skill_dmg_melee: "%",
  skill_dmg_ranged: "%",
  skill_dmg_spell: "%",
  heal_skill_dmg: "%",
};
