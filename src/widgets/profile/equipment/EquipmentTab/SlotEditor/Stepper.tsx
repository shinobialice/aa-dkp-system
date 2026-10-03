import FieldLabel from "./FieldLabel";

type Props = {
  label: string;
  hint: string;
  value: number;
  max: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
  showMax?: boolean;
};

const STEP_BUTTON_CLASS =
  "flex h-full w-10 cursor-pointer items-center justify-center text-lg hover:bg-muted disabled:cursor-default disabled:opacity-40";

export default function Stepper({
  label,
  hint,
  value,
  max,
  format,
  onChange,
  showMax,
}: Props) {
  const set = (next: number) => onChange(Math.max(0, Math.min(max, next)));

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="flex h-10 items-center overflow-hidden rounded-lg border bg-input/30">
        <button
          type="button"
          aria-label={`${label}: меньше`}
          onClick={() => set(value - 1)}
          disabled={value <= 0}
          className={STEP_BUTTON_CLASS}
        >
          −
        </button>
        <span className="flex-1 text-center text-base font-extrabold tabular-nums">
          {format(value)}
        </span>
        <button
          type="button"
          aria-label={`${label}: больше`}
          onClick={() => set(value + 1)}
          disabled={value >= max}
          className={STEP_BUTTON_CLASS}
        >
          +
        </button>
      </div>
      {showMax && (
        <div className="flex items-center gap-2">
          <span className="block h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-green-500"
              style={{ width: `${max ? (value / max) * 100 : 0}%` }}
            />
          </span>
          <button
            type="button"
            onClick={() => set(max)}
            className="cursor-pointer text-xs font-semibold text-green-500 hover:underline"
          >
            Макс
          </button>
        </div>
      )}
    </div>
  );
}
