import { classColors } from "./classStyles";
import { type MemberGroup } from "./membersModel";

export default function GroupHeader({ group }: { group: MemberGroup }) {
  return (
    <div className="flex items-center gap-2 px-1 pt-2 text-sm font-semibold xl:border-b xl:bg-muted/30 xl:px-4 xl:py-2">
      {group.className && (
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: classColors[group.className] }}
        />
      )}
      {group.title}
      <span className="font-medium text-muted-foreground">
        {group.members.length}
      </span>
    </div>
  );
}
