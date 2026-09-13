"use client";
import { Swords, Shield, HeartPulse, Gem } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { computeEngravingBonuses, ENGRAVING_STAT } from "./engravingBonuses";
import {
  computeEquippedBonuses,
  computeDerivedStats,
  type DerivedStats,
  type EquippedBonuses,
} from "./characterStats";
import { BONUS_COLOR } from "./CharacterStatsPanel";

type StaticRow = { kind: "static"; label: string; value: string; indent?: boolean };
type EngravingRow = {
  kind: "engraving";
  label: string;
  base: number;
  unit: string;
  decimals: number;
  engravingKey: string;
  indent?: boolean;
};
type ComputedRow = {
  kind: "computed";
  label: string;
  value: number;
  unit: string;
  decimals: number;
  boosted: boolean;
  indent?: boolean;
};
type Row = StaticRow | EngravingRow | ComputedRow;
type RowGroup = { title?: string; rows: Row[] };

function staticRow(label: string, value: string, indent?: boolean): StaticRow {
  return { kind: "static", label, value, indent };
}

function engravingRow(
  label: string,
  base: number,
  unit: string,
  decimals: number,
  engravingKey: string,
  indent?: boolean,
): EngravingRow {
  return { kind: "engraving", label, base, unit, decimals, engravingKey, indent };
}

function computedRow(
  label: string,
  value: number,
  unit: string,
  decimals: number,
  boosted: boolean,
  indent?: boolean,
): ComputedRow {
  return { kind: "computed", label, value, unit, decimals, boosted, indent };
}

function buildOffenseGroups(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): RowGroup[] {
  return [
    {
      rows: [
        staticRow("Точность ударов в ближнем бою", "0.05%"),
        computedRow(
          "Шанс крит. удара в ближнем бою",
          stats.critChanceMelee,
          "%",
          2,
          bonus.str !== 0,
        ),
        engravingRow(
          "Критический урон в ближнем бою",
          150.0,
          "%",
          1,
          ENGRAVING_STAT.MELEE_CRIT_DAMAGE,
        ),
        staticRow("Урон в ближнем бою со спины", "100%"),
        staticRow("Доп урон умений ближнего боя", "100%"),
        engravingRow(
          "Доп урон умений ближнего боя в PVE",
          100,
          "%",
          1,
          ENGRAVING_STAT.MELEE_SKILL_DMG_PVE,
        ),
        engravingRow(
          "Доп урон умений ближнего боя в PVP",
          100,
          "%",
          1,
          ENGRAVING_STAT.MELEE_SKILL_DMG_PVP,
        ),
      ],
    },
    {
      rows: [
        staticRow("Точность ударов в дальнем бою", "0.05%"),
        computedRow(
          "Шанс крит. удара в дальнем бою",
          stats.critChanceRanged,
          "%",
          2,
          bonus.dex !== 0,
        ),
        engravingRow(
          "Критический урон в дальнем бою",
          150.0,
          "%",
          1,
          ENGRAVING_STAT.RANGED_CRIT_DAMAGE,
        ),
        staticRow("Урон в дальнем бою со спины", "100%"),
        staticRow("Доп урон умений дальнего боя", "100%"),
        engravingRow(
          "Доп урон умений дальнего боя в PVE",
          100,
          "%",
          1,
          ENGRAVING_STAT.RANGED_SKILL_DMG_PVE,
        ),
        engravingRow(
          "Доп урон умений дальнего боя в PVP",
          100,
          "%",
          1,
          ENGRAVING_STAT.RANGED_SKILL_DMG_PVP,
        ),
      ],
    },
    {
      rows: [
        staticRow("Точность заклинаний", "0.05%"),
        computedRow(
          "Шанс крит. удара заклинанием",
          stats.critChanceSpell,
          "%",
          2,
          bonus.int !== 0,
        ),
        engravingRow(
          "Критический урон заклинаний",
          150.0,
          "%",
          1,
          ENGRAVING_STAT.SPELL_CRIT_DAMAGE,
        ),
        staticRow("Урон заклинаниями со спины", "100%"),
        staticRow("Доп урон умений заклинателя", "100%"),
        engravingRow(
          "Доп урон умений заклинателя в PVE",
          100,
          "%",
          1,
          ENGRAVING_STAT.SPELL_SKILL_DMG_PVE,
        ),
        engravingRow(
          "Доп урон умений заклинателя в PVP",
          100,
          "%",
          1,
          ENGRAVING_STAT.SPELL_SKILL_DMG_PVP,
        ),
      ],
    },
    {
      rows: [
        computedRow(
          "Тактическая подготовка",
          stats.tacticalReadiness,
          "",
          0,
          bonus.str !== 0 || bonus.dex !== 0 || bonus.tacticalReadiness !== 0,
        ),
        staticRow("Шанс обхода обороны", "0%"),
        engravingRow(
          "Пробивание брони",
          0,
          "",
          0,
          ENGRAVING_STAT.ARMOR_PENETRATION,
        ),
        engravingRow(
          "Игнорирование сопротивления",
          0,
          "",
          0,
          ENGRAVING_STAT.RESIST_IGNORE,
        ),
      ],
    },
  ];
}

