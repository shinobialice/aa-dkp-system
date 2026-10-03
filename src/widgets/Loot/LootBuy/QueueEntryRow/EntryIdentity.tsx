import { cn } from "@/shared/lib/tw-merge";
import { avatarSrc } from "@/shared/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import { STATUS_BADGES, type QueueEntry } from "../lootBuyModel";

type Props = {
  entry: QueueEntry;
  isMe: boolean;
};

export default function EntryIdentity({ entry, isMe }: Props) {
  const badge = STATUS_BADGES[entry.status];

  return (
    <>
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={avatarSrc(entry.username, entry.avatarUrl)} alt="" />
        <AvatarFallback className="text-2xs font-semibold">
          {entry.username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-medium">{entry.username}</span>
          {isMe && (
            <span className="shrink-0 rounded-full bg-green-600 px-1.5 text-2xs font-semibold text-white">
              вы
            </span>
          )}
          {badge && (
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 text-2xs font-semibold",
                badge.className,
              )}
            >
              {badge.label}
            </span>
          )}
        </span>
        <span className="flex items-center gap-1 text-2xs text-muted-foreground">
          {entry.userClass && (
            <span
              className="inline-flex [&_svg]:size-3"
              style={{ color: classColors[entry.userClass] }}
            >
              {classIcons[entry.userClass]}
            </span>
          )}
          {entry.userClass}
        </span>
      </span>
    </>
  );
}
