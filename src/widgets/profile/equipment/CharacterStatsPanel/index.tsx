"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import saveCharacterLevel from "@/actions/saveCharacterLevel";
import { isValidCharacterLevel } from "../characterLevel";
import {
  computeCharacterBonuses,
  computeDerivedStats,
} from "../characterStats";
import type { SelectedBuffs } from "../characterBuffs";
import type { ProfileStats } from "../statComparison";
import StatDiff from "../StatDiff";
import BuffRow from "./BuffRow";
import LevelControl from "./LevelControl";
import StatBar from "./StatBar";
import StatList from "./StatList";
import { attributeColumns, powerStats, utilityStats } from "./statSections";
import { errorMessage } from "@/shared/lib/errorMessage";

export function CharacterStatsPanel({
  userId,
  equipment,
  seals,
  user,
  canEdit,
  level,
  onLevelChange,
  buffs,
  guildBuffs,
  onBuffsChange,
  skillBuild,
  viewer,
}: {
  userId: number;
  equipment: UserEquipment[];
  seals: UserSeal[];
  user?: { username?: string | null } | null;
  canEdit: boolean;
  level: number;
  onLevelChange: (level: number) => void;
  buffs: SelectedBuffs;
  guildBuffs: SelectedBuffs;
  onBuffsChange: (buffs: SelectedBuffs) => void;
  skillBuild: RoleSkillBuild;
  viewer: ProfileStats | null;
}) {
  const [savingLevel, setSavingLevel] = useState(false);
  const [levelEditing, setLevelEditing] = useState(false);

  const { totals: bonus } = computeCharacterBonuses(
    equipment,
    seals,
    { ...buffs, ...guildBuffs },
    skillBuild,
  );
  const stats = computeDerivedStats(bonus, level);

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
          <StatBar
            value={stats.health}
            color="#72a91a"
            borderColor="#b9d48d"
            diff={
              <StatDiff
                label="Здоровье"
                viewer={viewer?.stats.health}
                owner={stats.health}
                decimals={0}
              />
            }
          />
          <StatBar
            value={stats.mana}
            color="#3190f4"
            borderColor="#98c8fa"
            diff={
              <StatDiff
                label="Мана"
                viewer={viewer?.stats.mana}
                owner={stats.mana}
                decimals={0}
              />
            }
          />

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

      <BuffRow
        userId={userId}
        equipment={equipment}
        buffs={buffs}
        guildBuffs={guildBuffs}
        canEdit={canEdit}
        onBuffsChange={onBuffsChange}
      />

      <div className="border-t" />

      <StatList
        lines={powerStats(stats)}
        viewerLines={viewer && powerStats(viewer.stats)}
      />

      <div className="border-t" />

      <div className="grid grid-cols-2 gap-x-2">
        {attributeColumns(stats).map((column, index) => (
          <StatList
            key={index}
            lines={column}
            viewerLines={viewer && attributeColumns(viewer.stats)[index]}
            className={index === 0 ? "border-r pr-2" : "pl-2"}
          />
        ))}
      </div>

      <div className="border-t" />

      <StatList
        lines={utilityStats(stats)}
        viewerLines={viewer && utilityStats(viewer.stats)}
      />
    </div>
  );
}
