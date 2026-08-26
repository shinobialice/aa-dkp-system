"use client";
import { useEffect, useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventDialog } from "./EventDialog";
import { RaidInfoDialog } from "./RaidInfoDialog";
import MissingActivitiesBanner from "./MissingActivitiesBanner";
import ScreenshotsLinkButton from "./ScreenshotsLinkButton";
import RaidSuggestionsCard from "./RaidSuggestionsCard";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { getRaids } from "@/actions/getEvents";
import { getRaidById } from "@/actions/getRaidById";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";

type Props = {
  isAdmin: boolean;
  isModerator?: boolean;
  isSecretutka?: boolean;
};

// Цвета назначаются в getEvents.ts по типу рейда/боссу — держим список типов
// здесь в том же порядке и с теми же значениями, чтобы легенда совпадала с
// фактической закраской событий и её можно было использовать как фильтр.
const RAID_TYPES = [
  { key: "prime", label: "Прайм", color: "rgb(157, 41, 41)" },
  { key: "agl", label: "АГЛ", color: "rgb(47, 158, 98)" },
  { key: "koshka", label: "Кошка", color: "rgb(215, 100, 168)" },
  { key: "morph", label: "Морф", color: "rgb(40, 111, 180)" },
  { key: "marli", label: "Марли Прок", color: "rgb(180, 108, 51)" },
  { key: "antallon", label: "Анталлон", color: "rgb(126, 34, 206)" },
  { key: "korvus", label: "Корвус", color: "rgb(178, 102, 236)" },
] as const;

const colorToRaidKey = new Map<string, string>(
  RAID_TYPES.map((rt) => [rt.color, rt.key]),
);

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
};

