"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import type { SalaryEntry, SalaryGroup } from "../financeModel";
import type { AdvanceHandlers } from "./AdvanceControls";
import GroupTitle from "./GroupTitle";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import SalaryMobileCard from "./SalaryMobileCard";
import UnpaidToggle from "./UnpaidToggle";

type Props = {
  groups: SalaryGroup[];
  grouped: boolean;
  unpaid: SalaryEntry[];
  isEmpty: boolean;
  currentUserId: number | null;
  unpaidReasons: Record<number, string>;
  advance: AdvanceHandlers;
};

export default function SalaryMobileList({
  groups,
  grouped,
  unpaid,
  isEmpty,
  currentUserId,
  unpaidReasons,
  advance,
}: Props) {
  const [showUnpaid, setShowUnpaid] = useState(false);

  return (
    <div className="flex flex-col gap-3 xl:hidden">
      {isEmpty && (
        <p className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
          Никого не нашлось
        </p>
      )}
      {groups.map((group) => (
        <div key={group.key} className="flex flex-col gap-2">
          {grouped && <GroupTitle group={group} />}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-2">
            {group.rows.map((row) => (
              <SalaryMobileCard
                key={row.id}
                row={row}
                isMe={row.userId === currentUserId}
                advance={advance}
              />
            ))}
          </div>
        </div>
      ))}
      {unpaid.length > 0 && (
        <div className="rounded-xl border bg-card">
          <UnpaidToggle
            count={unpaid.length}
            open={showUnpaid}
            onToggle={() => setShowUnpaid(!showUnpaid)}
            className="min-h-11 px-3.5"
          />
          {showUnpaid && (
            <ul className="border-t">
              {unpaid.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-2.5 border-b border-border/60 px-3.5 py-2 last:border-b-0"
                >
                  <PlayerAvatar row={row} />
                  <PlayerName row={row} isMe={row.userId === currentUserId} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Почему зарплата 0"
                        className="ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground"
                      >
                        <Info className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {unpaidReasons[row.userId] ?? "Вес за месяц — 0"}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
