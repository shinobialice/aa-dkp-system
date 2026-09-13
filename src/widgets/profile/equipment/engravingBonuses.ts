import type { UserEquipment } from "@/actions/getUserEquipment";
import { findEngraving } from "./itemsData/engravings";

export const ENGRAVING_STAT = {
  DEFENSE: "Защита",
  RESIST: "Сопротивление",
  HEALTH: "Здоровье",
  MELEE_ATTACK: "Сила атаки в ближнем бою",
  RANGED_ATTACK: "Сила атаки в дальнем бою",
  SPELL_POWER: "Сила заклинаний",
  HEAL_POWER: "Эффективность исцеления",
  MOVE_SPEED: "Скорость передвижения",
  SKILL_SPEED: "Время применения умений",
  PROFICIENCY: "Сноровка",
  MELEE_CRIT_CHANCE: "Шанс критического удара в ближнем бою",
  RANGED_CRIT_CHANCE: "Шанс критического удара в дальнем бою",
  SPELL_CRIT_CHANCE: "Шанс критического удара заклинанием",
  MELEE_CRIT_DAMAGE: "Критический урон в ближнем бою",
  RANGED_CRIT_DAMAGE: "Критический урон в дальнем бою",
  SPELL_CRIT_DAMAGE: "Критический урон заклинаний",
  TACTICAL_READINESS: "Тактическая подготовка",
  ARMOR_PENETRATION: "Пробивание брони",
  RESIST_IGNORE: "Игнорирование сопротивления",
  MELEE_SKILL_DMG_PVE: "Дополнительный урон умений в ближнем бою в PvE",
  MELEE_SKILL_DMG_PVP: "Дополнительный урон умений в ближнем бою в PvP",
  RANGED_SKILL_DMG_PVE: "Дополнительный урон умений в дальнем бою в PvE",
  RANGED_SKILL_DMG_PVP: "Дополнительный урон умений в дальнем бою в PvP",
  SPELL_SKILL_DMG_PVE: "Дополнительный урон умений заклинаниями в PvE",
  SPELL_SKILL_DMG_PVP: "Дополнительный урон умений заклинаниями в PvP",
  PARRY: "Парирование атак ближнего боя",
  BLOCK: "Блокирование",
  DODGE: "Уклонение",
  CRIT_DAMAGE_RESIST: "Устойчивость к критическому урону",
  PVP_RESIST: "Устойчивость к атакам в PvP",
  MELEE_VULN: "Уязвимость к атакам ближнего боя",
  RANGED_VULN: "Уязвимость к атакам дальнего боя",
  SPELL_VULN: "Уязвимость к заклинаниям",
  HEAL_CRIT_CHANCE: "Шанс критического эффекта исцеления",
  HEAL_CRIT_EFFECT: "Критический эффект исцеления",
  HEAL_RECEIVED: "Восприимчивость к исцелению",
  HEAL_EFFECTIVENESS_BONUS: "Дополнительная эффективность исцеления",
} as const;

const EFFECT_LINE_PATTERN = /^(.+?):\s*([+-]?\d+(?:\.\d+)?)%?$/;

export function parseEngravingEffect(
  effect: string,
): { label: string; value: number } | null {
  const m = effect.match(EFFECT_LINE_PATTERN);
  if (!m) return null;
  return { label: m[1].trim(), value: Number(m[2]) };
}

export function computeEngravingBonuses(
  equipment: UserEquipment[],
): Map<string, number> {
  const totals = new Map<string, number>();

  for (const eq of equipment) {
    for (const id of eq.engravings ?? []) {
      if (!id) continue;
      const engraving = findEngraving(id);
      if (!engraving?.effect) continue;
      const parsed = parseEngravingEffect(engraving.effect);
      if (!parsed) continue;
      totals.set(parsed.label, (totals.get(parsed.label) ?? 0) + parsed.value);
    }
  }

  return totals;
}
