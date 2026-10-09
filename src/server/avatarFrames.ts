import "server-only";
import { differenceInYears } from "date-fns";
import sql from "@/shared/lib/db";
import type { AvatarFrameRow, UserRow } from "@/shared/lib/dbTypes";

export type FrameOwner = Pick<
  UserRow,
  | "id"
  | "joined_at"
  | "avatar_frame_id"
  | "class"
  | "secondary_class"
  | "tertiary_class"
>;

type OwnerProgress = {
  kills: number;
  joinedAt: string | null;
  classes: (string | null)[];
};

export async function getAvatarFrameRows() {
  return sql<AvatarFrameRow[]>`
    SELECT id, name, image_url, unlock_type, unlock_value, unlock_class
    FROM avatar_frame
    ORDER BY
      array_position(ARRAY['free', 'class', 'rank', 'tenure'], unlock_type),
      unlock_value,
      id
  `;
}

export async function getCurrentWarKills(userIds: number[]) {
  const rows = await sql<{ user_id: number; kills: number }[]>`
    WITH season AS (
      SELECT * FROM (
        SELECT started_at, NULL::timestamp AS ended_at, true AS is_current
        FROM guild_status_settings
        WHERE id = 1 AND mode = 'pvp' AND started_at IS NOT NULL
        UNION ALL
        (
          SELECT started_at, ended_at, false AS is_current
          FROM guild_period_history
          WHERE mode = 'pvp'
          ORDER BY ended_at DESC
          LIMIT 1
        )
      ) periods
      ORDER BY is_current DESC
      LIMIT 1
    )
    SELECT s.user_id, SUM(s.end_kills - s.start_kills)::int AS kills
    FROM killcount_stats s
    CROSS JOIN season
    WHERE s.user_id = ANY(${userIds})
      AND s.recorded_at >= season.started_at
      AND (season.ended_at IS NULL OR s.recorded_at < season.ended_at)
    GROUP BY s.user_id
  `;
  return new Map(rows.map((row) => [row.user_id, row.kills]));
}

export function ownerProgress(
  owner: FrameOwner,
  kills: Map<number, number>,
): OwnerProgress {
  return {
    kills: kills.get(owner.id) ?? 0,
    joinedAt: owner.joined_at,
    classes: [owner.class, owner.secondary_class, owner.tertiary_class],
  };
}

export function isFrameUnlocked(
  frame: Pick<AvatarFrameRow, "unlock_type" | "unlock_value" | "unlock_class">,
  owner: OwnerProgress,
) {
  if (frame.unlock_type === "class") {
    return (
      frame.unlock_class !== null && owner.classes.includes(frame.unlock_class)
    );
  }
  if (frame.unlock_type === "rank") return owner.kills >= frame.unlock_value;
  if (frame.unlock_type === "tenure") {
    if (!owner.joinedAt) return false;
    const years = differenceInYears(new Date(), new Date(owner.joinedAt));
    return years >= frame.unlock_value;
  }
  return true;
}

export async function resolveAvatarFrameUrls(owners: FrameOwner[]) {
  const urls = new Map<number, string>();
  const framedIds = owners
    .filter((owner) => owner.avatar_frame_id !== null)
    .map((owner) => owner.id);
  if (framedIds.length === 0) return urls;

  const [frames, kills] = await Promise.all([
    getAvatarFrameRows(),
    getCurrentWarKills(framedIds),
  ]);
  const frameById = new Map(frames.map((frame) => [frame.id, frame]));

  for (const owner of owners) {
    if (owner.avatar_frame_id === null) continue;
    const frame = frameById.get(owner.avatar_frame_id);
    if (!frame) continue;
    if (isFrameUnlocked(frame, ownerProgress(owner, kills))) {
      urls.set(owner.id, frame.image_url);
    }
  }
  return urls;
}
