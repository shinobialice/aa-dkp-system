"use server";

import {
  toGuildFaction,
  toGuildMode,
  toGuildServer,
  type GuildFaction,
  type GuildMode,
} from "@/shared/config/guildStatus";
import sql from "@/shared/lib/db";
import type { GuildPeriodHistoryRow } from "@/shared/lib/dbTypes";
import { toMoscowIso } from "@/utils/getMoscowISOString";
import type { GuildServer } from "@/utils/guildServers";

type ExtraOpponent = {
  name: string;
  startedAt: string;
  endedAt: string | null;
};

type HistoryQueryRow = GuildPeriodHistoryRow & {
  extra_opponents: ExtraOpponent[];
};

export type WarPeriodHistoryRow = {
  id: number;
  mode: GuildMode;
  server: GuildServer;
  faction: GuildFaction;
  opponentGuild: string | null;
  opponentEndedAt: string | null;
  extraOpponents: ExtraOpponent[];
  startedAt: string;
  endedAt: string;
  endedByUserId: number | null;
};

export async function getWarPeriodHistory(
  page: number,
  pageSize: number,
): Promise<{ rows: WarPeriodHistoryRow[]; total: number }> {
  try {
    const [[{ count }], rows] = await Promise.all([
      sql<{ count: number }[]>`
        SELECT count(*)::int AS count FROM guild_period_history
      `,
      sql<HistoryQueryRow[]>`
        SELECT
          h.*,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'name', o.name,
                  'startedAt', o.started_at,
                  'endedAt', o.ended_at
                )
                ORDER BY o.started_at, o.id
              )
              FROM guild_war_opponents o
              WHERE o.period_history_id = h.id
            ),
            '[]'::json
          ) AS extra_opponents
        FROM guild_period_history h
        ORDER BY h.ended_at DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `,
    ]);
    return { rows: rows.map(toHistoryRow), total: count };
  } catch (error) {
    console.error("Ошибка при получении истории периодов:", error);
    return { rows: [], total: 0 };
  }
}

function toHistoryRow(row: HistoryQueryRow): WarPeriodHistoryRow {
  return {
    id: row.id,
    mode: toGuildMode(row.mode),
    server: toGuildServer(row.server),
    faction: toGuildFaction(row.faction),
    opponentGuild: row.opponent_guild,
    opponentEndedAt: toMoscowIso(row.opponent_ended_at),
    extraOpponents: row.extra_opponents.map((opponent) => ({
      name: opponent.name,
      startedAt: toMoscowIso(opponent.startedAt),
      endedAt: toMoscowIso(opponent.endedAt),
    })),
    startedAt: toMoscowIso(row.started_at),
    endedAt: toMoscowIso(row.ended_at),
    endedByUserId: row.ended_by_user_id,
  };
}
