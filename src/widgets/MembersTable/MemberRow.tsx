"use client";

import { cn } from "@/shared/lib/tw-merge";
import type { Member } from "./membersModel";
import { formatNumber } from "@/shared/lib/format";
import { ClassPill } from "./ClassPill";
import { Meter } from "./Meter";
import { Salary } from "./Salary";
import MemberIdentity from "./MemberIdentity";

export const ROW_COLUMNS =
  "grid-cols-[minmax(0,2fr)_104px_64px_108px_96px_96px_96px_88px]";

export function MemberRow({ member }: { member: Member }) {
  return (
    <div
      className={cn(
        "grid min-h-14 items-center gap-3 border-b px-4 py-1.5 last:border-b-0",
        ROW_COLUMNS,
      )}
    >
      <MemberIdentity member={member} size="sm" />
      <div>
        <ClassPill cls={member.class} />
      </div>
      <div className="text-right tabular-nums">
        {member.class_gear_score ? formatNumber(member.class_gear_score) : "—"}
      </div>
      <div>
        <p className="tabular-nums">{formatNumber(member.daysInGuild)} дн.</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          с {member.joinedAtFormatted}
        </p>
      </div>
      <Meter value={member.primePercent} />
      <Meter value={member.aglPercent} />
      <Meter value={member.totalPercent} status />
      <div className="text-right">
        <Salary member={member} />
      </div>
    </div>
  );
}
