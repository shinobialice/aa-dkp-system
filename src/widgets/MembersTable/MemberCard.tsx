import type { Member } from "./membersModel";
import { formatNumber } from "@/shared/lib/format";
import { ClassPill } from "./ClassPill";
import { Meter } from "./Meter";
import { Salary } from "./Salary";
import MemberIdentity from "./MemberIdentity";

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="flex flex-col gap-2.5 rounded-xl border bg-card p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <MemberIdentity member={member} size="lg" />
        <ClassPill cls={member.class} />
      </div>
      <div className="flex justify-between gap-2 text-xs text-muted-foreground">
        <span>
          GS{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {member.class_gear_score
              ? formatNumber(member.class_gear_score)
              : "—"}
          </span>
        </span>
        <span>
          {formatNumber(member.daysInGuild)} дн. в гильдии · с{" "}
          {member.joinedAtFormatted}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Meter value={member.primePercent} label="Прайм" />
        <Meter value={member.aglPercent} label="АГЛ" />
        <Meter value={member.totalPercent} label="Итого" status />
      </div>
      <div className="flex items-center justify-between border-t pt-2 text-sm">
        <span className="text-muted-foreground">Зарплата</span>
        <span className="font-semibold">
          <Salary member={member} />
        </span>
      </div>
    </article>
  );
}
