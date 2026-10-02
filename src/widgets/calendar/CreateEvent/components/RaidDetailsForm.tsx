"use client";
import React from "react";
import CategorySelector from "./CategorySelector";
import BossSelector from "./BossSelector";
import DatetimePicker from "./DateTimePicker";
import { ScheduledDateTimePicker } from "./ScheduledDateTimePicker";
import { Checkbox } from "@/shared/ui";
import { getActiveUsers } from "@/actions/getActiveUsers";
import { getAttendanceBonusTypesForRaid } from "@/actions/attendanceBonusSettings";
import type { ResolvedAttendanceBonus } from "@/utils/attendanceBonusDefaults";
import computeRaidDkp from "@/utils/eventDkpCalculator";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { getUnlinkedLootCandidates } from "@/actions/getUnlinkedLootCandidates";
import { isPrimeLinkableSource } from "@/widgets/Loot/GuildLoot/LootTypes";
import { bossColorStyle } from "@/widgets/Attendance/attendanceModel";
import { cn } from "@/shared/lib/tw-merge";

export function RaidDetailsForm({
  setUsers,
  category,
  setCategory,
  selectedBoss,
  setSelectedBoss,
  selectedBosses,
  setSelectedBosses,
  dkpPoints,
  setDkpPoints,
  selectedDate,
  setSelectedDate,
  errors,
  setErrors,
  bosses,
  activeBonusIds,
  setActiveBonusIds,
  loot,
  lootLinkIds,
  setLootLinkIds,
  mode = "create",
}: {
  users: any[];
  setUsers: (users: any[]) => void;
  category: string | null;
  setCategory: (value: string | null) => void;
  selectedBoss: string | null;
  setSelectedBoss: (value: string | null) => void;
  selectedBosses: any[];
  setSelectedBosses: React.Dispatch<React.SetStateAction<any[]>>;
  dkpPoints: number;
  setDkpPoints: (value: number) => void;
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  bosses: any[];
  activeBonusIds: Record<number, boolean>;
  setActiveBonusIds: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
  loot?: any[];
  lootLinkIds: Record<number, boolean>;
  setLootLinkIds: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  mode?: "create" | "edit";
}) {
  const [bonuses, setBonuses] = React.useState<
    ResolvedAttendanceBonus[] | null
  >(null);

  React.useEffect(() => {
    async function fetchUsers() {
      const activeUsers = await getActiveUsers();
      setUsers(activeUsers);
    }
    fetchUsers();
  }, [setUsers]);

  React.useEffect(() => {
    getAttendanceBonusTypesForRaid(selectedDate ?? undefined)
      .then(setBonuses)
      .catch(() => setBonuses([]));
  }, [selectedDate]);

  React.useEffect(() => {
    if (!bonuses) return;
    // dkp_points на самом selectedBosses может быть резолвлен под другую дату
    // (например, ещё до того, как выбрали дату рейда, или для отредактированного
    // рейда — из старого значения в БД) — берём актуальное значение из bosses,
    // который уже пересчитан под режим гильдии на selectedDate.
    const baseDkp = selectedBosses.reduce((sum, boss) => {
      const resolved = bosses.find((b) => b.id === boss.id);
      return sum + (resolved?.dkp_points ?? boss.dkp_points ?? 0);
    }, 0);
    const active = bonuses.filter((b) => activeBonusIds[b.id]);
    setDkpPoints(computeRaidDkp(baseDkp, active));
  }, [selectedBosses, activeBonusIds, bonuses, bosses]);

  // У каждого бонуса свой набор боссов, на которых он применяется (настраивается
  // в Settings). Если выбранный босс сменился и бонус к нему больше не
  // относится — снимаем галку. НЕ трогаем, пока bonuses ещё не загружены,
  // иначе это тихо обнуляло бы уже сохранённый исторический бонус при
  // загрузке старого рейда в режиме редактирования ещё до того, как админ
  // вообще коснулся формы.
  React.useEffect(() => {
    if (!bonuses) return;
    setActiveBonusIds((prev) => {
      const next: Record<number, boolean> = {};
      for (const [idStr, checked] of Object.entries(prev)) {
        if (!checked) continue;
        const id = Number(idStr);
        const bonus = bonuses.find((b) => b.id === id);
        if (
          bonus &&
          selectedBosses.some((boss) => bonus.bossIds.includes(boss.id))
        ) {
          next[id] = true;
        }
      }
      return next;
    });
  }, [selectedBosses, bonuses, setActiveBonusIds]);

  const handleSelectBoss = (boss: any) => {
    setSelectedBoss(boss.boss_name);
    setSelectedBosses([boss]);
    setErrors((prev: any) => ({ ...prev, selectedBoss: false }));
  };

  const visibleLoot = (loot ?? []).filter(
    (item: any) => item.status !== "Распродано",
  );

  const [unlinkedCandidates, setUnlinkedCandidates] = React.useState<any[]>([]);
  const canLinkLoot =
    !!selectedBoss && !!selectedDate && isPrimeLinkableSource(selectedBoss);

  React.useEffect(() => {
    const fetchCandidates = canLinkLoot
      ? getUnlinkedLootCandidates({
          bossName: selectedBoss!,
          date: selectedDate!.toISOString(),
        })
      : Promise.resolve([]);
    fetchCandidates.then(setUnlinkedCandidates);
  }, [canLinkLoot, selectedBoss, selectedDate]);

  const toggleLootLink = (id: number) => {
    setLootLinkIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleBonuses =
    bonuses?.filter((b) =>
      selectedBosses.some((boss) => b.bossIds.includes(boss.id)),
    ) ?? [];
  const bossNames = selectedBosses.map((boss) => boss.boss_name).join(", ");
  const activeBonusLabels = visibleBonuses
    .filter((b) => activeBonusIds[b.id])
    .map((b) => b.label);

  return (
    <div className="flex flex-col gap-4">
      <CategorySelector
        category={category}
        setCategory={setCategory}
        setSelectedBoss={setSelectedBoss}
        setSelectedBosses={setSelectedBosses}
        setActiveBonusIds={setActiveBonusIds}
        setErrors={setErrors}
        errors={errors}
      />
      <BossSelector
        category={category}
        bosses={bosses}
        selectedBoss={selectedBoss}
        onSelectBoss={handleSelectBoss}
        errors={errors}
      />

      {visibleBonuses.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-muted-foreground">
            Бонусы
          </span>
          <div className="flex flex-wrap gap-1.5">
            {visibleBonuses.map((b) => {
              const active = !!activeBonusIds[b.id];
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setActiveBonusIds((prev) => ({ ...prev, [b.id]: !active }))
                  }
                  className={cn(
                    "h-8 cursor-pointer rounded-full border px-3 text-[13px] font-semibold transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "bg-background hover:bg-muted",
                  )}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-muted-foreground">
          Дата и время, МСК
        </span>
        {mode === "edit" ? (
          <DatetimePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setErrors((prev: any) => ({ ...prev, selectedDate: false }));
            }}
          />
        ) : (
          <ScheduledDateTimePicker
            key={`${category ?? ""}-${selectedBoss ?? ""}`}
            category={category}
            selectedBoss={selectedBoss}
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setErrors((prev: any) => ({ ...prev, selectedDate: !date }));
            }}
          />
        )}
        {errors.selectedDate && (
          <p className="text-xs text-destructive">Укажите дату и время</p>
        )}
      </div>

      {loot && category !== "АГЛ" && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-muted-foreground">
            Лут{visibleLoot.length > 0 ? ` · ${visibleLoot.length}` : ""}
          </span>
          {visibleLoot.length > 0 ? (
            <div className="max-h-48 divide-y overflow-y-auto rounded-lg border">
              {visibleLoot.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-sm"
                >
                  <LootIcon
                    itemName={item.itemType?.name}
                    iconUrl={item.itemType?.icon_url}
                    grade={item.itemType?.grade}
                    size={22}
                  />
                  <span className="flex-1 truncate">
                    {item.itemType?.name ?? "—"}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    × {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed px-3 py-3 text-center text-[13px] text-muted-foreground">
              Лут не привязан к этому рейду
            </p>
          )}
        </div>
      )}

      {canLinkLoot && unlinkedCandidates.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-muted-foreground">
            Непривязанный лут за этот день
          </span>
          <div className="max-h-48 divide-y overflow-y-auto rounded-lg border">
            {unlinkedCandidates.map((item: any) => (
              <label
                key={item.id}
                htmlFor={`link-loot-${item.id}`}
                className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-sm hover:bg-muted/60"
              >
                <Checkbox
                  className="cursor-pointer"
                  id={`link-loot-${item.id}`}
                  checked={!!lootLinkIds[item.id]}
                  onCheckedChange={() => toggleLootLink(item.id)}
                />
                <LootIcon
                  itemName={item.itemType?.name}
                  iconUrl={item.itemType?.icon_url}
                  grade={item.itemType?.grade}
                  size={22}
                />
                <span className="flex-1 truncate">
                  {item.itemType?.name ?? "—"}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  × {item.quantity}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div
        style={
          selectedBoss && category
            ? bossColorStyle(selectedBoss, category)
            : undefined
        }
        className="flex items-center justify-between gap-3 rounded-xl bg-[color-mix(in_srgb,var(--raid-color,#71717a)_8%,transparent)] px-3.5 py-3"
      >
        <span className="flex min-w-0 flex-col">
          <span className="text-[12.5px] text-foreground/70">
            Ценность посещения
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {bossNames
              ? [bossNames, ...activeBonusLabels].join(" · ")
              : "Выберите босса"}
          </span>
        </span>
        <span className="text-[26px] leading-none font-extrabold text-[var(--raid-color,currentColor)] tabular-nums dark:text-[var(--raid-color-dark,currentColor)]">
          {dkpPoints ?? 0}
        </span>
      </div>
    </div>
  );
}
