import CountUp from "@/widgets/arena/CountUp";

type Props = {
  label: string;
  value: number | null;
  hint?: string | null;
  delayS: number;
};

export default function ScoreTile({ label, value, hint, delayS }: Props) {
  return (
    <div
      className="arena-enter min-w-0 border border-l-[3px] border-l-green-500 bg-card px-4 py-3.5"
      style={{ animationDelay: `${delayS}s` }}
    >
      <p className="text-2xs tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-display text-[clamp(24px,3.2vw,34px)] leading-tight tabular-nums">
        {value === null ? "—" : <CountUp value={value} />}
      </p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
