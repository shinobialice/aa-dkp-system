"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, Pencil, Search } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { CLASS_ORDER } from "@/widgets/MembersTable/membersModel";
import { classColors } from "@/widgets/MembersTable/classStyles";
import {
  formatDay,
  percent,
  RAID_TEXT,
  raidColorStyle,
  raidKind,
  raidTitle,
} from "./attendanceModel";

const CLASS_PLURAL: Record<string, string> = {
  Бард: "Барды",
  Лук: "Луки",
  Стрелок: "Стрелки",
  Маг: "Маги",
  Милик: "Милики",
  Тактик: "Тактики",
  Танцор: "Танцоры",
  Хил: "Хилы",
};

type Attendee = {
  is_late: boolean;
  user: { id: number; username: string; class: string | null };
};

type RaidLoot = {
  id: number;
  status: string | null;
  quantity: number;
  sold_to: string | null;
  itemType: {
    name: string;
    icon_url: string | null;
    grade: number | null;
  } | null;
};

export type RaidDetails = {
  id: number;
  type: string;
  start_date: string;
  dkp_summary: number | null;
  guildActiveMembersAtTime: number | null;
  raid_boss: { boss: { boss_name: string } }[];
  raid_attendance: Attendee[];
  loot: RaidLoot[];
};

function groupByClass(attendees: Attendee[]) {
  const order = [...CLASS_ORDER, null];
  return order
    .map((cls) => ({
      cls,
      title: cls ? (CLASS_PLURAL[cls] ?? cls) : "Без класса",
      people: attendees
        .filter((attendee) =>
          cls === null
            ? !attendee.user.class || !CLASS_ORDER.includes(attendee.user.class)
            : attendee.user.class === cls,
        )
        .sort((a, b) => a.user.username.localeCompare(b.user.username, "ru")),
    }))
    .filter((group) => group.people.length > 0);
}

