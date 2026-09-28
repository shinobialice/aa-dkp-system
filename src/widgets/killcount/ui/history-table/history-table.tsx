"use client";
import {
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from "@/shared/ui";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { FC, useMemo, useState } from "react";

export interface KillCountHistoryData {
  date: string;
  totalKills: string;
  playersCount: number;
  warId: string | null;
  topUserId: number | null;
  topUserName: string | null;
  topKills: number | null;
}

export interface KillCountWar {
  id: string;
  opponentGuild: string | null;
  startedAt: string;
  endedAt: string | null;
}

interface KillCountHistoryTableProps {
  history: KillCountHistoryData[] | undefined;
  wars: KillCountWar[];
}

const ALL_DAYS = "all";

const formatDate = (iso: string) =>
  iso.slice(0, 10).split("-").reverse().join(".");

const getWarLabel = (war: KillCountWar) => {
  const title = war.opponentGuild ? `Вар против ${war.opponentGuild}` : "Вар";
  const end = war.endedAt ? formatDate(war.endedAt) : "сейчас";

  return `${title} · ${formatDate(war.startedAt)} – ${end}`;
};

const columnHelper = createColumnHelper<KillCountHistoryData>();

export const KillCountHistoryTable: FC<KillCountHistoryTableProps> = ({
  history,
  wars,
}) => {
  const [selectedWarId, setSelectedWarId] = useState(
    wars.at(0)?.id ?? ALL_DAYS,
  );

  const filteredHistory = useMemo(() => {
    if (selectedWarId === ALL_DAYS) {
      return history ?? [];
    }

    return (history ?? []).filter((day) => day.warId === selectedWarId);
  }, [history, selectedWarId]);

  const totalKills = filteredHistory.reduce(
    (acc, day) => acc + Number(day.totalKills),
    0,
  );

  const columns = [
    columnHelper.accessor("date", {
      header: "Дата",
      cell: (info) => {
        const label = new Date(info.getValue()).toLocaleString("ru-RU", {
          year: "2-digit",
          month: "long",
          day: "numeric",
        });

        return (
          <Link
            prefetch={false}
            href={`history/${info.getValue()?.split("T")?.at(0)}`}
            className="hover:underline inline-block"
          >
            <Typography>{label}</Typography>
          </Link>
        );
      },
    }),
    columnHelper.accessor("totalKills", {
      header: "Суммарное количество килов",
    }),
    columnHelper.accessor("playersCount", {
      header: "Кол-во игроков",
    }),
    columnHelper.accessor("topUserName", {
      header: "Топ прайма",
      cell: (info) => {
        const { topUserId, topUserName, topKills } = info.row.original;

        if (!topUserId || !topUserName) {
          return null;
        }

        return (
          <>
            <Link href={`/profile/${topUserId}`} className="underline">
              {topUserName}
            </Link>{" "}
            <span className="text-muted-foreground">({topKills})</span>
          </>
        );
      },
    }),
  ];

  return (
    <>
      <div className="mb-4 flex flex-col items-start gap-2">
        <Select value={selectedWarId} onValueChange={setSelectedWarId}>
          <SelectTrigger className="w-fit cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {wars.map((war) => (
              <SelectItem key={war.id} value={war.id}>
                {getWarLabel(war)}
              </SelectItem>
            ))}
            <SelectItem value={ALL_DAYS}>Все дни</SelectItem>
          </SelectContent>
        </Select>
        <Typography>
          Всего: {totalKills.toLocaleString("ru-RU")} килов за{" "}
          {filteredHistory.length} дн.
        </Typography>
      </div>

      <DataTable columns={columns} data={filteredHistory} />
    </>
  );
};
