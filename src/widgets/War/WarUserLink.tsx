import Link from "next/link";
import PlayerHoverCard from "@/widgets/PlayerHoverCard";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  userId: number;
  name: string;
  className?: string;
};

export default function WarUserLink({ userId, name, className }: Props) {
  return (
    <PlayerHoverCard userId={userId}>
      <Link
        href={`/profile/${userId}`}
        className={cn(
          "truncate transition-colors hover:text-primary",
          className,
        )}
      >
        {name}
      </Link>
    </PlayerHoverCard>
  );
}
