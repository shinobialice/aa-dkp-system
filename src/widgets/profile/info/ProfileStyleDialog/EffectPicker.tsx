import {
  PROFILE_EFFECTS,
  type ProfileEffect,
} from "@/shared/config/profileStyle";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  value: ProfileEffect | null;
  onChange: (effect: ProfileEffect | null) => void;
};

const OPTIONS: { value: ProfileEffect | null; label: string }[] = [
  { value: null, label: "Без эффекта" },
  ...PROFILE_EFFECTS,
];

export default function EffectPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-11 cursor-pointer rounded-lg border px-3 text-sm font-medium",
              value === option.value && "border-primary ring-2 ring-primary/40",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Эффект видно в предпросмотре выше. Его не будет у тех, кто выключил
        анимации в системе.
      </p>
    </div>
  );
}
