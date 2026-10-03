"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui";
import { useStickyBar } from "@/hooks/useStickyBar";
import GiveawayRoster from "./GiveawayRoster";
import GiveawayPlayerPanel from "./GiveawayPlayerPanel";
import GiveawayFilterBar from "./GiveawayFilterBar";
import type { Player, TrackedItem } from "./giveawayModel";
import { filterRoster, type RosterQuery } from "./rosterFilters";
import { buildGiveawayActions } from "./giveawayActions";

const WIDE_LAYOUT_PX = 960;
const SIDE_SHEET_PX = 640;

type Props = {
  items: TrackedItem[];
  initialPlayers: Player[];
  isAdmin: boolean;
  currentUserId: number | null;
};

export default function LootGiveaway({
  items,
  initialPlayers,
  isAdmin,
  currentUserId,
}: Props) {
  const [players, setPlayers] = useState(initialPlayers);
  const [query, setQuery] = useState<RosterQuery>({
    showInactive: false,
    search: "",
    filter: "all",
    itemName: null,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<"bottom" | "right">("bottom");
  const { containerRef, barRef, sentinelRef, scrollToListTop } =
    useStickyBar("--give-bar");

  const { displayed, counts } = useMemo(
    () => filterRoster(players, query),
    [players, query],
  );
  const me = players.find((player) => player.id === currentUserId);
  const activeId = selectedId ?? me?.id ?? displayed[0]?.id ?? null;
  const selected = players.find((player) => player.id === activeId) ?? null;
  const actions = buildGiveawayActions(players, setPlayers, selected);

  const updateQuery = (patch: Partial<RosterQuery>) => {
    setQuery((current) => ({ ...current, ...patch }));
    if (!("showInactive" in patch)) scrollToListTop();
  };

  const selectItem = (name: string | null) =>
    updateQuery(name ? { itemName: name, filter: "all" } : { itemName: null });

  const selectPlayer = (id: number) => {
    if (id !== activeId) setEditMode(false);
    setSelectedId(id);
    const width = containerRef.current?.clientWidth ?? 0;
    if (width >= WIDE_LAYOUT_PX) return;
    setSheetSide(window.innerWidth >= SIDE_SHEET_PX ? "right" : "bottom");
    setSheetOpen(true);
  };

  const panelProps = selected &&
    actions && {
      player: selected,
      items,
      isAdmin,
      editMode,
      onToggleEdit: () => setEditMode((value) => !value),
      actions,
    };

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Раздача лута</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Что гильдия уже выдала, у кого предмет есть и так, и кто его хочет.
          Нажмите на иконку предмета в шапке таблицы, чтобы увидеть, кто его
          хочет, или на игрока — чтобы увидеть его выдачи.
        </p>
      </div>

      <div ref={sentinelRef} aria-hidden className="-mb-4 h-0" />
      <GiveawayFilterBar
        barRef={barRef}
        query={query}
        counts={counts}
        onChange={updateQuery}
      />

      <div className="grid items-start gap-4 min-[960px]:grid-cols-[minmax(0,1fr)_360px]">
        <GiveawayRoster
          items={items}
          players={displayed}
          selectedId={activeId}
          highlightedName={query.itemName}
          onSelectItem={selectItem}
          onSelect={selectPlayer}
        />
        {panelProps && (
          <aside
            aria-label="Игрок"
            className="sticky top-[calc(var(--give-bar,0px)+1rem)] hidden max-h-[calc(100dvh-var(--give-bar,0px)-2rem)] flex-col overflow-hidden rounded-xl border bg-card min-[960px]:flex"
          >
            <GiveawayPlayerPanel key={panelProps.player.id} {...panelProps} />
          </aside>
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side={sheetSide}
          className={cn(
            "gap-0 overflow-y-auto p-0",
            sheetSide === "bottom"
              ? "max-h-[88dvh] rounded-t-2xl"
              : "w-full sm:max-w-md",
          )}
        >
          <SheetTitle className="sr-only">
            {selected ? selected.username : "Игрок"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Выданный лут, прочее и хотелки игрока
          </SheetDescription>
          {panelProps && (
            <GiveawayPlayerPanel
              key={panelProps.player.id}
              {...panelProps}
              inSheet
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
