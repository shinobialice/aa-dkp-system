import { Check, Dices, Pencil } from "lucide-react";
import { Button } from "@/shared/ui";

export default function AdminToolbar({
  editing,
  canRoll,
  busy,
  onRoll,
  onToggleEditing,
}: {
  editing: boolean;
  canRoll: boolean;
  busy: boolean;
  onRoll: () => void;
  onToggleEditing: () => void;
}) {
  return (
    <div className="flex gap-1.5">
      {canRoll && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRoll}
          disabled={busy}
          className="cursor-pointer"
        >
          <Dices /> Ролл
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleEditing}
        className="cursor-pointer"
      >
        {editing ? <Check /> : <Pencil />}
        {editing ? "Готово" : "Редактировать"}
      </Button>
    </div>
  );
}
