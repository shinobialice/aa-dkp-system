"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { getRaidsInRange, type RangeRaid } from "@/actions/getRaidsInRange";
import { getRaidById } from "@/actions/getRaidById";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import { EventDialog } from "@/widgets/calendar/EventDialog";
import MissingActivitiesBanner from "@/widgets/calendar/MissingActivitiesBanner";
import RaidSuggestionsCard from "@/widgets/calendar/RaidSuggestionsCard";
import ScreenshotsLinkButton from "@/widgets/calendar/ScreenshotsLinkButton";
import {
  DayList,
  MonthGrid,
  MyStatsCard,
  WeekColumns,
} from "./AttendanceParts";
import { RaidDetailsDialog, type RaidDetails } from "./RaidDetailsDialog";
import {
  filterRaids,
  formatDay,
  KINDS,
  monthRange,
  myStats,
  raidsByDay,
  rangeLabel,
  shiftAnchor,
  SHORT_DAYS,
  WEEK_DAYS,
  weekRange,
  type AttendanceView,
  type KindFilter,
  type RaidKind,
} from "./attendanceModel";

type Loaded = { key: string; raids: RangeRaid[] };

export default function AttendanceClient({
  todayKey,
  initialRaids,
  currentUserId,
  canEditEvents,
  canEditScreenshots,
}: {
  todayKey: string;
  initialRaids: RangeRaid[];
  currentUserId: number | null;
  canEditEvents: boolean;
  canEditScreenshots: boolean;
}) {
  const [view, setView] = useState<AttendanceView>("week");
  const [anchor, setAnchor] = useState(todayKey);
  const [filter, setFilter] = useState<KindFilter>({
    prime: true,
    agl: true,
    koshka: true,
    morph: true,
    marli: true,
  });
  const [attendedOnly, setAttendedOnly] = useState(false);
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Loaded>(() => ({
    key: `week:${weekRange(todayKey).from}`,
    raids: initialRaids,
  }));
  const [raid, setRaid] = useState<RaidDetails | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");

  const range = view === "week" ? weekRange(anchor) : monthRange(anchor);
  const requestKey = `${view}:${range.from}`;
  const isLoaded = loaded.key === requestKey;
  const raids = isLoaded ? loaded.raids : [];

  const load = (key: string, from: string, to: string) =>
    getRaidsInRange(from, to).then((result) =>
      setLoaded({ key, raids: result }),
    );

  useEffect(() => {
    if (loaded.key === requestKey) return;
    let cancelled = false;
    getRaidsInRange(range.from, range.to).then((result) => {
      if (!cancelled) setLoaded({ key: requestKey, raids: result });
    });
    return () => {
      cancelled = true;
    };
  }, [requestKey, range.from, range.to, loaded.key]);

  useVisiblePolling(() => {
    load(requestKey, range.from, range.to);
  }, 30_000);

  const visible = filterRaids(raids, filter, attendedOnly);
  const byDay = raidsByDay(visible);
  const stats = myStats(
    view === "month"
      ? raids.filter((raid) => raid.start.startsWith(anchor.slice(0, 7)))
      : raids,
    todayKey,
  );
  const inThisWeek = range.days.includes(todayKey);
  const selectedDay =
    pickedDay && range.days.includes(pickedDay)
      ? pickedDay
      : inThisWeek
        ? todayKey
        : range.days[0];

  const openRaid = async (id: number) => {
    const details = (await getRaidById(String(id))) as RaidDetails;
    setRaid(details);
    setInfoOpen(true);
  };

  const refreshAll = () => load(requestKey, range.from, range.to);

  const changeView = (next: AttendanceView) => {
    setView(next);
    if (next === "week" && pickedDay) setAnchor(pickedDay);
  };

  const navigate = (delta: number) => {
    setAnchor((current) => shiftAnchor(current, view, delta));
    setPickedDay(null);
  };

  const goToday = () => {
    setAnchor(todayKey);
    setPickedDay(null);
  };

  const toggleKind = (kind: RaidKind) =>
    setFilter((previous) => ({ ...previous, [kind]: !previous[kind] }));

  return (
    <div className="@container/att mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
            Посещаемость
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Рейды гильдии и кто на них был · время московское
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <div className="w-full min-w-0 sm:w-auto">
            <ScreenshotsLinkButton canEdit={canEditScreenshots} />
          </div>
          {canEditEvents && (
            <Button
              className="w-full cursor-pointer sm:w-auto"
              onClick={() => {
                setRaid(null);
                setEditMode("create");
                setEditOpen(true);
              }}
            >
              <Plus />
              Добавить посещение
            </Button>
          )}
        </div>
      </div>

      <div className="grid items-start gap-3 @[60rem]/att:grid-cols-[minmax(0,1fr)_380px]">
        <MyStatsCard
          title={view === "week" ? "Моя неделя" : "Мой месяц"}
          stats={stats}
        />
        <div className="flex flex-col gap-3">
          <MissingActivitiesBanner canEdit={canEditEvents} />
          {canEditScreenshots && (
            <RaidSuggestionsCard onRaidCreated={refreshAll} />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="tablist"
          aria-label="Вид"
          className="inline-flex gap-0.5 rounded-lg bg-muted p-[3px]"
        >
          {(
            [
              ["week", "Неделя"],
              ["month", "Месяц"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              onClick={() => changeView(key)}
              className={cn(
                "h-8 cursor-pointer rounded-md px-3.5 text-[13px] font-semibold transition-colors",
                view === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Назад"
            onClick={() => navigate(-1)}
            className="size-8 cursor-pointer"
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-40 text-center font-semibold tabular-nums">
            {rangeLabel(view, range, anchor)}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Вперёд"
            onClick={() => navigate(1)}
            className="size-8 cursor-pointer"
          >
            <ChevronRight />
          </Button>
          {!range.days.includes(todayKey) && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToday}
              className="ml-1 h-8 cursor-pointer"
            >
              Сегодня
            </Button>
          )}
          {!isLoaded && (
            <Loader2 className="ml-1 size-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="-mx-4 flex w-[calc(100%+2rem)] gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:px-0 @[60rem]/att:ml-auto">
          {KINDS.map(({ kind, label, dot }) => (
            <button
              key={kind}
              type="button"
              aria-pressed={filter[kind]}
              onClick={() => toggleKind(kind)}
              className={cn(
                "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-[12.5px] font-medium whitespace-nowrap transition-colors sm:h-[30px]",
                filter[kind]
                  ? "bg-background text-foreground"
                  : "bg-muted/50 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  dot,
                  !filter[kind] && "opacity-0",
                )}
              />
              {label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={attendedOnly}
            onClick={() => setAttendedOnly((value) => !value)}
            className={cn(
              "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full border px-2.5 text-[12.5px] font-medium whitespace-nowrap transition-colors sm:h-[30px]",
              attendedOnly
                ? "border-foreground bg-foreground text-background"
                : "bg-background hover:bg-muted",
            )}
          >
            Где я был
          </button>
        </div>
      </div>

      {view === "week" ? (
        <>
          <div className="hidden flex-col gap-2 @[60rem]/att:flex">
            <WeekColumns
              days={range.days}
              byDay={byDay}
              todayKey={todayKey}
              onOpen={openRaid}
            />
            <div className="flex flex-wrap gap-3.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-[3px] border border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10" />
                Вы были
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-[3px] border bg-card" />
                Не были
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-[3px] border border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10" />
                Рейд создан, участники ещё не добавлены
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 @[60rem]/att:hidden">
            <div
              role="tablist"
              aria-label="День недели"
              className="grid grid-cols-7 gap-1"
            >
              {range.days.map((day, index) => {
                const selected = day === selectedDay;
                const today = day === todayKey;
                return (
                  <button
                    key={day}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={WEEK_DAYS[index]}
                    onClick={() => setPickedDay(day)}
                    className={cn(
                      "flex h-[50px] cursor-pointer flex-col items-center justify-center rounded-lg border leading-tight transition-colors",
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : today
                          ? "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300"
                          : day > todayKey
                            ? "bg-background text-muted-foreground"
                            : "bg-background hover:bg-muted",
                    )}
                  >
                    <span className="text-xs font-semibold">
                      {SHORT_DAYS[index]}
                    </span>
                    <span className="text-[15px] font-bold">
                      {Number(day.slice(8))}
                    </span>
                  </button>
                );
              })}
            </div>
            <h2 className="px-0.5 text-base font-bold">
              {WEEK_DAYS[range.days.indexOf(selectedDay)]},{" "}
              {formatDay(selectedDay, { day: "numeric", month: "long" })}
            </h2>
            <DayList
              raids={byDay.get(selectedDay) ?? []}
              future={selectedDay > todayKey}
              onOpen={openRaid}
            />
          </div>
        </>
      ) : (
        <MonthGrid
          days={range.days}
          byDay={byDay}
          anchorKey={anchor}
          todayKey={todayKey}
          onPickDay={(day) => {
            setPickedDay(day);
            setAnchor(day);
            setView("week");
          }}
        />
      )}

      <EventDialog
        mode={editMode}
        open={editOpen}
        setOpen={setEditOpen}
        selectedEvent={editMode === "edit" ? raid : null}
        onComplete={() => {
          setEditOpen(false);
          refreshAll();
        }}
      />

      <RaidDetailsDialog
        open={infoOpen}
        setOpen={setInfoOpen}
        raid={raid}
        currentUserId={currentUserId}
        canEdit={canEditEvents}
        onEdit={() => {
          setInfoOpen(false);
          setEditMode("edit");
          setEditOpen(true);
        }}
      />
    </div>
  );
}
