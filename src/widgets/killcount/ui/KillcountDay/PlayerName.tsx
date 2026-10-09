import Link from "next/link";
import PlayerHoverCard from "@/widgets/PlayerHoverCard";
import { type KillRow } from "../killcountModel";

export default function PlayerName({ row }: { row: KillRow }) {
  if (!row.userId) {
    return <span className="truncate font-semibold">{row.userName}</span>;
  }
  return (
    <PlayerHoverCard userId={Number(row.userId)}>
      <Link
        href={`/profile/${row.userId}`}
        className="truncate font-semibold hover:underline"
      >
        {row.userName}
      </Link>
    </PlayerHoverCard>
  );
}