export default function CalendarView({
  isAdmin,
  isModerator,
  isSecretutka,
}: Props) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentRange, setCurrentRange] = useState("...");
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());

  const [openDialog, setOpenDialog] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const canEditEvents = isAdmin || isModerator || isSecretutka;

  const visibleEvents = events.filter((event) => {
    const key = colorToRaidKey.get(event.color);
    return !key || !hiddenTypes.has(key);
  });

  const toggleRaidType = (key: string) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleEventClick = async (info: any) => {
    const fullEvent = await getRaidById(info.event.id);
    setSelectedEvent(fullEvent);
    // Клик по событию всегда открывает обычный просмотр, как у рядовых
    // пользователей — редактирование теперь отдельным шагом по кнопке
    // внутри RaidInfoDialog (см. canEdit/onEdit), чтобы не открывать форму
    // редактирования сразу и не путать её с формой создания.
    setInfoDialogOpen(true);
  };

  const handleEditFromInfo = () => {
    setInfoDialogOpen(false);
    setOpenDialog(true);
  };

  useEffect(() => {
    getRaids().then(setEvents);
  }, []);

  useVisiblePolling(() => {
    getRaids().then(setEvents);
  }, 30_000);

  useEffect(() => {
    if (!infoDialogOpen || !selectedEvent?.id) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      getRaidById(selectedEvent.id).then(setSelectedEvent);
    }, 30_000);
    return () => clearInterval(interval);
  }, [infoDialogOpen, selectedEvent?.id]);

  const handleDateSet = (info: any) => {
    setCurrentView(info.view.type);
    if (info.view.type === "dayGridMonth") {
      const label = new Intl.DateTimeFormat("ru-RU", {
        month: "long",
        year: "numeric",
      }).format(info.view.currentStart);
      setCurrentRange(label.charAt(0).toUpperCase() + label.slice(1));
      return;
    }
    const start = new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(info.start);
    const end = new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(info.end.getTime() - 1));
    setCurrentRange(`${start} – ${end}`);
  };

  const handleNav = (
    action: "prev" | "next" | "today" | "week" | "monthGrid" | "list",
  ) => {
    const api = calendarRef.current?.getApi();
    if (!api) {
      return;
    }
    if (action === "prev") {
      api.prev();
    }
    if (action === "next") {
      api.next();
    }
    if (action === "today") {
      api.today();
    }
    if (action === "week") {
      api.changeView("timeGridWeek");
    }
    if (action === "monthGrid") {
      api.changeView("dayGridMonth");
    }
    if (action === "list") {
      api.changeView("listWeek");
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-background text-foreground">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Посещаемость</h1>
          <p className="text-sm text-muted-foreground">
            Календарь рейдов 
          </p>
        </div>
        {canEditEvents ? (
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={() => {
              setSelectedEvent(null);
              setOpenDialog(true);
            }}
          >
            Добавить посещение
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/40 p-2">
        <div className="inline-flex items-center gap-1 rounded-md border bg-background p-1">
          <Button
            size="sm"
            variant={currentView === "timeGridWeek" ? "default" : "ghost"}
            className="cursor-pointer"
            onClick={() => handleNav("week")}
          >
            Неделя
          </Button>
          <Button
            size="sm"
            variant={currentView === "dayGridMonth" ? "default" : "ghost"}
            className="cursor-pointer"
            onClick={() => handleNav("monthGrid")}
          >
            Месяц
          </Button>
          <Button
            size="sm"
            variant={currentView === "listWeek" ? "default" : "ghost"}
            className="cursor-pointer"
            onClick={() => handleNav("list")}
          >
            Список
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-nowrap text-sm font-semibold tabular-nums md:text-base">
            {currentRange}
          </span>
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() => handleNav("today")}
          >
            Сегодня
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleNav("prev")}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleNav("next")}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="flex flex-col gap-3 lg:w-64 lg:flex-none">
          <ScreenshotsLinkButton canEdit={isAdmin || !!isSecretutka} />

          <MissingActivitiesBanner />

          <div className="rounded-lg border bg-card p-3">
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Типы посещений
            </p>
            <div className="flex flex-col gap-0.5">
              {RAID_TYPES.map((raidType) => {
                const active = !hiddenTypes.has(raidType.key);
                return (
                  <button
                    key={raidType.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleRaidType(raidType.key)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      !active && "text-muted-foreground opacity-50",
                    )}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: raidType.color }}
                    />
                    <span className="flex-1">{raidType.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {(isAdmin || isSecretutka) && (
            <RaidSuggestionsCard onRaidCreated={() => getRaids().then(setEvents)} />
          )}
        </aside>

        <div
          className="min-w-0 flex-1 rounded-lg border bg-card p-3 shadow-sm"
          style={{ height: "80dvh" }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="timeGridWeek"
            events={visibleEvents}
            eventClick={handleEventClick}
            headerToolbar={false}
            height="100%"
            locale="ru-RU"
            firstDay={1}
            eventDisplay="block"
            nowIndicator
            scrollTime="24:00:00"
            slotDuration="00:30:00"
            slotLabelFormat={[
              {
                hour: "2-digit",
                hour12: false,
              },
            ]}
            dayHeaderFormat={{
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              omitCommas: true,
            }}
            views={{
              dayGridMonth: {
                dayHeaderFormat: { weekday: "short" },
              },
            }}
            dayHeaderClassNames="bg-card text-card-foreground"
            dayCellClassNames="bg-card"
            slotLabelClassNames="text-muted-foreground"
            allDaySlot={false}
            datesSet={handleDateSet}
          />
        </div>
      </div>

      {(selectedEvent || selectedEvent === null) && (
        <EventDialog
          mode={selectedEvent ? "edit" : "create"}
          open={openDialog}
          setOpen={setOpenDialog}
          selectedEvent={selectedEvent}
          onComplete={() => {
            setOpenDialog(false);
            setSelectedEvent(null);
            getRaids().then(setEvents);
          }}
        />
      )}

      <RaidInfoDialog
        open={infoDialogOpen}
        setOpen={setInfoDialogOpen}
        raid={selectedEvent}
        canEdit={canEditEvents}
        onEdit={handleEditFromInfo}
      />
    </div>
  );
}
