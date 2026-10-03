import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { type KillRow } from "../killcountModel";
import { avatarSrc } from "@/shared/lib/format";

export default function PlayerAvatar({
  row,
  className,
}: {
  row: KillRow;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-7 shrink-0", className)}>
      <AvatarImage src={avatarSrc(row.userName, row.avatarUrl)} alt="" />
      <AvatarFallback className="text-2xs">
        {row.userName.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
