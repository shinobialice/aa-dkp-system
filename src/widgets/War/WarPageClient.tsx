"use client";

import Image from "next/image";
import { Swords, Trophy, Users, Gift, Coins } from "lucide-react";
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { MODE_LABEL, MODE_ICON } from "@/shared/config/guildStatus";
import type { GuildStatus } from "@/actions/guildStatusSettings";
import type {
  PeriodAttendanceResult,
  PeriodMembershipChanges,
  WarEconomySnapshot,
} from "@/actions/warActions";
import WarOpponentEditor from "./WarOpponentEditor";
import WarLiveDuration from "./WarLiveDuration";
import WarLeaderboardCard, { type LeaderboardRow } from "./WarLeaderboardCard";
import WarDropsCard from "./WarDropsCard";
import WarTopSalesCard from "./WarTopSalesCard";
import WarMembershipCard from "./WarMembershipCard";
import WarHistoryTab from "./WarHistoryTab";

// ───────────────────────────────────────────────────────────────────────
// МОК-ДАННЫЕ — только то, для чего в базе реально нет источника: килы и
// хонор — чисто варная механика (в ArcheAge их нет во время фришки, взять
// неоткуда даже в теории), показываются только при mode === "pvp". Всё
// остальное на фришке (доход, покупатели, источники дохода, дроп с боссов)
// теперь реальные данные — см. src/actions/warActions.ts. Имена в моках —
// не настоящие ники ("Игрок N"), чтобы не приписывать реальным людям
// выдуманные цифры.
// ───────────────────────────────────────────────────────────────────────
const MOCK_KILLS_LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, name: "Игрок 1", value: "42" },
  { rank: 2, name: "Игрок 2", value: "37" },
  { rank: 3, name: "Игрок 3", value: "25" },
];
const MOCK_HONOR_LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, name: "Игрок 1", value: "1 200" },
  { rank: 2, name: "Игрок 2", value: "980" },
  { rank: 3, name: "Игрок 3", value: "860" },
];
const MOCK_TOTAL_KILLS = "214";
const MOCK_TOTAL_HONOR = "15 300";
// ───────────────────────────────────────────────────────────────────────
// Конец мок-данных.
// ───────────────────────────────────────────────────────────────────────

function formatNum(n: number): string {
  return n.toLocaleString("ru-RU");
}

function formatStartDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Moscow",
  }).format(new Date(iso));
}

function MockTile({ value, label }: { value: string; label: string }) {
  return (
    <Card className="p-4">
      <CardContent className="space-y-1 p-0">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <span className="text-[11px] text-muted-foreground">скоро</span>
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function RealTile({ value, label }: { value: string | number; label: string }) {
  return (
    <Card className="p-4">
      <CardContent className="space-y-1 p-0">
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function WarPageClient({
  isAdmin,
  initialStatus,
  initialAttendance,
  initialMembership,
  initialEconomy,
}: {
  isAdmin: boolean;
  initialStatus: GuildStatus;
  initialAttendance: PeriodAttendanceResult;
  initialMembership: PeriodMembershipChanges;
  initialEconomy: WarEconomySnapshot | null;
}) {
  const { mode, startedAt, opponentGuild } = initialStatus;
  const isWar = mode === "pvp";

  const attendanceRows: LeaderboardRow[] = initialAttendance.top.map(
    (e, i) => ({
      rank: i + 1,
      name: e.username,
      value: `${e.raidsAttended}/${initialAttendance.totalRaidsInPeriod}`,
    }),
  );

  const incomeSourceRows: LeaderboardRow[] =
    initialEconomy?.incomeSources.map((s, i) => ({
      rank: i + 1,
      name: s.source,
      value: formatNum(s.income),
    })) ?? [];

  return (
    <div className="space-y-6">
      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        <Image
          src={MODE_ICON[mode]}
          alt={MODE_LABEL[mode]}
          width={110}
          height={110}
        />
        <h1 className="text-2xl font-bold">{MODE_LABEL[mode]}</h1>
        {isWar && (
          <WarOpponentEditor initialOpponent={opponentGuild} isAdmin={isAdmin} />
        )}
        {startedAt && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {isWar ? "Вар идёт" : "Фришка идёт"}
            </span>
            <WarLiveDuration startedAt={startedAt} />
            <span className="text-xs text-muted-foreground">
              с {formatStartDate(startedAt)}
            </span>
          </div>
        )}
      </Card>

      <Tabs defaultValue="now">
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="now">
            Сейчас
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="history">
            История
          </TabsTrigger>
        </TabsList>

        <TabsContent value="now" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <RealTile
              value={initialAttendance.totalRaidsInPeriod}
              label="Рейдов за период"
            />
            {isWar ? (
              <>
                <MockTile value={MOCK_TOTAL_KILLS} label="Килы гильдии" />
                <MockTile value={MOCK_TOTAL_HONOR} label="Хонор гильдии" />
              </>
            ) : (
              <>
                <RealTile
                  value={formatNum(initialEconomy?.finance.totalEarned ?? 0)}
                  label="Заработано за период"
                />
                <RealTile
                  value={initialEconomy?.finance.itemsSoldCount ?? 0}
                  label="Куплено предметов"
                />
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <WarLeaderboardCard
              icon={Users}
              title="Посещаемость"
              rows={attendanceRows}
            />
            <WarMembershipCard changes={initialMembership} />
            {isWar ? (
              <>
                <WarLeaderboardCard
                  icon={Swords}
                  title="Килы"
                  rows={MOCK_KILLS_LEADERBOARD}
                  isMock
                />
                <WarLeaderboardCard
                  icon={Trophy}
                  title="Хонор"
                  rows={MOCK_HONOR_LEADERBOARD}
                  isMock
                />
              </>
            ) : (
              <>
                <WarLeaderboardCard
                  icon={Coins}
                  title="Топ источников дохода"
                  rows={incomeSourceRows}
                />
                <WarTopSalesCard rows={initialEconomy?.topSales ?? []} />
                <WarDropsCard rows={initialEconomy?.drops ?? []} />
              </>
            )}
          </div>

          {/* МОК: статичная информационная карточка, не подключена к
              addUserSalaryBonus/user_salary_bonus — админ по-прежнему выдаёт
              бонусы вручную с профиля игрока. Только для вара — доп. ЗП
              завязана на итоги вара, на фришке этой механики нет. */}
          {isWar && (
            <Card className="p-4">
              <CardContent className="space-y-2 p-0">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Gift className="size-4 text-muted-foreground" />
                  Дополнительная ЗП по итогам вара
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    скоро
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  MVP по киллам, 100% посещаемость и топ-3 по хонору получают
                  бонус к ЗП. Начисляется вручную админом с профиля игрока
                  после окончания вара.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <WarHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
