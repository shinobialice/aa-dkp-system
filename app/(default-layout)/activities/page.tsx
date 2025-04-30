"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function ActivitiesPage() {
  const [calendarEvents, setCalendarEvents] = useState([
    {
      title: "АГЛ",
      date: "2025-04-27T07:20:00",
      description: "АГЛ",
      color: "rgb(215, 100, 168)",
      textColor: "#E9E4FF",
    },
    {
      title: "АГЛ",
      date: "2025-04-27T11:20:00",
      description: "АГЛ",
      color: "rgb(215, 100, 168)",
      textColor: "#E9E4FF",
    },
    {
      title: "АГЛ",
      date: "2025-04-27T15:20:00",
      description: "АГЛ",
      color: "rgb(215, 100, 168)",
      textColor: "#E9E4FF",
    },
    {
      title: "Прайм",
      date: "2025-04-27T19:20:00",
      description: "Прайм",
      color: "rgb(90, 54, 165)",
      textColor: "#E9E4FF",
    },
    {
      title: "Кошка",
      date: "2025-04-27T22:00:00",
      description: "АГЛ",
      color: "rgb(232, 157, 53)",
      textColor: "#E9E4FF",
    },
    {
      title: "АГЛ",
      date: "2025-04-27T23:20:00",
      description: "АГЛ",
      color: "rgb(215, 100, 168)",
      textColor: "#E9E4FF",
    },
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-bgMain text-onBackground">
      {/* Основной контент */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Календарь активностей
        </h1>

        {/* Календарь */}
        <div className="bg-surface  p-6 shadow-md" style={{ height: "80dvh" }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={calendarEvents}
            eventClick={(info) => alert(`Event: ${info.event.title}`)}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
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
          />
        </div>

        {/* Легенда под календарём */}
        <div className="flex flex-wrap gap-4 mt-8 ml-6">
          {[
            { color: "rgb(90, 54, 165)", label: "Прайм" },
            { color: "rgb(215, 100, 168)", label: "АГЛ" },
            { color: "rgb(232, 157, 53)", label: "Кошка" },
            // { color: "rgb(201, 52, 52)", label: "World Boss" },
            // { color: "rgb(47, 158, 98)", label: "Arch Boss" },
            // { color: "rgb(0, 148, 168)", label: "Boonstone" },
            // { color: "rgb(157, 41, 41)", label: "War" },
            // { color: "rgb(40, 111, 180)", label: "Siege" },
            // { color: "rgb(138, 81, 184)", label: "Guild Contract" },
            // { color: "rgb(58, 76, 92)", label: "Raid" },
            // { color: "rgb(23, 133, 115)", label: "Tax Delivery" },
            // { color: "rgb(184, 92, 52)", label: "War Games" },
            // { color: "rgb(57, 74, 53)", label: "Other" },
            // { color: "rgb(0, 128, 128)", label: "Lawless Wilds" },
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
