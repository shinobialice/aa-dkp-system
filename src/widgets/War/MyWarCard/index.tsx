"use client";

import {
  getMyPeriodRaids,
  type PeriodAttendanceResult,
  type RaidMark,
} from "@/actions/warAttendance";
import { useAsyncData } from "@/hooks/useAsyncData";
import type useCurrentUser from "@/hooks/useCurrentUser";
import {
  Avatar,
  AvatarFallback,
  AvatarFrame,
  AvatarImage,
  Skeleton,
} from "@/shared/ui";
import ArenaPanel from "@/widgets/arena/ArenaPanel";
import { formatDecimal, type Fighter } from "../warModel";
import MyAttendanceView from "./MyAttendanceView";
import MyRankView from "./MyRankView";
import { attendanceSummary } from "./myWarModel";

type CurrentUser = NonNullable<ReturnType<typeof useCurrentUser>>;

type Props = {
  user: CurrentUser | null;
  fighters: Fighter[];
  attendance: PeriodAttendanceResult;
  periodStart: string;
  periodEnd: string;
};

export default function MyWarCard({
  user,
  fighters,
  attendance,
  periodStart,
  periodEnd,
}: Props) {
  const marks = useAsyncData(`my-raids-${periodStart}-${periodEnd}`, () =>
    getMyPeriodRaids(periodStart, periodEnd, "pvp"),
  );

  if (!user) return <Skeleton className="h-[560px] w-full" />;

  const me = fighters.find((fighter) => fighter.userId === user.id);
  const isRanked = me !== undefined && me.kills !== null;
  const total = attendance.totalRaidsInPeriod;

  return (
    <ArenaPanel
      title="Твой вар"
      meta={isRanked ? "киллкаунт" : "явка"}
      className="arena-enter h-full"
    >
      <div className="flex items-center gap-3">
        <AvatarFrame frameUrl={user.frame} className="size-10">
          <Avatar className="size-10">
            <AvatarImage src={user.avatar} alt="" />
            <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </AvatarFrame>
        <p className="min-w-0">
          <span className="block truncate font-bold">{user.name}</span>
          <span className="block text-xs text-muted-foreground">
            {subtitle(me, isRanked, total)}
          </span>
        </p>
      </div>
      <MyWarBody
        me={me}
        fighters={fighters}
        attendance={attendance}
        marks={marks.data}
      />
    </ArenaPanel>
  );
}

type MyWarBodyProps = {
  me: Fighter | undefined;
  fighters: Fighter[];
  attendance: PeriodAttendanceResult;
  marks: RaidMark[] | undefined;
};

function MyWarBody({ me, fighters, attendance, marks }: MyWarBodyProps) {
  if (me && me.kills !== null) {
    return (
      <MyRankView
        me={me}
        fighters={fighters}
        totalRaids={attendance.totalRaidsInPeriod}
      />
    );
  }
  return (
    <MyAttendanceView
      summary={attendanceSummary(me, attendance)}
      marks={marks}
    />
  );
}

function subtitle(me: Fighter | undefined, isRanked: boolean, total: number) {
  const className = me?.userClass ?? "Класс не указан";
  if (!isRanked) return `${className} · не в киллкаунте`;
  return `${className} · в ${formatDecimal(me?.raids ?? 0)} из ${total} рейдов`;
}
