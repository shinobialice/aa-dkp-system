import { formatNumber } from "@/shared/lib/format";

export default function Range({ from, to }: { from: number; to: number }) {
  return (
    <span className="block font-mono text-2xs text-muted-foreground">
      {formatNumber(from)} → {formatNumber(to)}
    </span>
  );
}
