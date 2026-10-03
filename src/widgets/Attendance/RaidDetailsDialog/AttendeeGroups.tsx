import type { RaidDetailsAttendee } from "@/actions/getRaidById";
import { groupByClass } from "@/shared/config/classes";
import { classColors } from "@/widgets/MembersTable/classStyles";
import AttendeeChip from "./AttendeeChip";

type Props = {
  attendees: RaidDetailsAttendee[];
  search: string;
  currentUserId: number | null;
};

export default function AttendeeGroups({
  attendees,
  search,
  currentUserId,
}: Props) {
  if (attendees.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        Участники ещё не добавлены
      </p>
    );
  }

  const term = search.trim().toLowerCase();
  const found = attendees
    .filter(
      (attendee) =>
        !term || attendee.user.username.toLowerCase().includes(term),
    )
    .sort((a, b) => a.user.username.localeCompare(b.user.username, "ru"));
  const groups = groupByClass(found, (attendee) => attendee.user.class);

  if (groups.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Никого не нашлось
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
            <span
              className="size-2 rounded-full bg-muted-foreground"
              style={
                group.cls
                  ? { backgroundColor: classColors[group.cls] }
                  : undefined
              }
            />
            {group.title}
            <span className="font-medium text-muted-foreground">
              {group.items.length}
            </span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((attendee) => (
              <AttendeeChip
                key={attendee.user.id}
                attendee={attendee}
                isMe={attendee.user.id === currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
