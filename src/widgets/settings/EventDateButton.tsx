import { Button } from "@/shared/ui";
import DateTimePopover from "@/widgets/calendar/DateTimePopover";
import { formatMoscowDateTime } from "@/shared/lib/format";

type Props = {
  value: string | null;
  label: string;
  onChange: (iso: string | null) => void;
};

export default function EventDateButton({ value, label, onChange }: Props) {
  return (
    <DateTimePopover
      value={value ? new Date(value) : null}
      onChange={(date) => onChange(date ? date.toISOString() : null)}
    >
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        aria-label={label}
      >
        {value ? formatMoscowDateTime(value) : "Выбрать"}
      </Button>
    </DateTimePopover>
  );
}
