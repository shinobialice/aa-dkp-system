import Link from "next/link";
import PlayerHoverCard from "@/widgets/PlayerHoverCard";
import { classColors } from "@/widgets/MembersTable/classStyles";
import type { SalaryEntry } from "../financeModel";

type Props = {
  row: SalaryEntry;
  isMe: boolean;
};

export default function PlayerName({ row, isMe }: Props) {
  return (
    <span className="min-w-0">
      <span className="flex min-w-0 items-center gap-1.5">
        <PlayerHoverCard userId={row.userId}>
          <Link
            href={`/profile/${row.userId}`}
            className="truncate font-semibold transition-colors hover:text-primary"
          >
            {row.username}
          </Link>
        </PlayerHoverCard>
        {isMe && (
          <span className="shrink-0 rounded-full bg-green-100 px-1.5 text-2xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400">
            вы
          </span>
        )}
      </span>
      {row.class && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="size-[7px] rounded-full"
            style={{ backgroundColor: classColors[row.class] }}
          />
          {row.class}
        </span>
      )}
    </span>
  );
}
