import { ENGRAVING_STAT } from "../engravingBonuses";
import { STAT_LABEL } from "../itemsData/statEffects";
import { type DerivedStats, type EquippedBonuses } from "../characterStats";

import { bonusRow, computedRow, staticRow, type RowGroup } from "./statRows";

type DefenseKind = {
  vulnerability: [label: string, key: string];
  resistIgnore: [label: string, key: string];
  fixedResist: [label: string, key: string];
  pveResist: [label: string, key: string];
};

const BASE_VULNERABILITY = 100;
const BASE_CRIT_DAMAGE_RESIST = 20;
const BASE_PVP_RESIST = 10;

export function buildDefenseGroups(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): RowGroup[] {
  return [
    {
      rows: [
        computedRow(
          "Парирование",
          stats.parry,
          "%",
          1,
          bonus.str !== 0 || bonus.parry !== 0,
        ),
        computedRow(
          "Блокирование",
          stats.block,
          "%",
          1,
          bonus.sta !== 0 || bonus.block !== 0,
        ),
        computedRow(
          "Уклонение",
          stats.dodge,
          "%",
          1,
          bonus.dex !== 0 || bonus.dodge !== 0,
        ),
        bonusRow(
          "Устойчивость к крит. урону",
          BASE_CRIT_DAMAGE_RESIST,
          "",
          0,
          ENGRAVING_STAT.CRIT_DAMAGE_RESIST,
        ),
        staticRow("Шанс получения критического урона", "-0.05%", true),
        staticRow("Размер критического урона", "-0.25%", true),
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
          BASE_PVP_RESIST,
          "",
          0,
          ENGRAVING_STAT.PVP_RESIST,
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
