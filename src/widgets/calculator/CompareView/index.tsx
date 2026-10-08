import type { ReactNode } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { Card } from "@/shared/ui";
import { computeProfileStats } from "@/widgets/profile/equipment/statComparison";
import type { CalculatorBuild, TrackedBuild } from "../calculatorModel";
import type { BuildSide } from "../useCalculator";
import BuildCard from "./BuildCard";
import CompareTable from "./CompareTable";
import CompareTiles from "./CompareTiles";
import { buildCompareTabs, buildCompareTiles } from "./compareModel";
import { LETTER_CLASS, type BuildLetter } from "./compareStyles";

type Props = {
  doll: TrackedBuild;
  target: TrackedBuild;
  dollMenu: ReactNode;
  targetMenu: ReactNode;
  dollSave: ReactNode;
  targetSave: ReactNode;
  onUpdate: (side: BuildSide, patch: Partial<CalculatorBuild>) => void;
  onReset: (side: BuildSide) => void;
  onStopComparing: () => void;
};

export default function CompareView({
  doll,
  target,
  dollMenu,
  targetMenu,
  dollSave,
  targetSave,
  onUpdate,
  onReset,
  onStopComparing,
}: Props) {
  const dollSide = {
    build: doll.current,
    stats: computeProfileStats(doll.current, {}),
  };
  const targetSide = {
    build: target.current,
    stats: computeProfileStats(target.current, {}),
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <BuildCard
          letter="A"
          caption="Кукла"
          tracked={doll}
          stats={dollSide.stats}
          menu={dollMenu}
          saveButton={dollSave}
          onUpdate={(patch) => onUpdate("doll", patch)}
          onReset={() => onReset("doll")}
        />
        <BuildCard
          letter="B"
          caption="Сравнить с"
          tracked={target}
          stats={targetSide.stats}
          menu={targetMenu}
          saveButton={targetSave}
          onUpdate={(patch) => onUpdate("target", patch)}
          onReset={() => onReset("target")}
          onRemove={onStopComparing}
        />
      </div>

      <Card className="gap-5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h2 className="text-lg font-bold">Сравнение</h2>
          <LegendItem letter="A" name={doll.current.name} />
          <LegendItem letter="B" name={target.current.name} />
        </div>
        <CompareTiles tiles={buildCompareTiles(dollSide, targetSide)} />
        <CompareTable
          tabs={buildCompareTabs(dollSide.stats, targetSide.stats)}
        />
      </Card>
    </div>
  );
}

function LegendItem({ letter, name }: { letter: BuildLetter; name: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
      <span
        className={cn("size-2.5 shrink-0 rounded-sm", LETTER_CLASS[letter])}
      />
      <span className="truncate">
        {letter} — {name}
      </span>
    </span>
  );
}
