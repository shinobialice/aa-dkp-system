import { Segmented } from "@/shared/ui";
import type { AttendanceView, DateRange, KindFilter } from "./attendanceModel";
import KindFilterChips from "./KindFilterChips";
import RangeNavigator from "./RangeNavigator";

type Props = {
  view: AttendanceView;
  range: DateRange;
  anchor: string;
  todayKey: string;
  isLoaded: boolean;
  filter: KindFilter;
  attendedOnly: boolean;
  onViewChange: (view: AttendanceView) => void;
  onNavigate: (delta: number) => void;
  onToday: () => void;
  onFilterChange: (filter: KindFilter) => void;
  onAttendedOnlyChange: (attendedOnly: boolean) => void;
};

export default function AttendanceToolbar({
  view,
  range,
  anchor,
  todayKey,
  isLoaded,
  filter,
  attendedOnly,
  onViewChange,
  onNavigate,
  onToday,
  onFilterChange,
  onAttendedOnlyChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented
        label="Вид"
        value={view}
        onChange={onViewChange}
        options={[
          { value: "week", label: "Неделя" },
          { value: "month", label: "Месяц" },
        ]}
      />
      <RangeNavigator
        view={view}
        range={range}
        anchor={anchor}
        showToday={!range.days.includes(todayKey)}
        isLoaded={isLoaded}
        onNavigate={onNavigate}
        onToday={onToday}
      />
      <KindFilterChips
        filter={filter}
        attendedOnly={attendedOnly}
        onFilterChange={onFilterChange}
        onAttendedOnlyChange={onAttendedOnlyChange}
      />
    </div>
  );
}
