import { cn } from "@/shared/lib/tw-merge";
import StatRow from "./StatRow";
import type { StatLine } from "./statSections";

type Props = {
  lines: StatLine[];
  viewerLines: StatLine[] | null;
  className?: string;
};

export default function StatList({ lines, viewerLines, className }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {lines.map((line) => (
        <StatRow
          key={line.label}
          line={line}
          viewerAmount={
            viewerLines?.find((other) => other.label === line.label)?.amount
          }
        />
      ))}
    </div>
  );
}
