"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { UserEquipment } from "@/actions/getUserEquipment";
import saveCharacterLevel from "@/actions/saveCharacterLevel";
import { isValidCharacterLevel } from "./characterLevel";
import {
  computeEquippedBonuses,
  computeDerivedStats,
} from "./characterStats";
import { ATTRIBUTE_TOOLTIPS } from "./attributeTooltips";
import { getActiveSetBuffs } from "./setBonuses";
import { getActiveQualitySetBuffs } from "./qualitySetBonus";
import { getActiveWeaponBuff } from "./weaponBuffs";
import { highlightNumbers } from "./highlightNumbers";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";

export const BONUS_COLOR = "#4ade80";

const LEVEL_FONT = "FrizQuadrataCTT";
const LEVEL_COLOR = "#fff2a2";
const LEVELS = Array.from({ length: 70 }, (_, i) => i + 1);

function LevelDigits({ level }: { level: number }) {
  return (
    <span
      style={{ fontFamily: LEVEL_FONT, color: LEVEL_COLOR }}
      className="text-2xl"
    >
      {level}
    </span>
  );
}

function StatRow({
  label,
  value,
  boosted,
  tooltip,
}: {
  label: string;
  value: string;
  boosted: boolean;
  tooltip?: { title: string; lines: string[] };
}) {
  const labelNode = tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help whitespace-nowrap text-muted-foreground underline decoration-dotted underline-offset-2">
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="dark w-72 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-1">
          <div className="text-sm font-semibold">{tooltip.title}</div>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            {tooltip.lines.map((line, i) => (
              <div key={i}>{highlightNumbers(line)}</div>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  ) : (
    <span className="whitespace-nowrap text-muted-foreground">{label}</span>
  );

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      {labelNode}
      <span
        className="whitespace-nowrap font-medium tabular-nums"
        style={{ color: boosted ? BONUS_COLOR : undefined }}
      >
        {value}
      </span>
    </div>
  );
}

function StatBar({
  value,
  color,
  borderColor,
}: {
  value: number;
  color: string;
  borderColor: string;
}) {
  return (
    <div
      className="relative flex h-5 w-full items-center justify-center overflow-hidden rounded-xs text-[11px] font-semibold text-white"
      style={{
        background: `linear-gradient(to bottom, color-mix(in srgb, ${color} 65%, white 35%), ${color})`,
        border: `1px solid ${borderColor}`,
      }}
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
        {Math.round(value).toLocaleString("ru-RU")} (100%)
      </span>
    </div>
  );
}

function BuffIcon({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="relative size-9 shrink-0 overflow-hidden rounded-md"
          style={{ boxShadow: `0 0 0 2px ${BONUS_COLOR}` }}
        >
          <Image
            src={icon}
            alt={title}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="dark w-64 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative size-8 shrink-0 overflow-hidden rounded-md">
              <Image src={icon} alt={title} fill sizes="32px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-muted-foreground">Эффект</div>
              <div
                className="truncate text-sm font-semibold"
                style={{ color: BONUS_COLOR }}
              >
                {title}
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="space-y-0.5 text-xs text-muted-foreground">
            {description.split("\n").map((line, i) => (
              <div key={i}>{highlightNumbers(line)}</div>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function CharacterStatsPanel({
  userId,
  equipment,
  user,
  canEdit,
  level,
  onLevelChange,
}: {
  userId: number;
  equipment: UserEquipment[];
  user?: { username?: string | null } | null;
  canEdit: boolean;
  level: number;
  onLevelChange: (level: number) => void;
}) {
  const [savingLevel, setSavingLevel] = useState(false);
  const [levelEditing, setLevelEditing] = useState(false);

  const bonus = computeEquippedBonuses(equipment);
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
        error instanceof Error
          ? error.message
          : "Не удалось сохранить уровень персонажа",
      );
    } finally {
      setSavingLevel(false);
    }
  };

  return (
    <div className="w-full flex-1 space-y-3 rounded-xl border bg-muted/40 p-3 text-xs lg:w-96">
      <div>
        <div className="flex items-center gap-1.5 pl-10">
          {canEdit && levelEditing ? (
            <Select
              value={String(level)}
              onValueChange={(value) => {
                handleLevelChange(value);
                setLevelEditing(false);
              }}
              open={levelEditing}
              onOpenChange={setLevelEditing}
              disabled={savingLevel}
            >
              <SelectTrigger
                size="sm"
                className="h-6 w-auto shrink-0 cursor-pointer justify-center border-none bg-transparent px-1 shadow-none"
              >
                <SelectValue>
                  <LevelDigits level={level} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    <LevelDigits level={n} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : canEdit ? (
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setLevelEditing(true)}
            >
              <LevelDigits level={level} />
            </button>
          ) : (
            <LevelDigits level={level} />
          )}
          <div className="min-w-0 flex-1 truncate text-sm font-semibold">
            {user?.username ?? "Без имени"}
          </div>
        </div>
        <div className="relative mt-1 space-y-0.5">
          <StatBar value={stats.health} color="#72a91a" borderColor="#b9d48d" />
          <StatBar value={stats.mana} color="#3190f4" borderColor="#98c8fa" />

          <div className="pointer-events-none absolute -top-11 -left-1 z-10 size-23">
            <Image
              src="/images/equipment/ramka.png"
              alt=""
              fill
              sizes="48px"
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

      <div className="space-y-1.5">
        <StatRow
          label="Сила атаки в ближнем бою"
          value={stats.meleeAttack.toFixed(2)}
          boosted={bonus.meleeAttack !== 0 || bonus.str !== 0}
        />
        <StatRow
          label="Сила атаки в дальнем бою"
          value={stats.rangedAttack.toFixed(2)}
          boosted={bonus.rangedAttack !== 0 || bonus.dex !== 0}
        />
        <StatRow
          label="Сила заклинаний"
          value={stats.spellPower.toFixed(2)}
          boosted={bonus.spellPower !== 0 || bonus.int !== 0}
        />
        <StatRow
          label="Эффективность исцеления"
          value={stats.healPower.toFixed(2)}
          boosted={bonus.healPower !== 0 || bonus.spi !== 0}
        />
        <StatRow
          label="Защита"
          value={String(Math.round(stats.defense))}
          boosted={bonus.defense !== 0 || bonus.sta !== 0}
        />
        <StatRow
          label="Сопротивление"
          value={String(Math.round(stats.resist))}
          boosted={bonus.resist !== 0 || bonus.sta !== 0}
        />
      </div>

      <div className="border-t" />

      <div className="grid grid-cols-2 gap-x-3">
        <div className="space-y-1.5 border-r pr-3">
          <StatRow
            label="Сила"
            value={String(stats.str)}
            boosted={bonus.str > 0}
            tooltip={ATTRIBUTE_TOOLTIPS.str}
          />
          <StatRow
            label="Интеллект"
            value={String(stats.int)}
            boosted={bonus.int > 0}
            tooltip={ATTRIBUTE_TOOLTIPS.int}
          />
          <StatRow
            label="Ловкость"
            value={String(stats.dex)}
            boosted={bonus.dex > 0}
            tooltip={ATTRIBUTE_TOOLTIPS.dex}
          />
        </div>
        <div className="space-y-1.5 pl-3">
          <StatRow
            label="Сила духа"
            value={String(stats.spi)}
            boosted={bonus.spi > 0}
            tooltip={ATTRIBUTE_TOOLTIPS.spi}
          />
          <StatRow
            label="Выносливость"
            value={String(stats.sta)}
            boosted={bonus.sta > 0}
            tooltip={ATTRIBUTE_TOOLTIPS.sta}
          />
        </div>
      </div>

      <div className="border-t" />

      <div className="space-y-1.5">
        <StatRow
          label="Скорость передвижения"
          value={`${stats.moveSpeed.toFixed(1)} м/с`}
          boosted={bonus.moveSpeed !== 0}
        />
        <StatRow
          label="Время применения умений"
          value={`${stats.skillSpeed.toFixed(1)}%`}
          boosted={bonus.skillSpeed !== 0}
        />
        <StatRow
          label="Сноровка"
          value={String(stats.proficiency)}
          boosted={bonus.proficiency !== 0}
        />
      </div>
    </div>
  );
}
