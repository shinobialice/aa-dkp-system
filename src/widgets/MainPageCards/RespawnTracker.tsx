"use client";

import { useEffect, useState, FC } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/tw-merge";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMaintenanceWindows } from "@/hooks/useMaintenanceWindows";
import { registerBossKill } from "@/actions/registerBossKill";
import { getBossRespawnStatus } from "@/actions/getBossRespawnStatus";
import { DateTimePopover } from "./DateTimePopover";
import { formatDuration, formatMoscowHM, formatMoscowShort } from "./mainPageTime";
import {
  BossName,
  MaintenanceWindow,
  bosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
  getNextMissedCycleStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
} from "@/shared/config/bossRespawn";

const bossImages: Partial<Record<BossName, string>> = {
  Марли: "/images/bosses/marli.png",
  Морф: "/images/bosses/morpheos.png",
};

type BossState = {
  lastKill: string | null;
  updatedAt: string | null;
  markedBy: string | null;
};

type RespawnKind = "maintenance" | "none" | "waiting" | "open" | "missed";

type RespawnInfo = {
  kind: RespawnKind;
  killDate: Date | null;
  respawnStart: Date | null;
  respawnEnd: Date | null;
  nextCycle: Date | null;
  progress: number | null;
};

const registerCooldownSeconds = 30;
const HOUR_MS = 60 * 60 * 1000;

const emptyStates: Record<BossName, BossState> = {
  Марли: { lastKill: null, updatedAt: null, markedBy: null },
  Морф: { lastKill: null, updatedAt: null, markedBy: null },
};

const STATUS_STYLES: Record<
  RespawnKind,
  { label: string; chip: string; dot: string; big: string }
> = {
  waiting: {
    label: "Ожидание",
    chip: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
    big: "",
  },
  open: {
    label: "Возможен респаун",
    chip: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    dot: "bg-green-500 animate-pulse",
    big: "text-green-700 dark:text-green-400",
  },
  missed: {
    label: "Проёбано",
    chip: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    dot: "bg-red-500",
    big: "text-red-700 dark:text-red-400",
  },
  maintenance: {
    label: "Проф. работы",
    chip: "bg-muted text-muted-foreground",
    dot: "bg-zinc-400",
    big: "text-muted-foreground",
  },
  none: {
    label: "Нет данных",
    chip: "bg-muted text-muted-foreground",
    dot: "bg-zinc-400",
    big: "text-muted-foreground",
  },
};

function getRespawnInfo(
  lastKill: string | null,
  respawnHours: number,
  now: Date,
  maintenanceWindows: MaintenanceWindow[],
): RespawnInfo {
  const empty = {
    killDate: lastKill ? new Date(lastKill) : null,
    respawnStart: null,
    respawnEnd: null,
    nextCycle: null,
    progress: null,
  };
  if (isMaintenanceWindow(now, maintenanceWindows)) {
    return { kind: "maintenance", ...empty };
  }
  if (!lastKill) return { kind: "none", ...empty };

  const killDate = new Date(lastKill);
  const respawnStart = getRespawnStart(lastKill, respawnHours);
  const respawnEnd = new Date(respawnStart.getTime() + respawnWindow * HOUR_MS);
  if (maintenanceStartedDuring(killDate, respawnEnd, maintenanceWindows)) {
    return { kind: "maintenance", ...empty };
  }

  const cycleMs = (respawnHours + respawnWindow) * HOUR_MS;
  const progress = Math.min(
    100,
    Math.max(0, ((now.getTime() - killDate.getTime()) / cycleMs) * 100),
  );
  const base = { killDate, respawnStart, respawnEnd, progress };

  if (now < respawnStart) return { kind: "waiting", nextCycle: null, ...base };
  if (now <= respawnEnd) return { kind: "open", nextCycle: null, ...base };

  const nextCycle = getNextMissedCycleStart(respawnStart, now, respawnHours);
  const cascadeEnd = new Date(nextCycle.getTime() + respawnWindow * HOUR_MS);
  if (maintenanceStartedDuring(respawnEnd, cascadeEnd, maintenanceWindows)) {
    return { kind: "maintenance", ...empty };
  }
  return { kind: "missed", nextCycle, ...base, progress: 100 };
}

function describe(info: RespawnInfo, now: Date) {
  const minutesTo = (date: Date | null) =>
    date ? (date.getTime() - now.getTime()) / 60000 : 0;

  switch (info.kind) {
    case "waiting":
      return {
        big: `через ${formatDuration(Math.ceil(minutesTo(info.respawnStart)))}`,
        sub: `Респаун в окне ${formatMoscowShort(info.respawnStart!, now)}–${formatMoscowHM(info.respawnEnd!)}`,
      };
    case "open":
      return {
        big: "Окно открыто",
        sub: `ещё ${formatDuration(Math.ceil(minutesTo(info.respawnEnd)))} — до конца окна`,
      };
    case "missed": {
      const next = info.nextCycle!;
      return {
        big: "Окно пропущено",
        sub:
          next > now
            ? `Следующий цикл примерно в ${formatMoscowShort(next, now)}`
            : `Новое окно примерно до ${formatMoscowHM(new Date(next.getTime() + respawnWindow * HOUR_MS))}`,
      };
    }
    case "maintenance":
      return {
        big: "Таймер на паузе",
        sub: "Идут проф. работы — отметьте убийство после них",
      };
    default:
      return { big: "Нет данных", sub: "Отметьте, когда босса убьют" };
  }
}

