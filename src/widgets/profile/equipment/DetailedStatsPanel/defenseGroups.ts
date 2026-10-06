import { ENGRAVING_STAT } from "../engravingBonuses";
import { STAT_LABEL } from "../itemsData/statEffects";
import type { DerivedStats } from "../characterStats";

import { bonusRow, computedRow, type RowGroup } from "./statRows";

type DefenseKind = {
  vulnerability: [label: string, key: string];
  resistIgnore: [label: string, key: string];
  fixedResist: [label: string, key: string];
  pveResist: [label: string, key: string];
};

const BASE_VULNERABILITY = 100;

// По замерам в игре: защита 158 → 1.96%, 808 → 9.28%, 1996 → 20.17%,
// сопротивление 4017 → 33.71%.
const DAMAGE_REDUCTION_CONSTANT = 7900;
// Из данных игры для устойчивости к PvP: устойчивость / (устойчивость + 8000).
const RESIST_REDUCTION_CONSTANT = 8000;
// Устойчивость к крит. урону снижает шанс и размер крита линейно, без потолка:
// при 20 ед. это −0.05% и −0.25%, как в игре.
const CRIT_CHANCE_TAKEN_PER_POINT = 0.00275;
const CRIT_DAMAGE_TAKEN_PER_POINT = 0.0125;

export function buildDefenseGroups(stats: DerivedStats): RowGroup[] {
  return [
    {
      rows: [
        computedRow(
          "Снижение урона в ближнем и дальнем бою",
          reductionPercent(stats.defense, DAMAGE_REDUCTION_CONSTANT),
          "%",
          1,
        ),
        computedRow(
          "Снижение урона от заклинаний",
          reductionPercent(stats.resist, DAMAGE_REDUCTION_CONSTANT),
          "%",
          1,
        ),
      ],
    },
    {
      rows: [
        computedRow("Парирование", stats.parry, "%", 1),
        computedRow("Блокирование", stats.block, "%", 1),
        computedRow("Уклонение", stats.dodge, "%", 1),
        bonusRow(
          "Устойчивость к крит. урону",
          0,
          "",
          0,
          ENGRAVING_STAT.CRIT_DAMAGE_RESIST,
        ),
        computedRow(
          "Шанс получения критического урона",
          -stats.critDamageResist * CRIT_CHANCE_TAKEN_PER_POINT,
          "%",
          2,
          true,
        ),
        computedRow(
          "Размер критического урона",
          -stats.critDamageResist * CRIT_DAMAGE_TAKEN_PER_POINT,
          "%",
          2,
          true,
        ),
        bonusRow(
          "Игнор устойчивости к крит. урону",
          0,
          "",
          0,
          STAT_LABEL.CRIT_RESIST_IGNORE,
          true,
        ),
        bonusRow(
          "Устойчивость к атакам в PVP",
          0,
          "",
          0,
          ENGRAVING_STAT.PVP_RESIST,
        ),
        computedRow(
          "Снижение урона в PvP",
          reductionPercent(stats.pvpResist, RESIST_REDUCTION_CONSTANT),
          "%",
          1,
          true,
        ),
        bonusRow(
          "Игнор устойчивости к атакам в PVP",
          0,
          "",
          0,
          STAT_LABEL.PVP_RESIST_IGNORE,
        ),
        bonusRow(
          "Уязвимость к осадному урону",
          BASE_VULNERABILITY,
          "%",
          1,
          STAT_LABEL.SIEGE_VULN,
        ),
        bonusRow(
          "Игнор устойчивости к осадному урону",
          0,
          "%",
          1,
          STAT_LABEL.SIEGE_RESIST_IGNORE,
        ),
        bonusRow(
          "Уязвимость при сражении с монстрами",
          BASE_VULNERABILITY,
          "%",
          1,
          STAT_LABEL.PVE_VULN,
        ),
      ],
    },
    defenseGroup({
      vulnerability: [
        "Уязвимость к атакам ближнего боя",
        ENGRAVING_STAT.MELEE_VULN,
      ],
      resistIgnore: [
        "Игнор устойчивости к атакам ближнего боя",
        STAT_LABEL.MELEE_RESIST_IGNORE,
      ],
      fixedResist: [
        "Показатель устойчивости в ближнем бою",
        STAT_LABEL.MELEE_FIXED_RESIST,
      ],
      pveResist: [
        "Устойчивость к атакам монстров в ближнем бою",
        STAT_LABEL.MELEE_PVE_RESIST,
      ],
    }),
    defenseGroup({
      vulnerability: [
        "Уязвимость к атакам дальнего боя",
        ENGRAVING_STAT.RANGED_VULN,
      ],
      resistIgnore: [
        "Игнор устойчивости к атакам дальнего боя",
        STAT_LABEL.RANGED_RESIST_IGNORE,
      ],
      fixedResist: [
        "Показатель устойчивости в дальнем бою",
        STAT_LABEL.RANGED_FIXED_RESIST,
      ],
      pveResist: [
        "Устойчивость к атакам монстров в дальнем бою",
        STAT_LABEL.RANGED_PVE_RESIST,
      ],
    }),
    defenseGroup({
      vulnerability: ["Уязвимость к заклинаниям", ENGRAVING_STAT.SPELL_VULN],
      resistIgnore: [
        "Игнор устойчивости к заклинаниям",
        STAT_LABEL.SPELL_RESIST_IGNORE,
      ],
      fixedResist: [
        "Показатель устойчивости к заклинаниям",
        STAT_LABEL.SPELL_FIXED_RESIST,
      ],
      pveResist: [
        "Устойчивость к атакам монстров заклинаниями",
        STAT_LABEL.SPELL_PVE_RESIST,
      ],
    }),
  ];
}

function defenseGroup(kind: DefenseKind): RowGroup {
  return {
    rows: [
      bonusRow(
        kind.vulnerability[0],
        BASE_VULNERABILITY,
        "%",
        1,
        kind.vulnerability[1],
      ),
      bonusRow(kind.resistIgnore[0], 0, "%", 1, kind.resistIgnore[1]),
      bonusRow(kind.fixedResist[0], 0, "", 0, kind.fixedResist[1]),
      bonusRow(kind.pveResist[0], 0, "", 0, kind.pveResist[1]),
    ],
  };
}

function reductionPercent(value: number, constant: number): number {
  return (value / (value + constant)) * 100;
}
