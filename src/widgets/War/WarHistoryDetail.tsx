"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Users, Coins } from "lucide-react";
import { Button, Card } from "@/shared/ui";
import {
  MODE_LABEL,
  MODE_ICON,
  FACTION_LABEL,
} from "@/shared/config/guildStatus";
import {
  getPeriodAttendanceTop,
  getPeriodFinanceSummary,
  getPeriodTopSales,
  getPeriodTopIncomeSources,
  getPeriodTopDrops,
  getPeriodMembershipChanges,
  type PeriodAttendanceResult,
  type PeriodMembershipChanges,
  type WarEconomySnapshot,
} from "@/actions/warActions";
import type { WarPeriodHistoryRow } from "@/actions/guildStatusSettings";
import { formatDuration } from "./WarLiveDuration";
import WarLeaderboardCard, { type LeaderboardRow } from "./WarLeaderboardCard";
import WarDropsCard from "./WarDropsCard";
import WarTopSalesCard from "./WarTopSalesCard";
import WarMembershipCard from "./WarMembershipCard";

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNum(n: number): string {
  return n.toLocaleString("ru-RU");
}

// Разбор одного периода из истории. Показываем ТОЛЬКО реальные данные.
// Посещаемость — всегда (var/фришка, из raid/raid_attendance за сохранённый
// диапазон дат). Для закрытых периодов фришки — ещё и реальная экономика
// (доход/покупатели/источники/дроп, см. warActions.ts). Для вара килов/
// хонора/доп. ЗП здесь нет и не будет, пока по ним нет реального источника:
// замокать их тут означало бы выдать выдуманные цифры за постоянную запись
// истории, а не за "скоро появится" на живой странице — это хуже.
export default function WarHistoryDetail({
  period,
  onBack,
}: {
  period: WarPeriodHistoryRow;
  onBack: () => void;
}) {
  const [attendance, setAttendance] = useState<PeriodAttendanceResult | null>(
    null,
  );
  const [economy, setEconomy] = useState<WarEconomySnapshot | null>(null);
  const [membership, setMembership] = useState<PeriodMembershipChanges | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;
    getPeriodAttendanceTop(period.startedAt, period.endedAt).then((result) => {
      if (isMounted) setAttendance(result);
    });
    getPeriodMembershipChanges(period.startedAt, period.endedAt).then(
      (result) => {
        if (isMounted) setMembership(result);
      },
    );
    if (period.mode === "freeshard") {
      Promise.all([
        getPeriodFinanceSummary(period.startedAt, period.endedAt),
        getPeriodTopSales(period.startedAt, period.endedAt, 10),
        getPeriodTopIncomeSources(period.startedAt, period.endedAt),
        getPeriodTopDrops(period.startedAt, period.endedAt),
      ]).then(([finance, topSales, incomeSources, drops]) => {
        if (isMounted) setEconomy({ finance, topSales, incomeSources, drops });
      });
    } else {
      setEconomy(null);
    }
    return () => {
      isMounted = false;
    };
  }, [period.id, period.mode, period.startedAt, period.endedAt]);

  const attendanceRows: LeaderboardRow[] = (attendance?.top ?? []).map(
    (e, i) => ({
      rank: i + 1,
      name: e.username,
      value: `${e.raidsAttended}/${attendance?.totalRaidsInPeriod ?? "?"}`,
    }),
  );

  const incomeSourceRows: LeaderboardRow[] =
    economy?.incomeSources.map((s, i) => ({
      rank: i + 1,
      name: s.source,
      value: formatNum(s.income),
    })) ?? [];

  const startedAtMs = new Date(period.startedAt).getTime();
  const endedAtMs = new Date(period.endedAt).getTime();

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="cursor-pointer"
      >
        <ChevronLeft className="size-4" />
        Назад к истории
      </Button>

      <Card className="flex flex-col items-center gap-2 p-6">
        <Image
          src={MODE_ICON[period.mode]}
          alt={MODE_LABEL[period.mode]}
          width={90}
          height={90}
        />
        <h2 className="text-xl font-bold">{MODE_LABEL[period.mode]}</h2>
        {period.opponentGuild && (
          <p>
            против <strong className="text-destructive">{period.opponentGuild}</strong>
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {period.server} · {FACTION_LABEL[period.faction]}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDT(period.startedAt)} — {formatDT(period.endedAt)}
        </p>
        <p className="text-lg font-semibold tabular-nums">
          {formatDuration(startedAtMs, endedAtMs)}
        </p>
      </Card>

      {period.mode === "freeshard" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col justify-center gap-1 p-4">
            <p className="text-2xl font-bold tabular-nums">
              {economy ? formatNum(economy.finance.totalEarned) : "…"}
            </p>
            <p className="text-sm text-muted-foreground">Заработано за период</p>
          </Card>
          <Card className="flex flex-col justify-center gap-1 p-4">
            <p className="text-2xl font-bold tabular-nums">
              {economy?.finance.itemsSoldCount ?? "…"}
            </p>
            <p className="text-sm text-muted-foreground">Куплено предметов</p>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WarLeaderboardCard
          icon={Users}
          title="Посещаемость"
          rows={attendanceRows}
        />
        <WarMembershipCard changes={membership ?? { joined: [], left: [] }} />
        {period.mode === "freeshard" && (
          <>
            <WarLeaderboardCard
              icon={Coins}
              title="Топ источников дохода"
              rows={incomeSourceRows}
            />
            <WarTopSalesCard rows={economy?.topSales ?? []} />
            <WarDropsCard rows={economy?.drops ?? []} />
          </>
        )}
      </div>
    </div>
  );
}
