import { useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { Label, Segmented, Switch } from "@/shared/ui";
import {
  onlyDifferences,
  type CompareGroup,
  type CompareTab,
  type CompareTabKey,
} from "./compareModel";
import { DIFF_TONE_CLASS } from "./compareStyles";

type Props = {
  tabs: CompareTab[];
};

const ROW_GRID =
  "px-1 sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_7rem_8rem] sm:items-center sm:gap-3";

const VALUES_GRID = "grid grid-cols-3 gap-3 sm:contents";

export default function CompareTable({ tabs }: Props) {
  const [tabKey, setTabKey] = useState<CompareTabKey>("main");
  const [isOnlyDiff, setOnlyDiff] = useState(false);
  const tab = tabs.find((item) => item.key === tabKey) ?? tabs[0];
  const groups = isOnlyDiff ? onlyDifferences(tab.groups) : tab.groups;
  const options = tabs.map((item) => ({
    value: item.key,
    label: <TabLabel title={item.title} diffCount={item.diffCount} />,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Группы характеристик"
          value={tabKey}
          onChange={setTabKey}
          options={options}
        />
        <Label className="cursor-pointer font-normal">
          <Switch checked={isOnlyDiff} onCheckedChange={setOnlyDiff} />
          Только отличия
        </Label>
      </div>

      <div>
        <div
          className={cn(
            ROW_GRID,
            "border-b pb-2 text-xs font-medium text-muted-foreground",
          )}
        >
          <span className="hidden sm:block">Характеристика</span>
          <span className={VALUES_GRID}>
            <span className="text-right">A</span>
            <span className="text-right">B</span>
            <span className="text-right">Разница A − B</span>
          </span>
        </div>
        {groups.map((group, index) => (
          <GroupRows key={`${tab.key}-${index}`} group={group} />
        ))}
        {groups.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            В этой группе сборки не отличаются
          </p>
        )}
      </div>
    </div>
  );
}

function TabLabel({ title, diffCount }: { title: string; diffCount: number }) {
  return (
    <>
      {title}
      {diffCount > 0 && (
        <span className="rounded-full bg-muted-foreground/15 px-1.5 text-2xs leading-4 font-semibold">
          {diffCount}
        </span>
      )}
    </>
  );
}

function GroupRows({ group }: { group: CompareGroup }) {
  return (
    <div className="flex flex-col">
      <div className="min-h-3 px-1 pt-4 pb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {group.title}
      </div>
      {group.rows.map((row, index) => (
        <div
          key={`${row.label}-${index}`}
          className={cn(
            ROW_GRID,
            "min-h-8 border-b border-border/60 py-1.5 text-sm sm:py-0",
          )}
        >
          <span className="block">{row.label}</span>
          <span className={VALUES_GRID}>
            <span className="text-right tabular-nums">{row.a}</span>
            <span className="text-right tabular-nums">{row.b}</span>
            <span
              className={cn(
                "text-right font-semibold tabular-nums",
                DIFF_TONE_CLASS[row.tone],
              )}
            >
              {row.diff}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
