"use client";

import { useState } from "react";
import type { ItemType } from "../../GuildLoot/LootTypes";
import type { JournalDay } from "../journalModel";
import type { BossSales, MiscTotal } from "../treasuryModel";
import BossSalesCard from "./BossSalesCard";
import JournalFilters from "./JournalFilters";
import JournalList from "./JournalList";
import type { JournalFilter, RecordActions } from "./journalMeta";
import MiscCard from "./MiscCard";

type Props = RecordActions & {
  days: JournalDay[];
  misc: MiscTotal[];
  itemTypes: ItemType[];
  bossSales: BossSales[];
  isAdmin: boolean;
  loading: boolean;
  monthLabel: string;
  onMiscSet: (name: string, amount: number) => Promise<void>;
};

export default function JournalTab({
  days,
  misc,
  itemTypes,
  bossSales,
  isAdmin,
  loading,
  monthLabel,
  onMiscSet,
  ...actions
}: Props) {
  const [filter, setFilter] = useState<JournalFilter>("all");

  const filtered = days
    .map((day) => ({
      ...day,
      entries:
        filter === "all"
          ? day.entries
          : day.entries.filter((entry) => entry.kind === filter),
    }))
    .filter((day) => day.entries.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <JournalFilters filter={filter} onFilterChange={setFilter} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <JournalList
          key={filter}
          days={filtered}
          isAdmin={isAdmin}
          loading={loading}
          emptyText={
            filter === "all"
              ? `За ${monthLabel} записей нет`
              : "Таких записей в этом месяце нет"
          }
          {...actions}
        />
        <div className="flex min-w-0 flex-col gap-4 lg:max-w-sm lg:flex-1">
          <MiscCard
            misc={misc}
            itemTypes={itemTypes}
            isAdmin={isAdmin}
            monthLabel={monthLabel}
            onMiscSet={onMiscSet}
          />
          <BossSalesCard rows={bossSales} monthLabel={monthLabel} />
        </div>
      </div>
    </div>
  );
}
