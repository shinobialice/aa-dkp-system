"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/tw-merge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Switch,
} from "@/shared/ui";
import { saveGivenAwayLoot } from "@/actions/saveGivenAwayLoot";
import {
  addMiscLootGrant,
  deleteMiscLootGrant,
} from "@/actions/miscLootGrants";
import { addWishlistItem, deleteWishlistItem } from "@/actions/lootWishlist";
import { GiveawayStatusIcon } from "./GiveawayStatusIcon";
import GiveawayItemTiles from "./GiveawayItemTiles";
import GiveawayRoster from "./GiveawayRoster";
import GiveawayPlayerPanel, {
  type PlayerPanelActions,
} from "./GiveawayPlayerPanel";
import {
  countStatuses,
  formatDate,
  matchesFilter,
  sortForItem,
  todayIso,
  type GiveawayStatus,
  type Player,
  type PlayerItem,
  type RosterFilter,
  type TrackedItem,
} from "./giveawayModel";

const WIDE_LAYOUT_PX = 960;

const FILTERS: { key: RosterFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "want", label: "Хотят" },
  { key: "stock", label: "В наличии" },
];

function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors sm:h-8",
        active
          ? "border-foreground bg-foreground text-background"
          : "bg-background text-foreground/80 hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Попробуйте ещё раз";
}

