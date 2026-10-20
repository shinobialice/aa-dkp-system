import { Input } from "@/shared/ui";
import { joinDuration, splitDuration } from "../raidScanModel";

type Props = {
  durationMinutes: number | null;
  isPvpPrime: boolean;
  hasError: boolean;
  onChange: (durationMinutes: number | null) => void;
};

export default function DurationField({
  durationMinutes,
  isPvpPrime,
  hasError,
  onChange,
}: Props) {
  const { hours, minutes } = splitDuration(durationMinutes);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        Сколько шёл рейд
      </span>
      <div className="flex items-center gap-2 text-sm">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={24}
          aria-label="Часы"
          aria-invalid={hasError}
          value={hours}
          onChange={(event) =>
            onChange(joinDuration(event.target.value, minutes))
          }
          className="w-16 tabular-nums"
        />
        ч
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          aria-label="Минуты"
          aria-invalid={hasError}
          value={minutes}
          onChange={(event) =>
            onChange(joinDuration(hours, event.target.value))
          }
          className="w-16 tabular-nums"
        />
        мин
      </div>
      {hasError && (
        <p className="text-xs text-destructive">Укажите, сколько шёл прайм</p>
      )}
      {isPvpPrime && (
        <p className="text-xs text-muted-foreground">
          Каждый получает очки за каждые начатые полчаса в рейде
        </p>
      )}
    </div>
  );
}