export function RaidDetailsDialog({
  open,
  setOpen,
  raid,
  currentUserId,
  canEdit,
  onEdit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  raid: RaidDetails | null;
  currentUserId: number | null;
  canEdit: boolean;
  onEdit: () => void;
}) {
  const [tab, setTab] = useState<"people" | "loot">("people");
  const [search, setSearch] = useState("");

  if (!raid) return null;

  const bosses = raid.raid_boss.map((row) => row.boss.boss_name);
  const summary = { type: raid.type, bosses };
  const kindLabel = raidKind(summary) === "prime" ? "Прайм" : raid.type;
  const attendees = raid.raid_attendance;
  const total = raid.guildActiveMembersAtTime ?? 0;
  const late = attendees.filter((attendee) => attendee.is_late).length;
  const attended = attendees.some(
    (attendee) => attendee.user.id === currentUserId,
  );
  const loot = raid.loot.filter((item) => item.status !== "Распродано");
  const showLoot = raid.type !== "АГЛ";
  const term = search.trim().toLowerCase();
  const groups = groupByClass(
    attendees.filter(
      (attendee) =>
        !term || attendee.user.username.toLowerCase().includes(term),
    ),
  );
  const dateKey = raid.start_date.slice(0, 10);
  const weekday = formatDay(dateKey, { weekday: "long" });
  const dateLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${formatDay(dateKey, { day: "numeric", month: "long" })} · ${raid.start_date.slice(11, 16)} МСК`;
  const activeTab = showLoot ? tab : "people";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSearch("");
          setTab("people");
        }
      }}
    >
      <DialogContent className="flex max-h-[88dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="flex flex-col gap-0.5 px-5 pt-5 pb-3 pr-12">
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle
              style={raidColorStyle(summary)}
              className={cn(
                "text-[22px] leading-tight font-extrabold",
                RAID_TEXT,
              )}
            >
              {raidTitle(summary)}
            </DialogTitle>
            {kindLabel !== raidTitle(summary) && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {kindLabel}
              </span>
            )}
          </div>
          <DialogDescription className="text-sm text-foreground/70">
            {dateLabel}
          </DialogDescription>
        </div>

        <div className="mx-5 grid grid-cols-3 divide-x rounded-lg border">
          <div className="flex flex-col px-3 py-2">
            <span className="text-xs text-muted-foreground">Участники</span>
            <span className="text-base font-bold tabular-nums">
              {attendees.length}
              {total > 0 && (
                <>
                  {" "}
                  из {total}{" "}
                  <span className="text-[12.5px] font-semibold text-green-700 dark:text-green-400">
                    {percent(attendees.length, total)}%
                  </span>
                </>
              )}
            </span>
          </div>
          <div className="flex flex-col px-3 py-2">
            <span className="text-xs text-muted-foreground">Ценность</span>
            <span className="text-base font-bold tabular-nums">
              {raid.dkp_summary ?? 0}
            </span>
          </div>
          <div className="flex flex-col px-3 py-2">
            <span className="text-xs text-muted-foreground">Опоздали</span>
            <span className="text-base font-bold tabular-nums">{late}</span>
          </div>
        </div>

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
          <div
            role="tablist"
            className="inline-flex gap-0.5 rounded-lg bg-muted p-[3px]"
          >
            {(
              [
                ["people", `Участники ${attendees.length}`],
                ...(showLoot ? [["loot", `Лут ${loot.length}`]] : []),
              ] as [typeof tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => setTab(key)}
                className={cn(
                  "h-[30px] cursor-pointer rounded-md px-3 text-[13px] font-semibold transition-colors",
                  activeTab === key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
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
          {activeTab === "people" ? (
            attendees.length === 0 ? (
              <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                Участники ещё не добавлены
              </p>
            ) : groups.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Никого не нашлось
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {groups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-foreground/80">
                      <span
                        className="size-2 rounded-full bg-muted-foreground"
                        style={
                          group.cls
                            ? { backgroundColor: classColors[group.cls] }
                            : undefined
                        }
                      />
                      {group.title}
                      <span className="font-medium text-muted-foreground">
                        {group.people.length}
                      </span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.people.map((attendee) => {
                        const me = attendee.user.id === currentUserId;
                        return (
                          <Link
                            key={attendee.user.id}
                            href={`/profile/${attendee.user.id}`}
                            className={cn(
                              "inline-flex h-[30px] items-center gap-1.5 rounded-full pr-2.5 pl-[3px] text-[13px] font-medium transition-colors",
                              me
                                ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-300"
                                : "bg-muted hover:bg-muted/70",
                            )}
                          >
                            <span
                              className="flex size-6 items-center justify-center rounded-full bg-muted-foreground text-[11px] font-bold text-white"
                              style={
                                attendee.user.class
                                  ? {
                                      backgroundColor:
                                        classColors[attendee.user.class],
                                    }
                                  : undefined
                              }
                            >
                              {attendee.user.username.slice(0, 1).toUpperCase()}
                            </span>
                            {attendee.user.username}
                            {attendee.is_late && (
                              <span className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-amber-700 dark:text-amber-400">
                                <Clock className="size-3" />
                                опоздал
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : loot.length === 0 ? (
            <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              Лут к этому рейду не привязан
            </p>
          ) : (
            <ul className="flex flex-col divide-y rounded-lg border">
              {loot.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-3 py-2">
                  <LootIcon
                    itemName={item.itemType?.name ?? ""}
                    iconUrl={item.itemType?.icon_url}
                    grade={item.itemType?.grade}
                    size={32}
                  />
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate font-medium">
                      {item.itemType?.name ?? "—"}
                      {item.quantity > 1 && (
                        <span className="text-muted-foreground">
                          {" "}
                          × {item.quantity}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.status ?? "—"}
                      {item.sold_to && ` · ${item.sold_to}`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {canEdit && (
          <div className="flex justify-end border-t px-5 py-3">
            <Button
              variant="outline"
              onClick={onEdit}
              className="cursor-pointer"
            >
              <Pencil />
              Редактировать
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
