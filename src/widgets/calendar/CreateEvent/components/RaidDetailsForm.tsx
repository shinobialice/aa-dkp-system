"use client";
import React from "react";
import CategorySelector from "./CategorySelector";
import BossSelector from "./BossSelector";
import DatetimePicker from "./DateTimePicker";
import { ScheduledDateTimePicker } from "./ScheduledDateTimePicker";
import { Checkbox } from "@/shared/ui";
import { Label } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { getActiveUsers } from "@/actions/getActiveUsers";
import { getAttendanceBonusTypesForRaid } from "@/actions/attendanceBonusSettings";
import type { ResolvedAttendanceBonus } from "@/utils/attendanceBonusDefaults";
import computeRaidDkp from "@/utils/eventDkpCalculator";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { getUnlinkedLootCandidates } from "@/actions/getUnlinkedLootCandidates";
import { isPrimeLinkableSource } from "@/widgets/Loot/GuildLoot/LootTypes";

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
  setActiveBonusIds: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  loot?: any[];
  lootLinkIds: Record<number, boolean>;
  setLootLinkIds: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  mode?: "create" | "edit";
}) {
  const [bonuses, setBonuses] = React.useState<ResolvedAttendanceBonus[] | null>(
    null,
  );

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
        if (bonus && selectedBosses.some((boss) => bonus.bossIds.includes(boss.id))) {
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

  const [unlinkedCandidates, setUnlinkedCandidates] = React.useState<any[]>(
    [],
  );
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

  return (
    <div className="flex flex-col h-full space-y-4">
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

      {bonuses
        ?.filter((b) =>
          selectedBosses.some((boss) => b.bossIds.includes(boss.id)),
        )
        .map((b) => (
          <div key={b.id} className="flex items-center space-x-2">
            <Checkbox
              className="cursor-pointer"
              id={`bonus_${b.id}`}
              checked={!!activeBonusIds[b.id]}
              onCheckedChange={(checked) =>
                setActiveBonusIds((prev) => ({
                  ...prev,
                  [b.id]: checked === true,
                }))
              }
            />
            <label htmlFor={`bonus_${b.id}`} className="text-sm">
              {b.label}
            </label>
          </div>
        ))}
      <div className="space-y-2">
        <Label>Дата и время (МСК)</Label>
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
          <p className="text-sm text-red-500">Обязательное поле</p>
        )}
      </div>

      {loot && category !== "АГЛ" && (
        <div className="space-y-2">
          <Label>
            Лут
            {visibleLoot.length > 0 ? ` (${visibleLoot.length})` : ""}
          </Label>
          <div className="rounded-md border max-h-48 overflow-y-auto divide-y">
            {visibleLoot.length > 0 ? (
              visibleLoot.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm"
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
                  <span className="text-muted-foreground shrink-0">
                    x{item.quantity}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                Лут не привязан к этому рейду
              </div>
            )}
          </div>
        </div>
      )}

      {canLinkLoot && unlinkedCandidates.length > 0 && (
        <div className="space-y-2">
          <Label>Непривязанный лут за этот день</Label>
          <div className="rounded-md border max-h-48 overflow-y-auto divide-y">
            {unlinkedCandidates.map((item: any) => (
              <label
                key={item.id}
                htmlFor={`link-loot-${item.id}`}
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
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
                <span className="text-muted-foreground shrink-0">
                  x{item.quantity}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-2">
        <Label>Ценность посещения</Label>
        <Input className="w-[270px]" disabled value={dkpPoints ?? 0} />
      </div>
    </div>
  );
}
