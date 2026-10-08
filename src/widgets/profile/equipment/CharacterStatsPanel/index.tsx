"use client";
import { useState } from "react";
import Image from "next/image";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import { isValidCharacterLevel } from "../characterLevel";
import {
  computeCharacterBonuses,
  computeDerivedStats,
} from "../characterStats";
import { PERSONAL_BUFFS, type SelectedBuffs } from "../characterBuffs";
import type { CharacterBuff } from "../itemsData/buffTypes";
import type { ProfileStats } from "../statComparison";
import BuffRow from "./BuffRow";
import LevelControl from "./LevelControl";
import StatBar from "./StatBar";
import StatList from "./StatList";
import { attributeColumns, powerStats, utilityStats } from "./statSections";
import { formatNumber } from "@/shared/lib/format";
import { computeTestGearScore } from "../gearScore";

type Props = {
  equipment: UserEquipment[];
  seals: UserSeal[];
  user?: { username?: string | null } | null;
  canEdit: boolean;
  level: number;
  onLevelChange: (level: number) => Promise<void>;
  buffs: SelectedBuffs;
  guildBuffs: SelectedBuffs;
  buffChoices?: CharacterBuff[];
  onBuffsSave: (buffs: SelectedBuffs) => Promise<void>;
  skillBuild: RoleSkillBuild;
  viewer: ProfileStats | null;
};

export default function CharacterStatsPanel({
  equipment,
  seals,
  user,
  canEdit,
  level,
  onLevelChange,
  buffs,
  guildBuffs,
  buffChoices = PERSONAL_BUFFS,
  onBuffsSave,
  skillBuild,
  viewer,
}: Props) {
  const [savingLevel, setSavingLevel] = useState(false);
  const [levelEditing, setLevelEditing] = useState(false);

  const { totals: bonus } = computeCharacterBonuses(
    equipment,
    seals,
    { ...buffs, ...guildBuffs },
    skillBuild,
    level,
  );
  const stats = computeDerivedStats(bonus, level);

  const handleLevelChange = async (value: string) => {
    const next = Number(value);
    if (!isValidCharacterLevel(next)) return;
    setSavingLevel(true);
    try {
      await onLevelChange(next);
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
          <div className="min-w-0 flex-1 truncate text-sm font-semibold text-[#acd49c] [text-shadow:0_0_2px_#141206,0_0_2px_#141206,0_1px_2px_rgb(0_0_0/0.7)]">
            {user?.username ?? "Без имени"}
          </div>
        </div>
        <div className="relative mt-1 space-y-0.5">
          <StatBar
            label="Здоровье"
            value={stats.health}
            viewerValue={viewer?.stats.health}
            color="#72a91a"
            borderColor="#b9d48d"
          />
          <StatBar
            label="Мана"
            value={stats.mana}
            viewerValue={viewer?.stats.mana}
            color="#3190f4"
            borderColor="#98c8fa"
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
        equipment={equipment}
        buffs={buffs}
        guildBuffs={guildBuffs}
        buffChoices={buffChoices}
        canEdit={canEdit}
        onBuffsSave={onBuffsSave}
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

      <div className="border-t" />

      <div
        className="flex items-center justify-between text-xs text-muted-foreground"
        title="Примерная оценка: ГС предметов по формулам игры и уровни печатей героя"
      >
        <span>ГС (тест, примерно)</span>
        <span className="tabular-nums">
          {formatNumber(computeTestGearScore(equipment, seals))}
        </span>
      </div>
    </div>
  );
}
