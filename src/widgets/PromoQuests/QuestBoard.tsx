"use client";

import type { ReactNode } from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import type { PromoQuest } from "@/shared/config/promoQuests";
import { Segmented } from "@/shared/ui";
import QuestCard from "./QuestCard";
import type { DoneMarks } from "./promoQuestsModel";
import { formatDayNumber, type PromoDay } from "./promoWeeks";
import QuestTable from "./QuestTable";
import { useQuestView, type QuestView } from "./useQuestView";

type Props = {
  quests: PromoQuest[];
  weekStart: string;
  days: PromoDay[];
  selectedDay: number;
  characterId: number | null;
  server: string | null;
  marks: DoneMarks;
  todayIndex: number | null;
  onToggle: (quest: PromoQuest, dayIndex: number, isDone: boolean) => void;
};

const VIEW_OPTIONS: { value: QuestView; label: ReactNode }[] = [
  {
    value: "cards",
    label: (
      <>
        <LayoutGrid className="size-3.5" />
        Карточки
      </>
    ),
  },
  {
    value: "table",
    label: (
      <>
        <Table2 className="size-3.5" />
        Таблица
      </>
    ),
  },
];

export default function QuestBoard({
  quests,
  weekStart,
  days,
  selectedDay,
  characterId,
  server,
  marks,
  todayIndex,
  onToggle,
}: Props) {
  const { view, setView } = useQuestView();
  const day = days[selectedDay];
  const title =
    view === "cards"
      ? `Квесты: ${day.name}, ${formatDayNumber(day.key)}`
      : "Квесты недели";

  const content =
    view === "cards" ? (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quests.map((quest, order) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            order={order}
            days={days}
            selectedDay={selectedDay}
            characterId={characterId}
            server={server}
            marks={marks}
            todayIndex={todayIndex}
            onToggle={onToggle}
          />
        ))}
      </div>
    ) : (
      <QuestTable
        quests={quests}
        weekStart={weekStart}
        characterId={characterId}
        server={server}
        marks={marks}
        todayIndex={todayIndex}
        mobileDay={selectedDay}
        onToggle={onToggle}
      />
    );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        <Segmented
          label="Вид списка квестов"
          value={view}
          options={VIEW_OPTIONS}
          onChange={setView}
        />
      </div>
      {content}
    </section>
  );
}
