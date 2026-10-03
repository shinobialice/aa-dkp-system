"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import saveCharacterLevel from "@/actions/saveCharacterLevel";
import { isValidCharacterLevel } from "../characterLevel";
import { computeEquippedBonuses, computeDerivedStats } from "../characterStats";
import { getActiveWeaponBuff } from "../weaponBuffs";

import { getActiveSetBuffs } from "../setBonuses";
import { getActiveQualitySetBuffs } from "../qualitySetBonus";
import BuffIcon from "./BuffIcon";
import LevelControl from "./LevelControl";
import StatBar from "./StatBar";
import StatRow from "./StatRow";
import {
  attributeColumns,
  powerStats,
  utilityStats,
  type StatLine,
} from "./statSections";
import { cn } from "@/shared/lib/tw-merge";
import { errorMessage } from "@/shared/lib/errorMessage";

export function CharacterStatsPanel({
  userId,
  equipment,
  seals,
  user,
  canEdit,
  level,
  onLevelChange,
}: {
  userId: number;
  equipment: UserEquipment[];
  seals: UserSeal[];
  user?: { username?: string | null } | null;
  canEdit: boolean;
  level: number;
  onLevelChange: (level: number) => void;
}) {
  const [savingLevel, setSavingLevel] = useState(false);
  const [levelEditing, setLevelEditing] = useState(false);

  const bonus = computeEquippedBonuses(equipment, seals);
  const stats = computeDerivedStats(bonus, level);
  const weaponBuff = getActiveWeaponBuff(equipment);
  const setBuffs = [
    ...getActiveSetBuffs(equipment),
    ...getActiveQualitySetBuffs(equipment),
    ...(weaponBuff ? [weaponBuff] : []),
  ];

  const handleLevelChange = async (value: string) => {
    const next = Number(value);
    if (!isValidCharacterLevel(next)) return;
    const prev = level;
    onLevelChange(next);
    setSavingLevel(true);
    try {
      await saveCharacterLevel(userId, next);
    } catch (error) {
      onLevelChange(prev);
      toast.error(
        errorMessage(error, "Не удалось сохранить уровень персонажа"),
      );
    } finally {
      setSavingLevel(false);
    }
  };

  return (
    <div className="w-full flex-1 space-y-3 rounded-xl border bg-muted/40 p-3 text-xs">
      <div>
        <div className="flex items-center gap-1.5 pl-10">
          <LevelControl
            level={level}
            canEdit={canEdit}
            editing={levelEditing}
            disabled={savingLevel}
            onEditingChange={setLevelEditing}
            onChange={handleLevelChange}
          />
          <div className="min-w-0 flex-1 truncate text-sm font-semibold">
            {user?.username ?? "Без имени"}
          </div>
        </div>
        <div className="relative mt-1 space-y-0.5">
          <StatBar value={stats.health} color="#72a91a" borderColor="#b9d48d" />
          <StatBar value={stats.mana} color="#3190f4" borderColor="#98c8fa" />

          <div className="pointer-events-none absolute -top-10 -left-1 z-10 size-23">
            <Image
              src="/images/equipment/frame.png"
              alt=""
              fill
              sizes="92px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {setBuffs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {setBuffs.map((buff, i) => (
            <BuffIcon
              key={i}
              icon={buff.icon}
              title={buff.title}
              description={buff.description}
            />
          ))}
        </div>
      )}

      <div className="border-t" />

      <StatList lines={powerStats(stats, bonus)} />

      <div className="border-t" />

      <div className="grid grid-cols-2 gap-x-3">
        {attributeColumns(stats, bonus).map((column, index) => (
          <StatList
            key={index}
            lines={column}
            className={index === 0 ? "border-r pr-3" : "pl-3"}
          />
        ))}
      </div>

      <div className="border-t" />

      <StatList lines={utilityStats(stats, bonus)} />
    </div>
  );
}

function StatList({
  lines,
  className,
}: {
  lines: StatLine[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {lines.map((line) => (
        <StatRow key={line.label} {...line} />
      ))}
    </div>
  );
}
