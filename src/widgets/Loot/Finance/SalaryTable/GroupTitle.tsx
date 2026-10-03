import { cn } from "@/shared/lib/tw-merge";
import { classColors } from "@/widgets/MembersTable/classStyles";
import type { SalaryGroup } from "../financeModel";

type Props = {
  group: SalaryGroup;
  desktop?: boolean;
};

export default function GroupTitle({ group, desktop }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-semibold",
        desktop ? "border-b bg-muted/30 px-4 py-2" : "px-1 pt-2",
      )}
    >
      {group.className && (
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: classColors[group.className] }}
        />
      )}
      {group.title}
      <span className="font-medium text-muted-foreground">
        {group.rows.length}
      </span>
    </div>
  );
}
