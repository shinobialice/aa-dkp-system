import Link from "next/link";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  userId: number;
  name: string;
  className?: string;
};

export default function WarUserLink({ userId, name, className }: Props) {
  return (
    <Link
      href={`/profile/${userId}`}
      className={cn("truncate transition-colors hover:text-primary", className)}
    >
      {name}
    </Link>
  );
}
