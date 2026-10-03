import { Check, Clock } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { classColors } from "@/widgets/MembersTable/classStyles";
import type { PickerUser } from "../eventFormModel";

type Props = {
  user: PickerUser;
  selected: boolean;
  late: boolean;
  onToggle: () => void;
  onLateToggle: () => void;
};

export default function ParticipantChip({
  user,
  selected,
  late,
  onToggle,
  onLateToggle,
}: Props) {
  const color = user.class ? classColors[user.class] : undefined;
  const tinted = selected && color;
  const chipStyle = tinted
    ? {
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
      }
    : undefined;
  const checkStyle = tinted
    ? { backgroundColor: color, borderColor: color }
    : undefined;
  const lateBorderStyle = color
    ? { borderColor: `color-mix(in srgb, ${color} 50%, transparent)` }
    : undefined;

  return (
    <span
      style={chipStyle}
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full border",
        selected ? "border-foreground/30 bg-muted" : "bg-background",
      )}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onToggle}
        className={cn(
          "inline-flex h-8 cursor-pointer items-center gap-1.5 pr-2.5 pl-2 text-sm font-medium",
          !selected && "text-muted-foreground hover:text-foreground",
        )}
      >
        <span
          style={checkStyle}
          className={cn(
            "flex size-4 items-center justify-center rounded border-[1.5px] text-white",
            selected
              ? "border-foreground bg-foreground"
              : "border-muted-foreground/40",
          )}
        >
          {selected && <Check className="size-3" />}
        </span>
        {user.username}
        {user.inactive && (
          <span className="text-2xs font-normal text-muted-foreground">
            не активен
          </span>
        )}
      </button>
      {selected && (
        <button
          type="button"
          aria-pressed={late}
          aria-label={
            late
              ? `${user.username}: опоздал, снять`
              : `${user.username}: отметить опоздание`
          }
          title={late ? "Опоздал — снять" : "Отметить опоздание"}
          onClick={onLateToggle}
          style={lateBorderStyle}
          className={cn(
            "flex h-8 w-7.5 cursor-pointer items-center justify-center border-l",
            late
              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              : "text-muted-foreground/60 hover:text-foreground",
          )}
        >
          <Clock className="size-3.5" />
        </button>
      )}
    </span>
  );
}
