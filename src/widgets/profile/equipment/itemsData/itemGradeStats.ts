// Статы предметов, у которых значения по каждому грейду зашиты индивидуально
// и не выводятся из общих таблиц масштабирования (GRADE_MULTIPLIERS /
// ATTRIBUTE_MULTIPLIERS в statsFormula.ts) — серьги ифнирского героя растут
// по собственной прогрессии. Источник: выгрузка из клиента игры (Excel),
// сверено построчно с archeagecodex.com/ajax.php?a=grade_buff (для обычных
// серёг данные точно совпали; для драгоценных codex отдаёт на часть полей
// нерасшифрованный плейсхолдер "#{ua_ignore_flexibility}" и путает лейблы
// чародея на грейдах X-XII — там взяты числа из Excel, перепроверенные по
// самосогласованности между 4 классами серёг).
export const ITEM_GRADE_STATS: Record<
  number,
  Record<number, Record<string, number>>
> = {
  // Серьга ифнирского бойца
  54860: {
    2: { str: 36 },
    3: { str: 37 },
    4: { str: 39 },
    5: { str: 40, crit_dmg_melee: 10.5 },
    6: { str: 41, crit_dmg_melee: 10.9 },
    7: { str: 43, crit_dmg_melee: 11.3 },
    8: { str: 45, crit_dmg_melee: 11.8, pvp_skill_dmg_melee: 0.7 },
    9: { str: 49, crit_dmg_melee: 12.8, pvp_skill_dmg_melee: 0.8, euphoria_cooldown: -30 },
    10: { str: 53, crit_dmg_melee: 14.0, pvp_skill_dmg_melee: 0.8, euphoria_cooldown: -40, atk_power_melee: 50 },
    11: { str: 60, crit_dmg_melee: 15.8, pvp_skill_dmg_melee: 0.9, euphoria_cooldown: -50, atk_power_melee: 150 },
    12: { str: 70, crit_dmg_melee: 18.5, pvp_skill_dmg_melee: 1.1, euphoria_cooldown: -60, atk_power_melee: 200 },
  },
  // Серьга ифнирского лучника
  54891: {
    2: { dex: 36 },
    3: { dex: 37 },
    4: { dex: 39 },
    5: { dex: 40, crit_dmg_ranged: 10.5 },
    6: { dex: 41, crit_dmg_ranged: 10.9 },
    7: { dex: 43, crit_dmg_ranged: 11.3 },
    8: { dex: 45, crit_dmg_ranged: 11.8, pvp_skill_dmg_ranged: 0.7 },
    9: { dex: 49, crit_dmg_ranged: 12.8, pvp_skill_dmg_ranged: 0.8, euphoria_cooldown: -30 },
    10: { dex: 53, crit_dmg_ranged: 14.0, pvp_skill_dmg_ranged: 0.8, euphoria_cooldown: -40, atk_power_ranged: 50 },
    11: { dex: 60, crit_dmg_ranged: 15.8, pvp_skill_dmg_ranged: 0.9, euphoria_cooldown: -50, atk_power_ranged: 150 },
    12: { dex: 70, crit_dmg_ranged: 18.5, pvp_skill_dmg_ranged: 1.1, euphoria_cooldown: -60, atk_power_ranged: 200 },
  },
  // Серьга ифнирского чародея
  54892: {
    2: { int: 36 },
    3: { int: 37 },
    4: { int: 39 },
    5: { int: 40, crit_dmg_spell: 10.5 },
    6: { int: 41, crit_dmg_spell: 10.9 },
    7: { int: 43, crit_dmg_spell: 11.3 },
    8: { int: 45, crit_dmg_spell: 11.8, pvp_skill_dmg_spell: 0.7 },
    9: { int: 49, crit_dmg_spell: 12.8, pvp_skill_dmg_spell: 0.8, euphoria_cooldown: -30 },
    10: { int: 53, crit_dmg_spell: 14.0, pvp_skill_dmg_spell: 0.8, euphoria_cooldown: -40, weapon_magic_power: 50 },
    11: { int: 60, crit_dmg_spell: 15.8, pvp_skill_dmg_spell: 0.9, euphoria_cooldown: -50, weapon_magic_power: 150 },
    12: { int: 70, crit_dmg_spell: 18.5, pvp_skill_dmg_spell: 1.1, euphoria_cooldown: -60, weapon_magic_power: 200 },
  },
  // Серьга ифнирского лекаря
  54893: {
    2: { spi: 36 },
    3: { spi: 37 },
    4: { spi: 39 },
    5: { spi: 40, heal_crit_effect: 10.5 },
    6: { spi: 41, heal_crit_effect: 10.9 },
    7: { spi: 43, heal_crit_effect: 11.3 },
    8: { spi: 45, heal_crit_effect: 11.8, heal_effectiveness_bonus: 6.6 },
    9: { spi: 49, heal_crit_effect: 12.8, heal_effectiveness_bonus: 7.1, euphoria_cooldown: -30 },
    10: { spi: 53, heal_crit_effect: 14.0, heal_effectiveness_bonus: 7.8, euphoria_cooldown: -40, weapon_heal_power: 50 },
    11: { spi: 60, heal_crit_effect: 15.8, heal_effectiveness_bonus: 8.8, euphoria_cooldown: -50, weapon_heal_power: 150 },
    12: { spi: 70, heal_crit_effect: 18.5, heal_effectiveness_bonus: 10.3, euphoria_cooldown: -60, weapon_heal_power: 200 },
  },
  // Драгоценная серьга ифнирского бойца
  55801: {
    7: { str: 43, crit_dmg_melee: 11.3, crit_resist_ignore: 271 },
    8: { str: 45, crit_dmg_melee: 11.8, crit_resist_ignore: 283, pvp_skill_dmg_melee: 0.7 },
    9: { str: 49, crit_dmg_melee: 12.8, crit_resist_ignore: 306, pvp_skill_dmg_melee: 0.8, euphoria_cooldown: -30 },
    10: { str: 53, crit_dmg_melee: 14.0, crit_resist_ignore: 336, pvp_skill_dmg_melee: 0.8, euphoria_cooldown: -40, atk_power_melee: 70 },
    11: { str: 60, crit_dmg_melee: 15.8, crit_resist_ignore: 380, pvp_skill_dmg_melee: 0.9, euphoria_cooldown: -50, atk_power_melee: 170 },
    12: { str: 70, crit_dmg_melee: 18.5, crit_resist_ignore: 443, pvp_skill_dmg_melee: 1.1, euphoria_cooldown: -60, atk_power_melee: 220, vuln_ignore_melee: 5.0 },
  },
  // Драгоценная серьга ифнирского лучника
  55802: {
    7: { dex: 43, crit_dmg_ranged: 11.3, crit_resist_ignore: 271 },
    8: { dex: 45, crit_dmg_ranged: 11.8, crit_resist_ignore: 283, pvp_skill_dmg_ranged: 0.7 },
    9: { dex: 49, crit_dmg_ranged: 12.8, crit_resist_ignore: 306, pvp_skill_dmg_ranged: 0.8, euphoria_cooldown: -30 },
    10: { dex: 53, crit_dmg_ranged: 14.0, crit_resist_ignore: 336, pvp_skill_dmg_ranged: 0.8, euphoria_cooldown: -40, atk_power_ranged: 70 },
    11: { dex: 60, crit_dmg_ranged: 15.8, crit_resist_ignore: 380, pvp_skill_dmg_ranged: 0.9, euphoria_cooldown: -50, atk_power_ranged: 170 },
    12: { dex: 70, crit_dmg_ranged: 18.5, crit_resist_ignore: 443, pvp_skill_dmg_ranged: 1.1, euphoria_cooldown: -60, atk_power_ranged: 220, vuln_ignore_ranged: 5.0 },
  },
  // Драгоценная серьга ифнирского чародея
  55803: {
    7: { int: 43, crit_dmg_spell: 11.3, crit_resist_ignore: 271 },
    8: { int: 45, crit_dmg_spell: 11.8, crit_resist_ignore: 283, pvp_skill_dmg_spell: 0.7 },
    9: { int: 49, crit_dmg_spell: 12.8, crit_resist_ignore: 306, pvp_skill_dmg_spell: 0.8, euphoria_cooldown: -30 },
    10: { int: 53, crit_dmg_spell: 14.0, crit_resist_ignore: 336, pvp_skill_dmg_spell: 0.8, euphoria_cooldown: -40, weapon_magic_power: 70 },
    11: { int: 60, crit_dmg_spell: 15.8, crit_resist_ignore: 380, pvp_skill_dmg_spell: 0.9, euphoria_cooldown: -50, weapon_magic_power: 170 },
    12: { int: 70, crit_dmg_spell: 18.5, crit_resist_ignore: 443, pvp_skill_dmg_spell: 1.1, euphoria_cooldown: -60, weapon_magic_power: 220, vuln_ignore_spell: 5.0 },
  },
  // Драгоценная серьга ифнирского лекаря
  55804: {
    7: { spi: 43, heal_crit_effect: 11.3, crit_resist_ignore: 303 },
    8: { spi: 45, heal_crit_effect: 11.8, crit_resist_ignore: 318, heal_effectiveness_bonus: 6.6 },
    9: { spi: 49, heal_crit_effect: 12.8, crit_resist_ignore: 343, heal_effectiveness_bonus: 7.1, euphoria_cooldown: -30 },
    10: { spi: 53, heal_crit_effect: 14.0, crit_resist_ignore: 377, heal_effectiveness_bonus: 7.8, euphoria_cooldown: -40, weapon_heal_power: 70 },
    11: { spi: 60, heal_crit_effect: 15.8, crit_resist_ignore: 425, heal_effectiveness_bonus: 8.8, euphoria_cooldown: -50, weapon_heal_power: 170 },
    12: { spi: 70, heal_crit_effect: 18.5, crit_resist_ignore: 497, heal_effectiveness_bonus: 10.3, euphoria_cooldown: -60, weapon_heal_power: 220, heal_crit_chance: 3.0 },
  },
  // Кольцо ифнирского бойца
  55320: {
    2: { str: 28 },
    3: { str: 29 },
    4: { str: 30 },
    5: { str: 31, sta: 14 },
    6: { str: 32, sta: 15 },
    7: { str: 33, sta: 16, skill_dmg_melee: 1.0 },
    8: { str: 35, sta: 16, skill_dmg_melee: 1.3, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { str: 37, sta: 17, skill_dmg_melee: 1.7, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { str: 41, sta: 19, skill_dmg_melee: 2.3, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0 },
    11: { str: 46, sta: 22, skill_dmg_melee: 3.0, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5 },
    12: { str: 54, sta: 25, skill_dmg_melee: 4.0, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5 },
  },
  // Кольцо ифнирского лучника
  55321: {
    2: { dex: 28 },
    3: { dex: 29 },
    4: { dex: 30 },
    5: { dex: 31, sta: 14 },
    6: { dex: 32, sta: 15 },
    7: { dex: 33, sta: 16, skill_dmg_ranged: 1.0 },
    8: { dex: 35, sta: 16, skill_dmg_ranged: 1.3, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { dex: 37, sta: 17, skill_dmg_ranged: 1.7, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { dex: 41, sta: 19, skill_dmg_ranged: 2.3, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0 },
    11: { dex: 46, sta: 22, skill_dmg_ranged: 3.0, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5 },
    12: { dex: 54, sta: 25, skill_dmg_ranged: 4.0, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5 },
  },
  // Кольцо ифнирского чародея
  55322: {
    2: { int: 28 },
    3: { int: 29 },
    4: { int: 30 },
    5: { int: 31, sta: 14 },
    6: { int: 32, sta: 15 },
    7: { int: 33, sta: 16, skill_dmg_spell: 1.0 },
    8: { int: 35, sta: 16, skill_dmg_spell: 1.3, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { int: 37, sta: 17, skill_dmg_spell: 1.7, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { int: 41, sta: 19, skill_dmg_spell: 2.3, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0 },
    11: { int: 46, sta: 22, skill_dmg_spell: 3.0, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5 },
    12: { int: 54, sta: 25, skill_dmg_spell: 4.0, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5 },
  },
  // Кольцо ифнирского лекаря
  55323: {
    2: { spi: 28 },
    3: { spi: 29 },
    4: { spi: 30 },
    5: { spi: 31, sta: 14 },
    6: { spi: 32, sta: 15 },
    7: { spi: 33, sta: 16, heal_skill_dmg: 1.0 },
    8: { spi: 35, sta: 16, heal_skill_dmg: 1.3, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { spi: 37, sta: 17, heal_skill_dmg: 1.7, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { spi: 41, sta: 19, heal_skill_dmg: 2.3, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0 },
    11: { spi: 46, sta: 22, heal_skill_dmg: 3.0, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5 },
    12: { spi: 54, sta: 25, heal_skill_dmg: 4.0, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5 },
  },
  // Драгоценное кольцо ифнирского бойца
  55805: {
    7: { str: 33, sta: 16, skill_dmg_melee: 1.3 },
    8: { str: 35, sta: 16, skill_dmg_melee: 1.7, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { str: 37, sta: 17, skill_dmg_melee: 2.0, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { str: 41, sta: 19, skill_dmg_melee: 2.7, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0, pvp_resist_ignore: 302 },
    11: { str: 46, sta: 22, skill_dmg_melee: 3.4, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5, pvp_resist_ignore: 341 },
    12: { str: 54, sta: 25, skill_dmg_melee: 4.2, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5, pvp_resist_ignore: 398, vuln_ignore_melee: 5.0 },
  },
  // Драгоценное кольцо ифнирского лучника
  55806: {
    7: { dex: 33, sta: 16, skill_dmg_ranged: 1.3 },
    8: { dex: 35, sta: 16, skill_dmg_ranged: 1.7, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { dex: 37, sta: 17, skill_dmg_ranged: 2.0, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { dex: 41, sta: 19, skill_dmg_ranged: 2.7, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0, pvp_resist_ignore: 302 },
    11: { dex: 46, sta: 22, skill_dmg_ranged: 3.4, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5, pvp_resist_ignore: 341 },
    12: { dex: 54, sta: 25, skill_dmg_ranged: 4.2, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5, pvp_resist_ignore: 398, vuln_ignore_ranged: 5.0 },
  },
  // Драгоценное кольцо ифнирского чародея
  55807: {
    7: { int: 33, sta: 16, skill_dmg_spell: 1.3 },
    8: { int: 35, sta: 16, skill_dmg_spell: 1.7, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { int: 37, sta: 17, skill_dmg_spell: 2.0, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { int: 41, sta: 19, skill_dmg_spell: 2.7, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0, pvp_resist_ignore: 302 },
    11: { int: 46, sta: 22, skill_dmg_spell: 3.4, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5, pvp_resist_ignore: 341 },
    12: { int: 54, sta: 25, skill_dmg_spell: 4.2, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5, pvp_resist_ignore: 398, vuln_ignore_spell: 5.0 },
  },
  // Драгоценное кольцо ифнирского лекаря
  55808: {
    7: { spi: 33, sta: 16, heal_skill_dmg: 1.3 },
    8: { spi: 35, sta: 16, heal_skill_dmg: 1.7, wearable_armor: 294, wearable_magic_resistance: 294, armor_penetration: 831, resist_ignore: 831 },
    9: { spi: 37, sta: 17, heal_skill_dmg: 2.0, wearable_armor: 318, wearable_magic_resistance: 318, armor_penetration: 898, resist_ignore: 898, euphoria_duration: 0.3 },
    10: { spi: 41, sta: 19, heal_skill_dmg: 2.7, wearable_armor: 349, wearable_magic_resistance: 349, armor_penetration: 986, resist_ignore: 986, euphoria_duration: 1.0, pvp_resist: 343 },
    11: { spi: 46, sta: 22, heal_skill_dmg: 3.4, wearable_armor: 394, wearable_magic_resistance: 394, armor_penetration: 1113, resist_ignore: 1113, euphoria_duration: 1.5, pvp_resist: 387 },
    12: { spi: 54, sta: 25, heal_skill_dmg: 4.2, wearable_armor: 460, wearable_magic_resistance: 460, armor_penetration: 1300, resist_ignore: 1300, euphoria_duration: 2.5, pvp_resist: 451, heal_crit_chance: 3.0 },
  },
};

export function getItemGradeStats(
  itemId: number,
  grade: number,
): Record<string, number> | undefined {
  return ITEM_GRADE_STATS[itemId]?.[grade];
}
