import type { PromoQuest } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import { Checkbox, TableCell, TableRow } from "@/shared/ui";
import BossTimer from "./BossTimer";
import PointsGem from "./PointsGem";
import {
  isQuestDone,
  questDoneCount,
  type DoneMarks,
} from "./promoQuestsModel";
import { dayCellClass, type PromoDay } from "./promoWeeks";
import QuestVoucher from "./QuestVoucher";

type Props = {
  quest: PromoQuest;
  characterId: number | null;
  server: string | null;
  days: PromoDay[];
  marks: DoneMarks;
  todayIndex: number | null;
  mobileDay: number;
  onToggle: (quest: PromoQuest, dayIndex: number, isDone: boolean) => void;
};

export default function QuestRow({
  quest,
  characterId,
  server,
  days,
  marks,
  todayIndex,
  mobileDay,
  onToggle,
}: Props) {
  const isCurrentWeek = todayIndex !== null;

  return (
    <TableRow>
      <TableCell className="pl-4 whitespace-normal">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{quest.name}</span>
          <span className="text-xs text-muted-foreground">{quest.hint}</span>
          {quest.bossHour !== undefined && isCurrentWeek && (
            <BossTimer gameHour={quest.bossHour} />
          )}
          {quest.voucher && (
            <QuestVoucher voucher={quest.voucher} server={server} />
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <PointsGem points={quest.points} />
      </TableCell>
      {days.map((day) => (
        <TableCell
          key={day.key}
          className={cn(
            "text-center",
            dayCellClass(day.index, todayIndex, mobileDay),
          )}
        >
          <Checkbox
            className="size-5 cursor-pointer"
            aria-label={`${quest.name}, ${day.name}`}
            disabled={characterId === null}
            checked={isQuestDone(marks, characterId, quest.id, day.index)}
            onCheckedChange={(checked) =>
              onToggle(quest, day.index, checked === true)
            }
          />
        </TableCell>
      ))}
      <TableCell className="pr-4 text-right font-semibold tabular-nums">
        {quest.points * questDoneCount(marks, characterId, quest.id)}
      </TableCell>
    </TableRow>
  );
}
