import { bossColorStyle } from "@/widgets/Attendance/raidKinds";

type Props = {
  category: string | null;
  selectedBoss: string | null;
  bossNames: string[];
  bonusLabels: string[];
  dkp: number;
};

export default function RaidValueSummary({
  category,
  selectedBoss,
  bossNames,
  bonusLabels,
  dkp,
}: Props) {
  const colorStyle =
    selectedBoss && category
      ? bossColorStyle(selectedBoss, category)
      : undefined;
  const caption =
    bossNames.length > 0
      ? [bossNames.join(", "), ...bonusLabels].join(" · ")
      : "Выберите босса";

  return (
    <div
      style={colorStyle}
      className="flex items-center justify-between gap-3 rounded-xl bg-[color-mix(in_srgb,var(--raid-color,#71717a)_8%,transparent)] px-3.5 py-3"
    >
      <span className="flex min-w-0 flex-col">
        <span className="text-xs text-foreground/70">Ценность посещения</span>
        <span className="truncate text-xs text-muted-foreground">
          {caption}
        </span>
      </span>
      <span className="text-2xl leading-none font-extrabold text-[var(--raid-color,currentColor)] tabular-nums dark:text-[var(--raid-color-dark,currentColor)]">
        {dkp}
      </span>
    </div>
  );
}
