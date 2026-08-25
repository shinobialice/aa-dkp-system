"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/ui";
import { DateTimePicker } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  getFixedTimesForBoss,
  getTakenAglTimesForDate,
} from "@/actions/getBossSchedule";
import { LOCKED_SINGLE_TIME_PRIME_BOSSES } from "@/utils/lockedBosses";
import { getMoscowISOString, parseMoscowISOString } from "@/utils/getMoscowISOString";
import { getMoscowWeekday } from "@/utils/weekday";
import DatetimePicker from "./DateTimePicker";

type Mode = "free" | "locked-single" | "agl-slots" | "cat-toggle";

function getMode(category: string | null, selectedBoss: string | null): Mode {
  if (category === "Прайм" && selectedBoss && LOCKED_SINGLE_TIME_PRIME_BOSSES.includes(selectedBoss)) {
    return "locked-single";
  }
  if (category === "АГЛ" && selectedBoss === "АГЛ") return "agl-slots";
  if (category === "АГЛ" && selectedBoss === "Кошка") return "cat-toggle";
  return "free";
}

function combineDateAndTime(dateOnly: Date, hhmm: string): Date {
  const dayIso = getMoscowISOString(dateOnly).slice(0, 10);
  return parseMoscowISOString(`${dayIso}T${hhmm}:00`);
}

// Обёртка над свободным DateTimePicker: для боссов с жёстким расписанием
// (см. week_schedule_event) даёт выбрать только дату, а время подставляет
// сама — по факту выбора даты (Кракен/Калидис/Анталлон/Левиафан/Ксанатос),
// выбором из доступных слотов дня (АГЛ — плюс исключает уже занятые в этот
// день) или переключателем утро/вечер (Кошка). Для всех остальных боссов —
// поведение не меняется, используется тот же свободный пикер, что и раньше.
//
// Специально не применяется в режиме редактирования существующего рейда
// (см. mode в RaidDetailsForm) — расписание могло измениться с момента
// создания исторического рейда, и мы не хотим тихо переписывать уже
// сохранённое время при открытии формы редактирования.
export function ScheduledDateTimePicker({
  category,
  selectedBoss,
  value,
  onChange,
}: {
  category: string | null;
  selectedBoss: string | null;
  value: Date | null;
  onChange: (date: Date | null) => void;
}) {
  const mode = useMemo(() => getMode(category, selectedBoss), [category, selectedBoss]);

  const [dateOnly, setDateOnly] = useState<Date | null>(value);
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [takenTimes, setTakenTimes] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);

  const weekday = dateOnly ? getMoscowWeekday(dateOnly) : null;

  // Ключ текущего выбора (босс/дата/день недели). Пока эффект ниже не
  // подтвердил его через confirmedKey, считаем результат ещё не готовым —
  // без этого на один кадр между сменой даты/босса и запуском эффекта
  // рендерились старые times от предыдущего выбора, и если они оказывались
  // пустыми, успевал мелькнуть красный текст "не рейдится в этот день"
  // прежде, чем эффект перезапрашивал расписание и показывал лоадер.
  const [confirmedKey, setConfirmedKey] = useState<string | null>(null);
  const currentKey =
    mode !== "free" && dateOnly && selectedBoss && weekday
      ? `${mode}::${dateOnly.getTime()}::${selectedBoss}::${weekday}`
      : null;
  const isPendingKey = currentKey !== null && confirmedKey !== currentKey;

  useEffect(() => {
    if (mode === "free" || !dateOnly || !selectedBoss || !weekday) return;

    let cancelled = false;

    (async () => {
      setConfirmedKey(currentKey);
      setLoading(true);
      setSelectedTime(null);
      setLoadError(false);
      try {
        const fixed = await getFixedTimesForBoss(selectedBoss, weekday);
        if (cancelled) return;
        setTimes(fixed);

        if (mode === "agl-slots") {
          const taken = await getTakenAglTimesForDate(dateOnly);
          if (cancelled) return;
          setTakenTimes(taken);
        } else {
          setTakenTimes([]);
        }

        if (mode === "locked-single" && fixed.length > 0) {
          setSelectedTime(fixed[0]);
          onChange(combineDateAndTime(dateOnly, fixed[0]));
        } else {
          onChange(null);
        }
      } catch (error) {
        // Не даём сетевому/БД-сбою выглядеть как "босс не рейдится в этот
        // день" — times остался бы пустым и отрисовался бы тот же текст,
        // хотя на самом деле расписание просто не удалось загрузить.
        console.error("Не удалось загрузить расписание босса:", error);
        if (!cancelled) {
          setTimes([]);
          setTakenTimes([]);
          setLoadError(true);
          onChange(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, dateOnly?.getTime(), selectedBoss, weekday]);

  if (mode === "free") {
    return <DatetimePicker value={value} onChange={onChange} />;
  }

  const availableTimes =
    mode === "agl-slots" ? times.filter((t) => !takenTimes.includes(t)) : times;

  const handleDateOnlyChange = (d: Date | undefined) => {
    setDateOnly(d ?? null);
    onChange(null);
  };

  const handleTimeSelect = (t: string) => {
    if (!dateOnly) return;
    setSelectedTime(t);
    onChange(combineDateAndTime(dateOnly, t));
  };

  return (
    <div className="flex flex-col gap-2">
      <DateTimePicker
        hideTime
        timezone="Europe/Moscow"
        value={dateOnly ?? undefined}
        onChange={handleDateOnlyChange}
        classNames={{ trigger: "w-[270px]" }}
      />

      {(loading || isPendingKey) && dateOnly && (
        <p className="text-sm text-muted-foreground">Загрузка расписания...</p>
      )}

      {!loading && !isPendingKey && loadError && dateOnly && (
        <p className="text-sm text-red-500">
          Не удалось загрузить расписание — попробуйте выбрать дату ещё раз
        </p>
      )}

      {!loading && !isPendingKey && !loadError && mode === "locked-single" && dateOnly && (
        times.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Время зафиксировано: <strong>{times[0]}</strong> (по расписанию)
          </p>
        ) : (
          <p className="text-sm text-red-500">
            {selectedBoss} не рейдится в этот день недели — выберите другую дату
          </p>
        )
      )}

      {!loading && !isPendingKey && !loadError && mode === "agl-slots" && dateOnly && (
        availableTimes.length > 0 ? (
          <Select value={selectedTime ?? undefined} onValueChange={handleTimeSelect}>
            <SelectTrigger className="w-[270px]">
              <SelectValue placeholder="Выберите время" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-red-500">
            Все слоты АГЛ на эту дату уже заняты
          </p>
        )
      )}

      {!loading && !isPendingKey && !loadError && mode === "cat-toggle" && dateOnly && (
        times.length > 0 ? (
          <div className="flex gap-2">
            {times.map((t, idx) => (
              <Button
                key={t}
                type="button"
                variant={selectedTime === t ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTimeSelect(t)}
              >
                {idx === 0 ? "Утро" : "Вечер"} ({t})
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-red-500">
            Кошка не рейдится в этот день недели — выберите другую дату
          </p>
        )
      )}
    </div>
  );
}
