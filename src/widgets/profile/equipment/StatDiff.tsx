import { isLowerBetter, statDiff } from "./statComparison";

type Props = {
  label: string;
  viewer: number | undefined;
  owner: number;
  decimals: number;
};

const BETTER_COLOR = "#22c55e";
const WORSE_COLOR = "#ef4444";

export default function StatDiff({ label, viewer, owner, decimals }: Props) {
  if (viewer === undefined) return null;
  const diff = statDiff(viewer, owner, decimals);
  if (diff === 0) return null;

  const isBetter = isLowerBetter(label) ? diff < 0 : diff > 0;
  return (
    <span
      className="text-2xs font-semibold whitespace-nowrap tabular-nums"
      style={{ color: isBetter ? BETTER_COLOR : WORSE_COLOR }}
      title="Разница с вашим персонажем"
    >
      {diff > 0 ? "▲" : "▼"}
      {Math.abs(diff).toFixed(decimals)}
    </span>
  );
}