export default function LootGiveaway({
  items,
  initialPlayers,
  isAdmin,
  currentUserId,
}: {
  items: TrackedItem[];
  initialPlayers: Player[];
  isAdmin: boolean;
  currentUserId: number | null;
}) {
  const [players, setPlayers] = useState(initialPlayers);
  const [showInactive, setShowInactive] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RosterFilter>("all");
  const [itemName, setItemName] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<"bottom" | "right">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !bar || !sentinel) return;
    const resize = new ResizeObserver(() => {
      container.style.setProperty("--give-bar", `${bar.offsetHeight}px`);
    });
    resize.observe(bar);
    const stuck = new IntersectionObserver(([entry]) => {
      bar.dataset.stuck = String(!entry.isIntersecting);
    });
    stuck.observe(sentinel);
    return () => {
      resize.disconnect();
      stuck.disconnect();
    };
  }, []);

  const scrollToListTop = () => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const top = sentinel.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: top + window.scrollY });
  };

  const roster = useMemo(
    () => players.filter((p) => p.active || showInactive),
    [players, showInactive],
  );
  const searched = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? roster.filter((p) => p.username.toLowerCase().includes(term))
      : roster;
  }, [roster, search]);
  const displayed = useMemo(
    () =>
      sortForItem(
        searched.filter((p) => matchesFilter(p, filter, itemName)),
        itemName,
      ),
    [searched, filter, itemName],
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        items.map((item) => [item.name, countStatuses(roster, item.name)]),
      ),
    [items, roster],
  );
  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map(({ key }) => [
          key,
          searched.filter((p) => matchesFilter(p, key, itemName)).length,
        ]),
      ) as Record<RosterFilter, number>,
    [searched, itemName],
  );

  const me = players.find((p) => p.id === currentUserId) ?? null;
  const myItems = me
    ? me.items
        .map((entry, index) => ({ entry, item: items[index] }))
        .filter(({ entry }) => entry.status)
    : [];

  const activeId = selectedId ?? me?.id ?? displayed[0]?.id ?? null;
  const selected = players.find((p) => p.id === activeId) ?? null;

  const selectPlayer = (id: number) => {
    if (id !== activeId) setEditMode(false);
    setSelectedId(id);
    const width = containerRef.current?.clientWidth ?? 0;
    if (width >= WIDE_LAYOUT_PX) return;
    setSheetSide(window.innerWidth >= 640 ? "right" : "bottom");
    setSheetOpen(true);
  };

  const selectItem = (name: string | null) => {
    setItemName(name);
    if (name) setFilter("all");
    scrollToListTop();
  };

  const updatePlayer = (id: number, update: (player: Player) => Player) => {
    setPlayers((previous) =>
      previous.map((p) => (p.id === id ? update(p) : p)),
    );
  };

  const saveItem = (playerId: number, next: PlayerItem) => {
    const previous = players
      .find((p) => p.id === playerId)
      ?.items.find((i) => i.name === next.name);
    const setItem = (value: PlayerItem) =>
      updatePlayer(playerId, (p) => ({
        ...p,
        items: p.items.map((i) => (i.name === value.name ? value : i)),
      }));
    setItem(next);
    saveGivenAwayLoot(playerId, {
      name: next.name,
      date: next.date || todayIso(),
      status: next.status,
    }).catch((error) => {
      if (previous) setItem(previous);
      toast.error("Не удалось сохранить", { description: errorText(error) });
    });
  };

  const actions: PlayerPanelActions | null = selected && {
    onStatusChange: (name: string, status: GiveawayStatus) => {
      const current = selected.items.find((i) => i.name === name);
      saveItem(selected.id, {
        name,
        status,
        date:
          status === "Выдано"
            ? current?.date || todayIso()
            : (current?.date ?? ""),
      });
    },
    onDateChange: (name: string, date: string) => {
      const current = selected.items.find((i) => i.name === name);
      if (!current) return;
      saveItem(selected.id, { ...current, date });
    },
    onAddMiscGrant: async (grant) => {
      try {
        const created = await addMiscLootGrant(selected.id, grant);
        updatePlayer(selected.id, (p) => ({
          ...p,
          miscGrants: [...p.miscGrants, created].sort((a, b) =>
            a.date.localeCompare(b.date),
          ),
        }));
      } catch (error) {
        toast.error("Не удалось добавить", { description: errorText(error) });
      }
    },
    onRemoveMiscGrant: (id: number) => {
      const before = selected.miscGrants;
      updatePlayer(selected.id, (p) => ({
        ...p,
        miscGrants: p.miscGrants.filter((g) => g.id !== id),
      }));
      deleteMiscLootGrant(id).catch((error) => {
        updatePlayer(selected.id, (p) => ({ ...p, miscGrants: before }));
        toast.error("Не удалось удалить", { description: errorText(error) });
      });
    },
    onAddWishlistItem: async (item) => {
      try {
        const created = await addWishlistItem(selected.id, item);
        updatePlayer(selected.id, (p) => ({
          ...p,
          wishlist: [...p.wishlist, created],
        }));
      } catch (error) {
        toast.error("Не удалось добавить", { description: errorText(error) });
      }
    },
    onRemoveWishlistItem: (id: number) => {
      const before = selected.wishlist;
      updatePlayer(selected.id, (p) => ({
        ...p,
        wishlist: p.wishlist.filter((w) => w.id !== id),
      }));
      deleteWishlistItem(id).catch((error) => {
        updatePlayer(selected.id, (p) => ({ ...p, wishlist: before }));
        toast.error("Не удалось удалить", { description: errorText(error) });
      });
    },
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
          Раздача лута
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Что гильдия уже выдала, у кого предмет есть и так, и кто его хочет.
          Выберите предмет, чтобы увидеть, кто его хочет, или игрока — чтобы
          увидеть его выдачи.
        </p>
      </div>

      {me && myItems.length > 0 && (
        <section
          aria-label="Мой лут"
          className="flex flex-col gap-2 rounded-xl border border-green-200 bg-green-50 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:px-4 dark:border-green-500/25 dark:bg-green-500/5"
        >
          <span className="text-[13px] font-semibold text-green-700 dark:text-green-400">
            Мой лут
          </span>
          {myItems.map(({ entry, item }) => {
            const waiting =
              entry.status === "Хочет" ? (counts[item.name]?.want ?? 0) : 0;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => selectItem(item.name)}
                className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-green-200 bg-background py-1.5 pr-3 pl-1.5 text-left hover:bg-green-50/50 dark:border-green-500/25"
              >
                <GiveawayStatusIcon
                  item={item}
                  status={entry.status}
                  date={entry.date}
                  size={30}
                  tooltip={false}
                />
                <span className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold">{item.name}</span>
                  <span className="text-xs text-green-800 dark:text-green-300">
                    {entry.status === "Выдано"
                      ? `выдано ${formatDate(entry.date)}`
                      : entry.status === "В наличии"
                        ? "уже есть, гильдия не выдавала"
                        : `вы в списке «хотят» · всего ${waiting}`}
                  </span>
                </span>
              </button>
            );
          })}
        </section>
      )}

      <GiveawayItemTiles
        items={items}
        counts={counts}
        selectedName={itemName}
        onSelect={selectItem}
      />

      <div ref={sentinelRef} aria-hidden className="-mb-4 h-0" />
      <div
        ref={barRef}
        data-stuck="false"
        className="sticky top-0 z-20 -mx-4 flex flex-col gap-2 border-b border-transparent bg-background/95 px-4 py-2.5 backdrop-blur transition-[border-color,box-shadow] data-[stuck=true]:border-border data-[stuck=true]:shadow-sm sm:-mx-8 sm:px-8 lg:flex-row lg:items-center"
      >
        <label className="relative flex w-full shrink-0 items-center lg:w-52">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              scrollToListTop();
            }}
            placeholder="Поиск по нику"
            aria-label="Поиск по нику"
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </label>
        <div className="-mx-4 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {itemName && (
            <FilterChip
              active={false}
              onClick={() => selectItem(null)}
              className="border-dashed bg-muted"
            >
              {itemName} ✕
            </FilterChip>
          )}
          {FILTERS.map(({ key, label }) => (
            <FilterChip
              key={key}
              active={filter === key}
              onClick={() => {
                setFilter(key);
                scrollToListTop();
              }}
            >
              {label}
              <span
                className={cn(
                  "text-xs",
                  filter === key
                    ? "text-background/70"
                    : "text-muted-foreground",
                )}
              >
                {filterCounts[key]}
              </span>
            </FilterChip>
          ))}
          <label className="ml-auto flex shrink-0 cursor-pointer items-center gap-2 pl-2 text-[13px] whitespace-nowrap text-muted-foreground">
            <Switch
              className="cursor-pointer"
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            Неактивные
          </label>
        </div>
      </div>

      <div className="grid items-start gap-4 min-[960px]:grid-cols-[minmax(0,1fr)_360px]">
        <GiveawayRoster
          items={items}
          players={displayed}
          selectedId={activeId}
          highlightedName={itemName}
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
