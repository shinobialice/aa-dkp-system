import { Clock } from "lucide-react";
import { Button } from "@/shared/ui";
import DateTimePopover from "@/widgets/calendar/DateTimePopover";

export default function MaintenanceExtendButton({
  onPick,
}: {
  onPick: (date: Date) => void;
}) {
  return (
    <DateTimePopover value={null} onChange={(date) => date && onPick(date)}>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        title="Продлить до выбранного времени"
      >
        <Clock className="size-4" />
        Продлить
      </Button>
    </DateTimePopover>
  );
}
