import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui";
import {
  rangeLabel,
  type AttendanceView,
  type DateRange,
} from "./attendanceModel";

type Props = {
  view: AttendanceView;
  range: DateRange;
  anchor: string;
  showToday: boolean;
  isLoaded: boolean;
  onNavigate: (delta: number) => void;
  onToday: () => void;
};

export default function RangeNavigator({
  view,
  range,
  anchor,
  showToday,
  isLoaded,
  onNavigate,
  onToday,
}: Props) {
  return (
    <div className="inline-flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        aria-label="Назад"
        onClick={() => onNavigate(-1)}
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
        onClick={() => onNavigate(1)}
        className="size-8 cursor-pointer"
      >
        <ChevronRight />
      </Button>
      {showToday && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="ml-1 h-8 cursor-pointer"
        >
          Сегодня
        </Button>
      )}
      {!isLoaded && (
        <Loader2 className="ml-1 size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
