"use client";
import { Swords, Shield, HeartPulse, Gem } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";

type Row = [label: string, value: string, indent?: boolean];
type RowGroup = { title?: string; rows: Row[] };

const OFFENSE_GROUPS: RowGroup[] = [
  {
    rows: [
      ["Точность ударов в ближнем бою", "0.05%"],
      ["Шанс крит. удара в ближнем бою", "1.6%"],
      ["Критический урон в ближнем бою", "150.0%"],
      ["Урон в ближнем бою со спины", "100%"],
      ["Доп урон умений ближнего боя", "100%"],
      ["Доп урон умений ближнего боя в PVE", "100%"],
      ["Доп урон умений ближнего боя в PVP", "100%"],
    ],
  },
  {
    rows: [
      ["Точность ударов в дальнем бою", "0.05%"],
      ["Шанс крит. удара в дальнем бою", "1.6%"],
      ["Критический урон в дальнем бою", "150.0%"],
      ["Урон в дальнем бою со спины", "100%"],
      ["Доп урон умений дальнего боя", "100%"],
      ["Доп урон умений дальнего боя в PVE", "100%"],
      ["Доп урон умений дальнего боя в PVP", "100%"],
    ],
  },
  {
    rows: [
      ["Точность заклинаний", "0.05%"],
      ["Шанс крит. удара заклинанием", "1.6%"],
      ["Критический урон заклинаний", "150.0%"],
      ["Урон заклинаниями со спины", "100%"],
      ["Доп урон умений заклинателя", "100%"],
      ["Доп урон умений заклинателя в PVE", "100%"],
      ["Доп урон умений заклинателя в PVP", "100%"],
    ],
  },
  {
    rows: [
      ["Тактическая подготовка", "597"],
      ["Шанс обхода обороны", "0%"],
      ["Пробивание брони", "0"],
      ["Игнорирование сопротивления", "0"],
    ],
  },
];

const DEFENSE_GROUPS: RowGroup[] = [
  {
    rows: [
      ["Парирование", "10.3%"],
      ["Блокирование", "0%"],
      ["Уклонение", "5.1%"],
      ["Устойчивость к крит. урону", "20"],
      ["Шанс получения критического урона", "-0.05%", true],
      ["Размер критического урона", "-0.25%", true],
      ["Игнор устойчивости к крит. урону", "0", true],
      ["Устойчивость к атакам в PVP", "10 (0.12%)"],
      ["Игнор устойчивости к атакам в PVP", "0"],
      ["Уязвимость к осадному урону", "0.05%"],
      ["Игнор устойчивости к осадному урону", "0%"],
      ["Уязвимость при сражении с монстрами", "0%"],
    ],
  },
  {
    rows: [
      ["Уязвимость к атакам ближнего боя", "0.05%"],
      ["Игнор устойчивости к атакам ближнего боя", "0%"],
      ["Показатель устойчивости в ближнем бою", "0"],
      ["Устойчивость к атакам монстров в ближнем бою", "0%"],
    ],
  },
  {
    rows: [
      ["Уязвимость к атакам дальнего боя", "0.05%"],
      ["Игнор устойчивости к атакам дальнего боя", "0%"],
      ["Показатель устойчивости в дальнем бою", "0"],
      ["Устойчивость к атакам монстров в дальнем бою", "0%"],
    ],
  },
  {
    rows: [
      ["Уязвимость к заклинаниям", "0.05%"],
      ["Игнор устойчивости к заклинаниям", "0%"],
      ["Показатель устойчивости к заклинаниям", "0"],
      ["Устойчивость к атакам монстров заклинаниями", "0%"],
    ],
  },
];

const HEAL_GROUPS: RowGroup[] = [
  {
    title: "Исцеление",
    rows: [
      ["Шанс критического эффекта исцеления", "1.6%"],
      ["Критический эффект исцеления", "50%"],
      ["Доп. эффективность умений целителя", "0%"],
      ["Урон исцеляющими умениями", "0%", true],
      ["Доп. эффективность исцеления", "0%", true],
      ["Урон исцеляющими умениями в PvE", "0%", true],
    ],
  },
  {
    title: "Восстановление",
    rows: [
      ["Восстановление здоровья", "0"],
      ["Восстановление здоровья в бою", "0"],
      ["Восстановление маны", "0"],
      ["Восстановление маны в бою", "0"],
    ],
  },
  {
    title: "Прочее",
    rows: [
      ["Восприимчивость к исцелению", "0%"],
      ["Дополнительный опыт", "100%"],
      ["Дополнительный шанс получения трофеев", "100%"],
      ["Дополнительный шанс получения монет", "100%"],
      ["Дальность обнаружения скрытых существ", "0%"],
    ],
  },
];

const GEAR_GROUPS: RowGroup[] = [
  {
    title: "Доп. урон оружия",
    rows: [
      ["Оружие для правой руки", "5000"],
      ["Оружие для левой руки", "0"],
      ["Оружие дальнего боя", "5000"],
    ],
  },
  {
    title: "Защита от доп. урона оружия",
    rows: [
      ["Доспехи", "Лёгкие"],
      ["Колющий урон", "5000"],
      ["Режущий урон", "5000"],
      ["Маг урон", "5000"],
      ["Рубящий урон", "5000"],
      ["Дробящий урон", "5000"],
    ],
  },
];

function RowLine({ label, value, indent }: { label: string; value: string; indent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span
        className={indent ? "pl-3 text-muted-foreground/70" : "text-muted-foreground"}
      >
        {indent ? `- ${label}` : label}
      </span>
      <span className="whitespace-nowrap font-medium tabular-nums">{value}</span>
    </div>
  );
}

// withHeaders=false (Атака/Защита) — группы разделены линией без заголовка.
// withHeaders=true (Исцеление/Снаряжение) — у каждой группы жирный заголовок.
function GroupedRows({
  groups,
  withHeaders,
}: {
  groups: RowGroup[];
  withHeaders: boolean;
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
            {group.rows.map(([label, value, indent]) => (
              <RowLine key={label} label={label} value={value} indent={indent} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailedStatsPanel() {
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
            <GroupedRows groups={OFFENSE_GROUPS} withHeaders={false} />
          </TabsContent>
          <TabsContent value="defense">
            <GroupedRows groups={DEFENSE_GROUPS} withHeaders={false} />
          </TabsContent>
          <TabsContent value="heal">
            <GroupedRows groups={HEAL_GROUPS} withHeaders={true} />
          </TabsContent>
          <TabsContent value="gear">
            <GroupedRows groups={GEAR_GROUPS} withHeaders={true} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
