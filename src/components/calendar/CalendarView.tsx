"use client";
import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChevronLeft, ChevronRight, Table, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateEvent } from "./CreateEvent";

export default function ActivitiesPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentRange, setCurrentRange] = useState("...");

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
    action: "prev" | "next" | "today" | "week" | "month" | "list"
  ) => {
    const api = calendarRef.current?.getApi();
    if (api) {
      if (action === "prev") api.prev();
      if (action === "next") api.next();
      if (action === "today") api.today();
      if (action === "week") api.changeView("timeGridWeek");
      if (action === "month") api.changeView("dayGridMonth");
      if (action === "list") api.changeView("listWeek");
    }
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
            className="hidden md:flex"
            onClick={() => handleNav("list")}
          >
            <Table className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden md:flex"
            onClick={() => handleNav("list")}
          >
            <Calendar className="size-4" />
          </Button>
          <CreateEvent />
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex w-full flex-wrap items-center justify-between max-md:pb-2">
            <div className="w-full max-w-40" />
            <span className="text-nowrap font-semibold md:text-xl">
              {currentRange}
            </span>

            <div className="flex items-end gap-2 mr-6">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Неделя" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="weekGrid"
                    onClick={() => handleNav("week")}
                  >
                    Неделя
                  </SelectItem>
                  <SelectItem
                    value="monthGrid"
                    onClick={() => handleNav("month")}
                  >
                    Месяц
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleNav("today")}>Сегодня</Button>
              <Button onClick={() => handleNav("prev")}>
                <ChevronLeft />
              </Button>
              <Button onClick={() => handleNav("next")}>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-surface p-6 shadow-md" style={{ height: "80dvh" }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={calendarEvents}
            eventClick={(info) => alert(`Event: ${info.event.title}`)}
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
      </div>
    </div>
  );
}


const calendarEvents = [
  {
    title: "Прайм",
    start: "2025-04-30T19:00:00",
    end: "2025-04-30T20:00:00",
    color: "rgb(90, 54, 165)",
  },
  {
    title: "АГЛ",
    start: "2025-05-01T20:00:00",
    end: "2025-05-01T21:00:00",
    color: "rgb(215, 100, 168)",
  },
  {
    title: "Кошка",
    start: "2025-05-02T21:00:00",
    end: "2025-05-02T22:00:00",
    color: "rgb(232, 157, 53)",
  },
];
