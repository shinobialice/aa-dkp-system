import type { UserEquipment } from "@/actions/getUserEquipment";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import { getSkillsForSpecialization } from "@/widgets/profile/archetype/skills";
import { ENGRAVING_STAT } from "./engravingBonuses";
import { addStat, STAT_LABEL, type StatBonuses } from "./itemsData/statEffects";
import { getActiveWeaponBuff, type WeaponBuff } from "./weaponBuffs";

type StatLine = [label: string, value: number];

type PassiveEffect = {
  stats?: StatLine[];
  defensePercent?: number;
  resistPercent?: number;
  manaPercent?: number;
};

type WeaponKey = WeaponBuff["key"] | undefined;

export type PassiveBonuses = {
  stats: StatBonuses;
  defensePercent: number;
  resistPercent: number;
  manaPercent: number;
};

// Пассивки ветки открываются по числу взятых в ней активных умений:
// первая — с 3-го, шестая — с 8-го (passive_buffs.req_points в данных игры).
const FIRST_PASSIVE_UNLOCK = 3;

const ALL_ACCURACY = [
  STAT_LABEL.MELEE_ACCURACY,
  STAT_LABEL.RANGED_ACCURACY,
  STAT_LABEL.SPELL_ACCURACY,
];

const PASSIVE_EFFECTS: Record<
  string,
  PassiveEffect | ((weapon: WeaponKey) => PassiveEffect)
> = {
  74: { stats: [[ENGRAVING_STAT.HEAL_CRIT_EFFECT, 20]] }, // Мастерство целителя
  75: { stats: [[STAT_LABEL.COMBAT_MANA_REGEN, 5]] }, // Чистое сердце
  18: { stats: [[ENGRAVING_STAT.MELEE_CRIT_CHANCE, 6]] }, // Закаленная сталь
  89: {
    stats: [
      [ENGRAVING_STAT.SKILL_SPEED, -2],
      [ENGRAVING_STAT.PROFICIENCY, 40],
    ],
  }, // Ясность мысли
  207: { stats: [[ENGRAVING_STAT.SPELL_CRIT_DAMAGE, 10]] }, // Гнев Шаеды
  51: { stats: [[ENGRAVING_STAT.MOVE_SPEED, 8]] }, // Инстинкт хищника
  56: { stats: [[ENGRAVING_STAT.RANGED_CRIT_CHANCE, 9]] }, // Хладнокровие преследователя
  108: { stats: [[ENGRAVING_STAT.PROFICIENCY, 40]] }, // Шквал клинков
  109: { stats: [[ENGRAVING_STAT.DODGE, 5]] }, // Акробатические трюки
  225: (weapon) =>
    weapon === "dual_wield"
      ? { stats: [[ENGRAVING_STAT.MELEE_CRIT_CHANCE, 16]] }
      : {}, // Прирожденный убийца
  32: { manaPercent: 35 }, // Путь магии
  37: { stats: [[ENGRAVING_STAT.SPELL_CRIT_CHANCE, 6]] }, // Пламенное сердце
  129: { defensePercent: 6 }, // Несгибаемый защитник
  132: { stats: ALL_ACCURACY.map((label) => [label, 5]) }, // Верный щит
  258: { stats: [[ENGRAVING_STAT.HEAL_RECEIVED, 15]] }, // Открытая душа
  151: { stats: ALL_ACCURACY.map((label) => [label, 5]) }, // Торжество воли
  165: {
    stats: [
      [ENGRAVING_STAT.SKILL_SPEED, -4],
      [ENGRAVING_STAT.PROFICIENCY, 20],
    ],
  }, // Сжатие времени
  238: (weapon) => ({ resistPercent: weapon === "shield" ? 2 : 5 }), // Твердый разум
  242: { stats: [[ENGRAVING_STAT.DODGE, 3]] }, // Пиратская удача
};

export function computePassiveBonuses(
  build: RoleSkillBuild,
  equipment: UserEquipment[],
): PassiveBonuses {
  const result: PassiveBonuses = {
    stats: new Map(),
    defensePercent: 0,
    resistPercent: 0,
    manaPercent: 0,
  };
  const weapon = getActiveWeaponBuff(equipment)?.key;

  for (const passiveId of unlockedPassiveIds(build)) {
    const entry = PASSIVE_EFFECTS[passiveId];
    if (!entry) continue;
    const effect = typeof entry === "function" ? entry(weapon) : entry;
    for (const [label, value] of effect.stats ?? []) {
      addStat(result.stats, label, value);
    }
    result.defensePercent += effect.defensePercent ?? 0;
    result.resistPercent += effect.resistPercent ?? 0;
    result.manaPercent += effect.manaPercent ?? 0;
  }
  return result;
}

function unlockedPassiveIds(build: RoleSkillBuild): string[] {
  return Object.entries(build).flatMap(([specializationId, spec]) => {
    const skills = getSkillsForSpecialization(specializationId);
    const activeCount = skills.filter(
      (skill) => skill.kind === "active" && spec.selected.includes(skill.id),
    ).length;
    const unlockedCount = Math.max(0, activeCount - FIRST_PASSIVE_UNLOCK + 1);
    return skills
      .filter((skill) => skill.kind === "passive")
      .slice(0, unlockedCount)
      .map((skill) => skill.id);
  });
}