function buildDefenseGroups(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): RowGroup[] {
  return [
    {
      rows: [
        computedRow("Парирование", stats.parry, "%", 2, bonus.str !== 0 || bonus.parry !== 0),
        computedRow("Блокирование", stats.block, "%", 2, bonus.sta !== 0 || bonus.block !== 0),
        computedRow("Уклонение", stats.dodge, "%", 2, bonus.dex !== 0 || bonus.dodge !== 0),
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

function buildHealGroups(stats: DerivedStats, bonus: EquippedBonuses): RowGroup[] {
  return [
    {
      title: "Исцеление",
      rows: [
        computedRow(
          "Шанс критического эффекта исцеления",
          stats.critChanceHeal,
          "%",
          2,
          bonus.spi !== 0,
        ),
        engravingRow(
          "Критический эффект исцеления",
          50,
          "%",
          0,
          ENGRAVING_STAT.HEAL_CRIT_EFFECT,
        ),
        staticRow("Доп. эффективность умений целителя", "0%"),
        staticRow("Урон исцеляющими умениями", "0%", true),
        engravingRow(
          "Доп. эффективность исцеления",
          0,
          "%",
          1,
          ENGRAVING_STAT.HEAL_EFFECTIVENESS_BONUS,
          true,
        ),
        staticRow("Урон исцеляющими умениями в PvE", "0%", true),
      ],
    },
    {
      title: "Восстановление",
      rows: [
        computedRow("Восстановление здоровья", stats.healthRegen, "", 0, bonus.sta !== 0),
        staticRow("Восстановление здоровья в бою", "0"),
        computedRow("Восстановление маны", stats.manaRegen, "", 0, bonus.spi !== 0),
        staticRow("Восстановление маны в бою", "0"),
      ],
    },
    {
      title: "Прочее",
      rows: [
        engravingRow(
          "Восприимчивость к исцелению",
          0,
          "%",
          1,
          ENGRAVING_STAT.HEAL_RECEIVED,
        ),
        staticRow("Дополнительный опыт", "100%"),
        staticRow("Дополнительный шанс получения трофеев", "100%"),
        staticRow("Дополнительный шанс получения монет", "100%"),
        staticRow("Дальность обнаружения скрытых существ", "0%"),
      ],
    },
  ];
}

const GEAR_GROUPS: RowGroup[] = [
  {
    title: "Доп. урон оружия",
    rows: [
      staticRow("Оружие для правой руки", "5000"),
      staticRow("Оружие для левой руки", "0"),
      staticRow("Оружие дальнего боя", "5000"),
    ],
  },
  {
    title: "Защита от доп. урона оружия",
    rows: [
      staticRow("Доспехи", "Лёгкие"),
      staticRow("Колющий урон", "5000"),
      staticRow("Режущий урон", "5000"),
      staticRow("Маг урон", "5000"),
      staticRow("Рубящий урон", "5000"),
      staticRow("Дробящий урон", "5000"),
    ],
  },
];

function RowLine({
  row,
  engravingBonuses,
}: {
  row: Row;
  engravingBonuses: Map<string, number>;
}) {
  let boosted = false;
  let value: string;

  if (row.kind === "static") {
    value = row.value;
  } else if (row.kind === "engraving") {
    const delta = engravingBonuses.get(row.engravingKey) ?? 0;
    boosted = delta !== 0;
    value = `${(row.base + delta).toFixed(row.decimals)}${row.unit}`;
  } else {
    boosted = row.boosted;
    value = `${row.value.toFixed(row.decimals)}${row.unit}`;
  }

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span
        className={row.indent ? "pl-3 text-muted-foreground/70" : "text-muted-foreground"}
      >
        {row.indent ? `- ${row.label}` : row.label}
      </span>
      <span
        className="whitespace-nowrap font-medium tabular-nums"
        style={{ color: boosted ? BONUS_COLOR : undefined }}
      >
        {value}
      </span>
    </div>
  );
}

// withHeaders=false (Атака/Защита) — группы разделены линией без заголовка.
// withHeaders=true (Исцеление/Снаряжение) — у каждой группы жирный заголовок.
function GroupedRows({
  groups,
  withHeaders,
  engravingBonuses,
}: {
  groups: RowGroup[];
  withHeaders: boolean;
  engravingBonuses: Map<string, number>;
}) {
  return (
    <div className="space-y-3">
      {groups.map((group, i) => (
        <div key={i}>
          {i > 0 && <div className="mb-3 border-t" />}
          {withHeaders && group.title && (
            <div className="mb-1.5 text-sm font-semibold">{group.title}</div>
          )}
          <div className="space-y-1.5">
            {group.rows.map((row) => (
              <RowLine key={row.label} row={row} engravingBonuses={engravingBonuses} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailedStatsPanel({
  equipment,
  level,
}: {
  equipment: UserEquipment[];
  level: number;
}) {
  const engravingBonuses = computeEngravingBonuses(equipment);
  const bonus = computeEquippedBonuses(equipment);
  const stats = computeDerivedStats(bonus, level);

  const offenseGroups = buildOffenseGroups(stats, bonus);
  const defenseGroups = buildDefenseGroups(stats, bonus);
  const healGroups = buildHealGroups(stats, bonus);

  return (
    <div className="w-full shrink-0 rounded-xl border bg-muted/40 p-3 lg:w-96">
      <Tabs defaultValue="offense">
        <TabsList className="mb-3 grid w-full grid-cols-4">
          <TabsTrigger value="offense" className="cursor-pointer" title="Атака">
            <Swords className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="defense" className="cursor-pointer" title="Защита">
            <Shield className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="heal" className="cursor-pointer" title="Исцеление">
            <HeartPulse className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="gear" className="cursor-pointer" title="Снаряжение">
            <Gem className="size-4" />
          </TabsTrigger>
        </TabsList>

        <div className="h-[640px] overflow-y-auto pr-1">
          <TabsContent value="offense">
            <GroupedRows
              groups={offenseGroups}
              withHeaders={false}
              engravingBonuses={engravingBonuses}
            />
          </TabsContent>
          <TabsContent value="defense">
            <GroupedRows
              groups={defenseGroups}
              withHeaders={false}
              engravingBonuses={engravingBonuses}
            />
          </TabsContent>
          <TabsContent value="heal">
            <GroupedRows
              groups={healGroups}
              withHeaders={true}
              engravingBonuses={engravingBonuses}
            />
          </TabsContent>
          <TabsContent value="gear">
            <GroupedRows
              groups={GEAR_GROUPS}
              withHeaders={true}
              engravingBonuses={engravingBonuses}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
