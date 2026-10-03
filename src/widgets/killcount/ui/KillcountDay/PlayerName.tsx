import Link from "next/link";
import { type KillRow } from "../killcountModel";

export default function PlayerName({ row }: { row: KillRow }) {
  return row.userId ? (
    <Link
      href={`/profile/${row.userId}`}
      className="truncate font-semibold hover:underline"
    >
      {row.userName}
    </Link>
  ) : (
    <span className="truncate font-semibold">{row.userName}</span>
  );
}
