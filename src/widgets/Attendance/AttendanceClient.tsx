"use client";

import { useState } from "react";
import type { RangeRaid } from "@/actions/getRaidsInRange";
import EventDialog from "@/widgets/calendar/EventDialog";
import MissingActivitiesBanner from "@/widgets/calendar/MissingActivitiesBanner";
import RaidSuggestionsCard from "@/widgets/calendar/RaidSuggestionsCard";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceToolbar from "./AttendanceToolbar";
import {
  ALL_KINDS,
  filterRaids,
  monthRange,
  myStats,
  raidsByDay,
  shiftAnchor,
  weekRange,
  type AttendanceView,
  type KindFilter,
} from "./attendanceModel";
import MonthGrid from "./MonthGrid";
import MyStatsCard from "./MyStatsCard";
import RaidDetailsDialog from "./RaidDetailsDialog";
import { useRaidDialogs } from "./useRaidDialogs";
import { useRangeRaids } from "./useRangeRaids";
import WeekView from "./WeekView";

type Props = {
  todayKey: string;
  initialRaids: RangeRaid[];
  currentUserId: number | null;
  canEditEvents: boolean;
  canEditScreenshots: boolean;
};

export default function AttendanceClient({
  todayKey,
  initialRaids,
  currentUserId,
  canEditEvents,
  canEditScreenshots,
}: Props) {
  const [view, setView] = useState<AttendanceView>("week");
  const [anchor, setAnchor] = useState(todayKey);
  const [filter, setFilter] = useState<KindFilter>(ALL_KINDS);
  const [attendedOnly, setAttendedOnly] = useState(false);
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const dialogs = useRaidDialogs();

  const range = view === "week" ? weekRange(anchor) : monthRange(anchor);
  const { raids, isLoaded, refresh } = useRangeRaids(
    `${view}:${range.from}`,
    range,
    {
      key: `week:${weekRange(todayKey).from}`,
      raids: initialRaids,
    },
  );

  const byDay = raidsByDay(filterRaids(raids, filter, attendedOnly));
  const statsRaids =
    view === "month"
      ? raids.filter((raid) => raid.start.startsWith(anchor.slice(0, 7)))
      : raids;

  const handleViewChange = (next: AttendanceView) => {
    setView(next);
    if (next === "week" && pickedDay) setAnchor(pickedDay);
  };

  const handleNavigate = (delta: number) => {
    setAnchor((current) => shiftAnchor(current, view, delta));
    setPickedDay(null);
  };

  const handleToday = () => {
    setAnchor(todayKey);
    setPickedDay(null);
  };

  const handleMonthDayPick = (day: string) => {
    setPickedDay(day);
    setAnchor(day);
    setView("week");
  };

  return (
    <div className="@container/att mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <AttendanceHeader
        canEditEvents={canEditEvents}
        canEditScreenshots={canEditScreenshots}
        onCreate={dialogs.startCreate}
      />

      <div className="grid items-start gap-3 @[60rem]/att:grid-cols-[minmax(0,1fr)_380px]">
        <MyStatsCard
          title={view === "week" ? "Моя неделя" : "Мой месяц"}
          stats={myStats(statsRaids, todayKey)}
        />
        <div className="flex flex-col gap-3">
          <MissingActivitiesBanner canEdit={canEditEvents} />
          {canEditScreenshots && (
            <RaidSuggestionsCard onRaidCreated={refresh} />
          )}
        </div>
      </div>

      <AttendanceToolbar
        view={view}
        range={range}
        anchor={anchor}
        todayKey={todayKey}
        isLoaded={isLoaded}
        filter={filter}
        attendedOnly={attendedOnly}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onToday={handleToday}
        onFilterChange={setFilter}
        onAttendedOnlyChange={setAttendedOnly}
      />

      {view === "week" && (
        <WeekView
          days={range.days}
          byDay={byDay}
          todayKey={todayKey}
          pickedDay={pickedDay}
          onDayPick={setPickedDay}
          onRaidOpen={dialogs.openRaid}
        />
      )}
      {view === "month" && (
        <MonthGrid
          days={range.days}
          byDay={byDay}
          anchorKey={anchor}
          todayKey={todayKey}
          onDayPick={handleMonthDayPick}
        />
      )}

      <EventDialog
        open={dialogs.editor.open}
        mode={dialogs.editor.mode}
        event={dialogs.editor.mode === "edit" ? dialogs.raid : null}
        onOpenChange={dialogs.setEditorOpen}
        onComplete={refresh}
      />
      <RaidDetailsDialog
        open={dialogs.infoOpen}
        onOpenChange={dialogs.setInfoOpen}
        raid={dialogs.raid}
        currentUserId={currentUserId}
        canEdit={canEditEvents}
        onEdit={dialogs.startEdit}
      />
    </div>
  );
}
