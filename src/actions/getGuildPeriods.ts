"use server";

import { toGuildMode, type GuildMode } from "@/shared/config/guildStatus";
import sql from "@/shared/lib/db";
import type {
  GuildPeriodHistoryRow,
  GuildStatusSettingsRow,
} from "@/shared/lib/dbTypes";
import { getMoscowISOString } from "@/utils/getMoscowISOString";

export type GuildPeriod = {
  mode: GuildMode;
  opponents: string[];
  startedAt: string;
  endedAt: string;
  isOngoing: boolean;
};

type PeriodQueryRow = Pick<GuildPeriodHistoryRow, "mode" | "opponent_guild"> &
  Pick<GuildStatusSettingsRow, "started_at"> & {
    ended_at: string | null;
    extra_opponents: string[];
  };

export async function getGuildPeriods(year: number): Promise<GuildPeriod[]> {
  const yearStart = `${year}-01-01T00:00:00`;
  const yearEnd = `${year + 1}-01-01T00:00:00`;

  let rows: PeriodQueryRow[];
  try {
    rows = await sql<PeriodQueryRow[]>`
      SELECT h.mode, h.opponent_guild, h.started_at, h.ended_at,
        COALESCE(
          (SELECT array_agg(o.name ORDER BY o.started_at, o.id)
           FROM guild_war_opponents o WHERE o.period_history_id = h.id),
          '{}'
        ) AS extra_opponents
      FROM guild_period_history h
      WHERE h.started_at < ${yearEnd} AND h.ended_at >= ${yearStart}
      UNION ALL
      SELECT s.mode, s.opponent_guild, s.started_at, NULL,
        COALESCE(
          (SELECT array_agg(o.name ORDER BY o.started_at, o.id)
           FROM guild_war_opponents o WHERE o.period_history_id IS NULL),
          '{}'
        )
      FROM guild_status_settings s
      WHERE s.id = 1 AND s.started_at < ${yearEnd}
      ORDER BY started_at
    `;
  } catch (error) {
    console.error("Ошибка при получении периодов гильдии:", error);
    throw new Error("Не удалось загрузить периоды вара и фришки");
  }

  const now = getMoscowISOString(new Date());
  return rows.flatMap((row) => {
    if (!row.started_at) return [];
    const opponents = row.opponent_guild
      ? [row.opponent_guild, ...row.extra_opponents]
      : row.extra_opponents;
    return [
      {
        mode: toGuildMode(row.mode),
        opponents,
        startedAt: row.started_at,
        endedAt: row.ended_at ?? now,
        isOngoing: row.ended_at === null,
      },
    ];
  });
}
