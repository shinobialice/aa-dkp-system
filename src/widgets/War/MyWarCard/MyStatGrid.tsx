type Props = {
  stats: { label: string; value: string }[];
};

export default function MyStatGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-muted/70 px-3 py-2.5">
          <p className="font-display text-[22px] leading-tight tabular-nums">
            {stat.value}
          </p>
          <p className="text-2xs tracking-wider text-muted-foreground uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
