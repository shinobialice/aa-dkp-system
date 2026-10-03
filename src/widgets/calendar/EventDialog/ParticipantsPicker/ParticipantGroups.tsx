import { classColors } from "@/widgets/MembersTable/classStyles";
import type { IdFlags } from "../eventFormModel";
import ParticipantChip from "./ParticipantChip";
import type { ParticipantGroup } from "./participantsModel";

type Props = {
  groups: ParticipantGroup[];
  selectedIds: IdFlags;
  lateIds: IdFlags;
  onToggle: (userId: number) => void;
  onLateToggle: (userId: number) => void;
};

export default function ParticipantGroups({
  groups,
  selectedIds,
  lateIds,
  onToggle,
  onLateToggle,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
      {groups.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Никого не нашлось
        </p>
      )}
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
              {group.selected} / {group.total}
            </span>
          </span>
          <div className="flex flex-col gap-1">
            {group.people.map((user) => (
              <ParticipantChip
                key={user.id}
                user={user}
                selected={!!selectedIds[user.id]}
                late={!!selectedIds[user.id] && !!lateIds[user.id]}
                onToggle={() => onToggle(user.id)}
                onLateToggle={() => onLateToggle(user.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
