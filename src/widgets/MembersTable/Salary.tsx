import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import type { Member } from "./membersModel";
import { formatNumber } from "@/shared/lib/format";

export function Salary({
  member,
}: {
  member: Pick<Member, "salary" | "salaryReason">;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end gap-1 tabular-nums",
        !member.salary && "text-muted-foreground",
      )}
    >
      {member.salary != null ? formatNumber(member.salary) : "—"}
      {member.salaryReason && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Почему такая зарплата"
              className="cursor-help text-muted-foreground"
            >
              <Info className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {member.salaryReason}
          </TooltipContent>
        </Tooltip>
      )}
    </span>
  );
}