const RespawnTracker: FC = () => {
  const maintenanceWindows = useMaintenanceWindows();
  const [bossStates, setBossStates] =
    useState<Record<BossName, BossState>>(emptyStates);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<BossName | null>(null);
  const [now, setNow] = useState(() => new Date());
  const user = useCurrentUser();

  useEffect(() => {
    let isMounted = true;
    async function fetchRespawn(isInitial: boolean) {
      if (isInitial) setLoading(true);
      const data = await getBossRespawnStatus(bosses as unknown as string[]);
      if (data && isMounted) {
        const loaded: Record<BossName, BossState> = { ...emptyStates };
        data.forEach(
          (row: {
            boss_name: BossName;
            last_kill: string | null;
            updated_at: string | null;
            marked_by: string | null;
          }) => {
            loaded[row.boss_name] = {
              lastKill: row.last_kill,
              updatedAt: row.updated_at,
              markedBy: row.marked_by,
            };
          },
        );
        setBossStates(loaded);
      }
      if (isInitial) setLoading(false);
    }
    fetchRespawn(true);
    const interval = setInterval(() => fetchRespawn(false), 15_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const [popoverDate, setPopoverDate] = useState<Record<BossName, Date | null>>({
    Марли: null,
    Морф: null,
  });

  function cooldownSecondsLeft(boss: BossName): number {
    const updatedAt = bossStates[boss].updatedAt;
    if (!updatedAt) return 0;
    const elapsedMs = now.getTime() - new Date(updatedAt).getTime();
    return Math.max(
      0,
      Math.ceil((registerCooldownSeconds * 1000 - elapsedMs) / 1000),
    );
  }

  async function saveRespawn(boss: BossName, iso: string, action: string) {
    if (!user) {
      alert("Вы должны быть авторизованы для изменения времени!");
      return;
    }
    if (cooldownSecondsLeft(boss) > 0) return;
    setSaving(boss);
    const { registered } = await registerBossKill(
      boss,
      iso,
      action,
      user.id,
      registerCooldownSeconds,
    );
    if (registered) {
      setBossStates((prev) => ({
        ...prev,
        [boss]: {
          lastKill: iso,
          updatedAt: new Date().toISOString(),
          markedBy: user.name ?? prev[boss].markedBy,
        },
      }));
    }
    setSaving(null);
  }

  function handleConfirmSetTime(boss: BossName) {
    const date = popoverDate[boss];
    if (!date) return;
    setPopoverDate((prev) => ({ ...prev, [boss]: null }));
    saveRespawn(boss, date.toISOString(), "Указано время");
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bosses.map((boss) => {
        const state = bossStates[boss];
        const respawnHours = respawnHoursByBoss[boss];
        const info = getRespawnInfo(
          state.lastKill,
          respawnHours,
          now,
          maintenanceWindows,
        );
        const style = STATUS_STYLES[info.kind];
        const text = describe(info, now);
        const cooldown = cooldownSecondsLeft(boss);
        const disabled = saving === boss || loading || cooldown > 0;
        const windowStart = (respawnHours / (respawnHours + respawnWindow)) * 100;

        return (
          <article
            key={boss}
            className="flex min-w-0 flex-col gap-3.5 rounded-xl border bg-card p-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              {bossImages[boss] && (
                <Image
                  src={bossImages[boss]!}
                  alt={boss}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[17px] leading-tight font-bold">{boss}</p>
                <p className="text-xs text-muted-foreground">
                  Респаун {respawnHours} ч + окно {respawnWindow} ч
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap",
                  style.chip,
                )}
              >
                <span className={cn("size-[7px] rounded-full", style.dot)} />
                {style.label}
              </span>
            </div>

            <div>
              {loading ? (
                <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
              ) : (
                <p
                  className={cn(
                    "text-[26px] leading-tight font-bold tracking-tight",
                    style.big,
                  )}
                >
                  {text.big}
                </p>
              )}
              <p className="text-sm text-muted-foreground">{text.sub}</p>
            </div>

            {info.progress !== null && info.killDate && info.respawnStart && (
              <div className="space-y-1.5">
                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "absolute inset-y-0 right-0",
                      info.kind === "missed"
                        ? "bg-red-200 dark:bg-red-500/30"
                        : "bg-green-100 dark:bg-green-500/20",
                    )}
                    style={{ left: `${windowStart}%` }}
                  />
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full",
                      info.kind === "open" && "bg-green-500",
                      info.kind === "waiting" && "bg-zinc-400 dark:bg-zinc-500",
                      info.kind === "missed" && "bg-red-300 dark:bg-red-500/60",
                    )}
                    style={{ width: `${info.progress}%` }}
                  />
                </div>
                <div className="flex justify-between gap-2 text-xs text-muted-foreground tabular-nums">
                  <span>убит {formatMoscowShort(info.killDate, now)}</span>
                  <span>
                    окно {formatMoscowShort(info.respawnStart, now)}–
                    {formatMoscowHM(info.respawnEnd!)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => saveRespawn(boss, new Date().toISOString(), "Убит сейчас")}
                disabled={disabled}
              >
                {saving === boss && <Loader2 className="animate-spin" />}
                {cooldown > 0 ? `КД ${cooldown}с` : "Убит сейчас"}
              </Button>
              <DateTimePopover
                value={popoverDate[boss]}
                onChange={(date) =>
                  setPopoverDate((prev) => ({ ...prev, [boss]: date }))
                }
                onConfirm={() => handleConfirmSetTime(boss)}
              >
                <Button variant="outline" className="flex-1" disabled={disabled}>
                  Указать время
                </Button>
              </DateTimePopover>
            </div>

            <p className="border-t pt-2.5 text-xs text-muted-foreground">
              {state.markedBy && state.updatedAt
                ? `Последняя отметка: ${state.markedBy} · ${formatMoscowShort(new Date(state.updatedAt), now)}`
                : "Отметок ещё не было"}
            </p>
          </article>
        );
      })}
    </div>
  );
};

export default RespawnTracker;
