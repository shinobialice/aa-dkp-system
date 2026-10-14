import type { PromoQuest } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { characterScore, dayScore, type DoneMarks } from "./promoQuestsModel";
import QuestRow from "./QuestRow";
import { dayCellClass, formatDayNumber, weekDays } from "./promoWeeks";

type Props = {
  quests: PromoQuest[];
  weekStart: string;
  characterId: number | null;
  server: string | null;
  marks: DoneMarks;
  todayIndex: number | null;
  mobileDay: number;
  onToggle: (quest: PromoQuest, dayIndex: number, isDone: boolean) => void;
};

export default function QuestTable({
  quests,
  weekStart,
  characterId,
  server,
  marks,
  todayIndex,
  mobileDay,
  onToggle,
}: Props) {
  const days = weekDays(weekStart);

  return (
    <div className="promo-rise overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4 sm:min-w-64">Квест</TableHead>
            <TableHead className="text-center">Баллы</TableHead>
            {days.map((day) => (
              <TableHead
                key={day.key}
                className={cn(
                  "h-auto py-1.5 text-center leading-tight",
                  dayCellClass(day.index, todayIndex, mobileDay),
                )}
              >
                {day.name}
                <span className="block text-xs font-normal text-muted-foreground tabular-nums">
                  {formatDayNumber(day.key)}
                </span>
              </TableHead>
            ))}
            <TableHead className="pr-4 text-right">Итого</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quests.map((quest) => (
            <QuestRow
              key={quest.id}
              quest={quest}
              characterId={characterId}
              server={server}
              days={days}
              marks={marks}
              todayIndex={todayIndex}
              mobileDay={mobileDay}
              onToggle={onToggle}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="pl-4">
              За день
            </TableCell>
            {days.map((day) => (
              <TableCell
                key={day.key}
                className={cn(
                  "text-center tabular-nums",
                  dayCellClass(day.index, todayIndex, mobileDay),
                )}
              >
                {dayScore(marks, characterId, quests, day.index)}
              </TableCell>
            ))}
            <TableCell className="pr-4 text-right font-bold tabular-nums">
              {characterScore(marks, characterId, quests)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
