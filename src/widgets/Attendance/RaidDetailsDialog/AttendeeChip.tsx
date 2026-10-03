import Link from "next/link";
import { Clock } from "lucide-react";
import type { RaidDetailsAttendee } from "@/actions/getRaidById";
import { cn } from "@/shared/lib/tw-merge";
import { classColors } from "@/widgets/MembersTable/classStyles";

type Props = {
  attendee: RaidDetailsAttendee;
  isMe: boolean;
};

export default function AttendeeChip({ attendee, isMe }: Props) {
  const { user } = attendee;
  const avatarStyle = user.class
    ? { backgroundColor: classColors[user.class] }
    : undefined;

  return (
    <Link
      href={`/profile/${user.id}`}
      className={cn(
        "inline-flex h-7.5 items-center gap-1.5 rounded-full pr-2.5 pl-0.75 text-sm font-medium transition-colors",
        isMe
          ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-300"
          : "bg-muted hover:bg-muted/70",
      )}
    >
      <span
        className="flex size-6 items-center justify-center rounded-full bg-muted-foreground text-2xs font-bold text-white"
        style={avatarStyle}
      >
        {user.username.slice(0, 1).toUpperCase()}
      </span>
      {user.username}
      {attendee.is_late && (
        <span className="inline-flex items-center gap-0.5 text-2xs font-semibold text-amber-700 dark:text-amber-400">
          <Clock className="size-3" />
          опоздал
        </span>
      )}
    </Link>
  );
}
