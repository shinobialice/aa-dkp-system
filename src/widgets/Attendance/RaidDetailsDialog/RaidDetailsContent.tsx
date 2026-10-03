"use client";

import { useState } from "react";
import { Check, Pencil, Search } from "lucide-react";
import type { RaidDetails } from "@/actions/getRaidById";
import { cn } from "@/shared/lib/tw-merge";
import { Button, Segmented } from "@/shared/ui";
import AttendeeGroups from "./AttendeeGroups";
import RaidDetailsHeader from "./RaidDetailsHeader";
import RaidLootTab from "./RaidLootTab";
import RaidStats from "./RaidStats";

type Tab = "people" | "loot";

type Props = {
  raid: RaidDetails;
  currentUserId: number | null;
  canEdit: boolean;
  onEdit: () => void;
};

export default function RaidDetailsContent({
  raid,
  currentUserId,
  canEdit,
  onEdit,
}: Props) {
  const [tab, setTab] = useState<Tab>("people");
  const [search, setSearch] = useState("");

  const attendees = raid.raid_attendance;
  const attended = attendees.some(
    (attendee) => attendee.user.id === currentUserId,
  );
  const loot = raid.loot.filter((item) => item.status !== "Распродано");
  const showLoot = raid.type !== "АГЛ";
  const activeTab = showLoot ? tab : "people";
  const tabs = [
    { value: "people" as const, label: `Участники ${attendees.length}` },
    ...(showLoot
      ? [{ value: "loot" as const, label: `Лут ${loot.length}` }]
      : []),
  ];

  return (
    <>
      <RaidDetailsHeader raid={raid} />
      <RaidStats
        attendees={attendees.length}
        total={raid.guildActiveMembersAtTime}
        dkp={raid.dkp_summary ?? 0}
        late={attendees.filter((attendee) => attendee.is_late).length}
      />

      {attendees.length > 0 && (
        <div
          className={cn(
            "mx-5 mt-2.5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
            attended
              ? "bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-300"
              : "bg-muted/60 text-muted-foreground",
          )}
        >
          {attended && <Check className="size-4" />}
          {attended ? "Вы были на этом рейде" : "Вас не было на этом рейде"}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 px-5 pt-3.5 pb-2">
        <Segmented
          label="Раздел рейда"
          value={activeTab}
          onChange={setTab}
          options={tabs}
        />
        {activeTab === "people" && attendees.length > 0 && (
          <label className="relative ml-auto flex w-full items-center sm:w-56">
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Найти игрока"
              aria-label="Найти игрока"
              className="h-9 w-full rounded-lg border bg-background pr-2 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </label>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        {activeTab === "people" && (
          <AttendeeGroups
            attendees={attendees}
            search={search}
            currentUserId={currentUserId}
          />
        )}
        {activeTab === "loot" && <RaidLootTab loot={loot} />}
      </div>

      {canEdit && (
        <div className="flex justify-end border-t px-5 py-3">
          <Button variant="outline" onClick={onEdit} className="cursor-pointer">
            <Pencil />
            Редактировать
          </Button>
        </div>
      )}
    </>
  );
}
