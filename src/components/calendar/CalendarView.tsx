"use client";
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { ChevronLeft, ChevronRight, Table, Calendar1 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRaids } from "@/src/actions/getEvents";
import { EventDialog } from "./EventDialog";
import { getRaidById } from "@/src/actions/getRaidById";
import { useUserTag } from "@/src/hooks/useUserTag";

export default function ActivitiesPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentRange, setCurrentRange] = useState("...");
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
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const isAdmin = useUserTag("Администратор");
  const isModerator = useUserTag("Модератор");
  const canEditEvents = isAdmin && isModerator;

  const handleEventClick = async (info: any) => {
    const fullEvent = await getRaidById(info.event.id);
    setSelectedEvent(fullEvent);
    setOpenDialog(true);
  };

  useEffect(() => {
    getRaids().then(setEvents);
  }, []);

  const handleDateSet = (info: any) => {
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
    action: "prev" | "next" | "today" | "week" | "monthGrid" | "list"
  ) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (action === "prev") api.prev();
    if (action === "next") api.next();
    if (action === "today") api.today();
    if (action === "week") api.changeView("timeGridWeek");
    if (action === "monthGrid") api.changeView("dayGridMonth");
    if (action === "list") api.changeView("listWeek");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground">
      <div className="flex-1">
        <h1 className="text-3xl font-bold ml-6 text-primary">
          Календарь активностей
        </h1>
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
          {isAdmin && isModerator && (
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
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex w-full flex-wrap items-center justify-between max-md:pb-2">
            <div className="w-full max-w-40" />
            <span className="text-nowrap font-semibold md:text-xl">
              {currentRange}
            </span>
            <div className="flex items-end gap-2 mr-6">
              <Select
                defaultValue="weekGrid"
                onValueChange={(value) => {
                  if (value === "weekGrid") handleNav("week");
                  if (value === "monthGrid") handleNav("monthGrid");
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
            eventClick={canEditEvents ? handleEventClick : undefined}
            headerToolbar={false}
            height="100%"
            locale="ru-RU"
            eventDisplay="block"
            nowIndicator={true}
            slotDuration="00:30:00"
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            dayHeaderFormat={{
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              omitCommas: true,
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
            { color: "rgb(90, 54, 165)", label: "Прайм" },
            { color: "rgb(215, 100, 168)", label: "АГЛ" },
            { color: "rgb(232, 157, 53)", label: "Кошка" },
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
      </div>
    </div>
  );
}
