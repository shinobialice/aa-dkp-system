import Image from "next/image";
import type { RespawnHistoryEntry } from "@/actions/getBossRespawnHistoryPage";
import { bossImages } from "@/shared/config/bossImages";
import { Skeleton } from "@/shared/ui";
import { formatMoscowShort } from "../mainPageTime";
import { actionText, authorName, respawnHint } from "./historyModel";

type Props = {
  rows: RespawnHistoryEntry[];
  loading: boolean;
  skeletonCount: number;
};

export default function RecentKills({ rows, loading, skeletonCount }: Props) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        Отметок пока нет
      </p>
    );
  }

  const now = new Date();
  return (
    <ul>
      {rows.map((row) => (
        <RecentKillRow key={row.id} row={row} now={now} />
      ))}
    </ul>
  );
}

function RecentKillRow({ row, now }: { row: RespawnHistoryEntry; now: Date }) {
  const image = bossImages[row.boss_name];
  const markedAt = formatMoscowShort(new Date(row.created_at), now);

  return (
    <li className="flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0">
      {image && (
        <Image
          src={image}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-lg object-cover"
        />
      )}
      {!image && <span className="size-9 shrink-0 rounded-lg bg-muted" />}
      <div className="min-w-0 flex-1">
        <p className="truncate">
          <span className="font-semibold">{row.boss_name}</span>{" "}
          <span className="text-muted-foreground">
            — {actionText(row, now)}
          </span>
        </p>
        <p className="truncate text-xs text-muted-foreground sm:hidden">
          {authorName(row)} · {markedAt}
        </p>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {respawnHint(row, now)}
        </p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-sm font-medium">{authorName(row)}</p>
        <p className="text-xs text-muted-foreground tabular-nums">{markedAt}</p>
      </div>
    </li>
  );
}
