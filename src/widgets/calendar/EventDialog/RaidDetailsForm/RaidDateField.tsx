import MskDateTimePicker from "@/widgets/calendar/MskDateTimePicker";
import type { EventFormMode } from "../eventFormModel";
import ScheduledDateTimePicker from "../ScheduledDateTimePicker";

type Props = {
  mode: EventFormMode;
  category: string | null;
  selectedBoss: string | null;
  value: Date | null;
  hasError: boolean;
  onChange: (date: Date | null) => void;
};

export default function RaidDateField({
  mode,
  category,
  selectedBoss,
  value,
  hasError,
  onChange,
}: Props) {
  const picker =
    mode === "edit" ? (
      <MskDateTimePicker value={value} onChange={onChange} />
    ) : (
      <ScheduledDateTimePicker
        key={`${category ?? ""}-${selectedBoss ?? ""}`}
        category={category}
        selectedBoss={selectedBoss}
        value={value}
        onChange={onChange}
      />
    );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        Дата и время, МСК
      </span>
      {picker}
      {hasError && (
        <p className="text-xs text-destructive">Укажите дату и время</p>
      )}
    </div>
  );
}
