import { X } from "lucide-react";
import { Button, Input, Label } from "@/shared/ui";

type Props = {
  inputId: string;
  label: string;
  name: string;
  hint: string;
  ended: boolean;
  disabled: boolean;
  autoFocus?: boolean;
  onNameChange: (name: string) => void;
  onToggleEnded: () => void;
  onRemove?: () => void;
};

export default function OpponentField({
  inputId,
  label,
  name,
  hint,
  ended,
  disabled,
  autoFocus,
  onNameChange,
  onToggleEnded,
  onRemove,
}: Props) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={inputId}
          autoFocus={autoFocus}
          value={name}
          placeholder="Название гильдии"
          className={ended ? "text-muted-foreground" : undefined}
          disabled={disabled}
          onChange={(event) => onNameChange(event.target.value)}
        />
        <FieldAction
          ended={ended}
          disabled={disabled}
          onToggleEnded={onToggleEnded}
          onRemove={onRemove}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

type FieldActionProps = Pick<
  Props,
  "ended" | "disabled" | "onToggleEnded" | "onRemove"
>;

function FieldAction({
  ended,
  disabled,
  onToggleEnded,
  onRemove,
}: FieldActionProps) {
  if (onRemove) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 cursor-pointer text-muted-foreground"
        aria-label="Убрать строку"
        disabled={disabled}
        onClick={onRemove}
      >
        <X className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant={ended ? "secondary" : "outline"}
      size="sm"
      className="w-24 shrink-0 cursor-pointer"
      disabled={disabled}
      onClick={onToggleEnded}
    >
      {ended ? "Вернуть" : "Слились"}
    </Button>
  );
}
