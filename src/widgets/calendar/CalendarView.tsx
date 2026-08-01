"use client";
import { useEffect, useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChevronLeft, ChevronRight, Table, Calendar1 } from "lucide-react";
import { EventDialog } from "./EventDialog";
import { RaidInfoDialog } from "./RaidInfoDialog";
import MissingActivitiesBanner from "./MissingActivitiesBanner";
import { Button } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { getRaids } from "@/actions/getEvents";
import { getRaidById } from "@/actions/getRaidById";

type Props = {
  isAdmin: boolean;
  isModerator?: boolean;
};

export default function CalendarView({ isAdmin, isModerator }: Props) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentRange, setCurrentRange] = useState("...");
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      start: string;
      end: string;
      color: string;
    }[]
  >([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const canEditEvents = isAdmin || isModerator;

  const handleEventClick = async (info: any) => {
    const fullEvent = await getRaidById(info.event.id);
    setSelectedEvent(fullEvent);
    if (canEditEvents) {
      setOpenDialog(true);
    } else {
      setInfoDialogOpen(true);
    }
  };

  useEffect(() => {
    getRaids().then(setEvents);
    const interval = setInterval(() => {
      getRaids().then(setEvents);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!infoDialogOpen || !selectedEvent?.id) return;
    const interval = setInterval(async () => {
      const fresh = await getRaidById(selectedEvent.id);
      setSelectedEvent(fresh);
    }, 10000);
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
    <div className="flex min-h-screen flex-col bg-background text-onBackground">
      <div className="flex-1">
        <h1 className="text-3xl font-bold ml-6 mb-4 text-primary">
          Календарь активностей
        </h1>
        <MissingActivitiesBanner />
        <div className="flex justify-end mb-4 space-x-2 mr-6">
          <Button
            variant="outline"
            className="hidden md:flex cursor-pointer"
            onClick={() => handleNav("list")}
          >
            <Table className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden md:flex cursor-pointer"
            onClick={() => handleNav("week")}
          >
            <Calendar1 className="size-4" />
          </Button>
          {isAdmin || isModerator ? (
            <Button
              className="cursor-pointer"
              variant="default"
              onClick={() => {
                setSelectedEvent(null);
                setOpenDialog(true);
              }}
            >
              Добавить активность
            </Button>
          ) : null}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex w-full flex-wrap items-center justify-between max-md:pb-2">
            <div className="w-full max-w-40" />
            <span className="text-nowrap font-semibold md:text-xl">
              {currentRange}
            </span>
            <div className="flex items-end gap-2 mr-6">
              {currentView !== "listWeek" ? (
                <Select
                  defaultValue="weekGrid"
                  onValueChange={(value) => {
                    if (value === "weekGrid") {
                      handleNav("week");
                    }
                    if (value === "monthGrid") {
                      handleNav("monthGrid");
                    }
                  }}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Неделя" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekGrid">Неделя</SelectItem>
                    <SelectItem value="monthGrid">Месяц</SelectItem>
                  </SelectContent>
                </Select>
              ) : null}
              <Button
                className="cursor-pointer"
                onClick={() => handleNav("today")}
              >
                Сегодня
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => handleNav("prev")}
              >
                <ChevronLeft />
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => handleNav("next")}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 shadow-md" style={{ height: "80dvh" }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="timeGridWeek"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={false}
            height="100%"
            locale="ru-RU"
            firstDay={1}
            eventDisplay="block"
            nowIndicator
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
            dayHeaderClassNames="bg-primaryVariant text-onPrimary"
            dayCellClassNames="bg-surface"
            slotLabelClassNames="text-onSurface"
            allDaySlot={false}
            datesSet={handleDateSet}
          />
        </div>

        <div className="flex flex-wrap gap-4 ml-6">
          {[
            { color: "rgb(157, 41, 41)", label: "Прайм" },
            { color: "rgb(47, 158, 98)", label: "АГЛ" },
            { color: "rgb(215, 100, 168)", label: "Кошка" },
            { color: "rgb(40, 111, 180)", label: "Морф" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-onSurface">{item.label}</span>
            </div>
          ))}
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
        />
      </div>
    </div>
  );
}
