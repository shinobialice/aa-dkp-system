import Link from "next/link";
import { cn } from "@/shared/lib/tw-merge";

export default function WarUserLink({
  userId,
  name,
  className,
}: {
  userId: number;
  name: string;
  className?: string;
}) {
  return (
    <Link
      href={`/profile/${userId}`}
      className={cn("truncate transition-colors hover:text-primary", className)}
    >
      {name}
    </Link>
  );
}
