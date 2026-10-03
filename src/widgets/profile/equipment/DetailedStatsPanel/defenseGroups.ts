import { ENGRAVING_STAT } from "../engravingBonuses";
import { type DerivedStats, type EquippedBonuses } from "../characterStats";

import {
  computedRow,
  engravingRow,
  staticRow,
  type RowGroup,
} from "./statRows";

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
          2,
          bonus.str !== 0 || bonus.parry !== 0,
        ),
        computedRow(
          "Блокирование",
          stats.block,
          "%",
          2,
          bonus.sta !== 0 || bonus.block !== 0,
        ),
        computedRow(
          "Уклонение",
          stats.dodge,
          "%",
          2,
          bonus.dex !== 0 || bonus.dodge !== 0,
        ),
        engravingRow(
          "Устойчивость к крит. урону",
          20,
          "",
          0,
          ENGRAVING_STAT.CRIT_DAMAGE_RESIST,
        ),
        staticRow("Шанс получения критического урона", "-0.05%", true),
        staticRow("Размер критического урона", "-0.25%", true),
        staticRow("Игнор устойчивости к крит. урону", "0", true),
        staticRow("Устойчивость к атакам в PVP", "10 (0.12%)"),
        staticRow("Игнор устойчивости к атакам в PVP", "0"),
        staticRow("Уязвимость к осадному урону", "0.05%"),
        staticRow("Игнор устойчивости к осадному урону", "0%"),
        staticRow("Уязвимость при сражении с монстрами", "0%"),
      ],
    },
    {
      rows: [
        engravingRow(
          "Уязвимость к атакам ближнего боя",
          0.05,
          "%",
          2,
          ENGRAVING_STAT.MELEE_VULN,
        ),
        staticRow("Игнор устойчивости к атакам ближнего боя", "0%"),
        staticRow("Показатель устойчивости в ближнем бою", "0"),
        staticRow("Устойчивость к атакам монстров в ближнем бою", "0%"),
      ],
    },
    {
      rows: [
        engravingRow(
          "Уязвимость к атакам дальнего боя",
          0.05,
          "%",
          2,
          ENGRAVING_STAT.RANGED_VULN,
        ),
        staticRow("Игнор устойчивости к атакам дальнего боя", "0%"),
        staticRow("Показатель устойчивости в дальнем бою", "0"),
        staticRow("Устойчивость к атакам монстров в дальнем бою", "0%"),
      ],
    },
    {
      rows: [
        engravingRow(
          "Уязвимость к заклинаниям",
          0.05,
          "%",
          2,
          ENGRAVING_STAT.SPELL_VULN,
        ),
        staticRow("Игнор устойчивости к заклинаниям", "0%"),
        staticRow("Показатель устойчивости к заклинаниям", "0"),
        staticRow("Устойчивость к атакам монстров заклинаниями", "0%"),
      ],
    },
  ];
}
