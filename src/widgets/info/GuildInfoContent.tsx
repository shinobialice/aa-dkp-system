import { CircleCheck, CircleX } from "lucide-react";
import type { SalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import type { getBosses } from "@/actions/getBosses";
import type { GuildMode } from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import GuildRules from "./GuildRules";

type Boss = Awaited<ReturnType<typeof getBosses>>[number];

const MODE_CHIP: Record<
  GuildMode,
  { label: string; className: string; dot: string }
> = {
  pvp: {
    label: "Сейчас ПВП",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-600",
  },
  freeshard: {
    label: "Сейчас фришка",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400",
    dot: "bg-green-600",
  },
};

function CriteriaCard({ settings }: { settings: SalaryEligibilitySettings }) {
  const rows = [
    {
      label: "Посещение праймов",
      hint: `больше ${settings.primeThresholdPercent}%`,
      enabled: settings.primeEnabled,
    },
    {
      label: "Процент баллов",
      hint: `больше ${settings.pointsThresholdPercent}%`,
      enabled: settings.pointsEnabled,
    },
    {
      label: "Тег ДВ",
      hint: "обходит оба порога выше",
      enabled: settings.dvBypassEnabled,
    },
    {
      label: "Проходной ГС",
      hint: "по формуле из п. 1.2",
      enabled: settings.gsEnabled,
    },
  ];

  return (
    <section
      id="criteria"
      aria-label="Допуск к зарплате"
      className="flex scroll-mt-6 flex-col rounded-xl border bg-card"
    >
      <div className="px-4 pt-4 pb-2.5 sm:px-4.5">
        <h2 className="text-base font-semibold">Допуск к зарплате</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Действует сейчас · критерии меняет глава гильдии
        </p>
      </div>
      <ul className="flex-1 px-1 sm:px-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid min-h-14 grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-3 border-t border-border/60 px-2.5 py-1.5"
          >
            {row.enabled ? (
              <CircleCheck className="size-5 text-green-600 dark:text-green-500" />
            ) : (
              <CircleX className="size-5 text-muted-foreground/60" />
            )}
            <div className="min-w-0">
              <div
                className={cn(
                  "font-semibold",
                  !row.enabled && "text-muted-foreground",
                )}
              >
                {row.label}
              </div>
              <div className="text-xs text-muted-foreground">{row.hint}</div>
            </div>
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold",
                row.enabled
                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {row.enabled ? "Включено" : "Выключено"}
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-border/60 px-4 pt-2.5 pb-3.5 text-xs text-muted-foreground sm:px-4.5">
        Тег ДВ обходит пороги посещения и баллов, но не проверку ГС
      </p>
    </section>
  );
}

function BossList({ title, bosses }: { title: string; bosses: Boss[] }) {
  return (
    <div className="min-w-0">
      <div className="pb-1.5 text-xs font-semibold text-muted-foreground">
        {title}
      </div>
      <ul>
        {bosses.map((boss) => (
          <li
            key={boss.id}
            className="flex h-7.5 items-center justify-between gap-2 border-t border-border/60"
          >
            <span className="truncate">{boss.boss_name}</span>
            <span className="min-w-6.5 rounded-full bg-muted px-1.5 text-center text-sm font-bold tabular-nums">
              {boss.dkp_points}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BossPointsCard({ bosses, mode }: { bosses: Boss[]; mode: GuildMode }) {
  const byPoints = (a: Boss, b: Boss) =>
    b.dkp_points - a.dkp_points || a.boss_name.localeCompare(b.boss_name, "ru");
  const primes = bosses
    .filter((boss) => boss.category === "Прайм")
    .sort(byPoints);
  const agl = bosses.filter((boss) => boss.category === "АГЛ").sort(byPoints);
  const chip = MODE_CHIP[mode];

  return (
    <section
      id="points"
      aria-label="Баллы за боссов"
      className="flex scroll-mt-6 flex-col rounded-xl border bg-card"
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2.5 sm:px-4.5">
        <div>
          <h2 className="text-base font-semibold">Баллы за боссов</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Зависят от режима гильдии
          </p>
        </div>
        <span
          className={cn(
            "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold",
            chip.className,
          )}
        >
          <span className={cn("size-1.5 rounded-full", chip.dot)} />
          {chip.label}
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4 px-4 pt-1 pb-3.5 sm:gap-5 sm:px-4.5">
        <BossList title="Праймы" bosses={primes} />
        <BossList title="АГЛ" bosses={agl} />
      </div>
      <p className="border-t border-border/60 px-4 pt-2.5 pb-3.5 text-xs text-muted-foreground sm:px-4.5">
        ПВП на прайме — баллы ×2 (п. 2.4). На АГЛ +1 балл за пвп, прок и двойной
        прок (п. 2.5)
      </p>
    </section>
  );
}

export default function GuildInfoContent({
  settings,
  bosses,
  guildMode,
  averageGuildGS,
}: {
  settings: SalaryEligibilitySettings;
  bosses: Boss[];
  guildMode: GuildMode;
  averageGuildGS: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Основная информация
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Правила гильдии: зарплата, баллы, лут, помощь с коллекциями и авансы
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CriteriaCard settings={settings} />
        <BossPointsCard bosses={bosses} mode={guildMode} />
      </div>

      <GuildRules averageGuildGS={averageGuildGS} />
    </div>
  );
}
