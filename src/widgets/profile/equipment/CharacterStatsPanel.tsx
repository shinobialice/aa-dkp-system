import Image from "next/image";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { BASE_CHARACTER_STATS, computeEquippedBonuses } from "./characterStats";
import { getActiveSetBuffs } from "./setBonuses";
import { getActiveQualitySetBuffs } from "./qualitySetBonus";
import { getActiveWeaponBuff } from "./weaponBuffs";
import { highlightNumbers } from "./highlightNumbers";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

const BONUS_COLOR = "#4ade80";

function StatRow({
  label,
  value,
  boosted,
}: {
  label: string;
  value: string;
  boosted: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="whitespace-nowrap text-muted-foreground">{label}</span>
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
      className="relative flex h-5 w-full items-center justify-center overflow-hidden rounded-sm text-[11px] font-semibold text-white"
      style={{
        background: `linear-gradient(to bottom, color-mix(in srgb, ${color} 65%, white 35%), ${color})`,
        border: `1px solid ${borderColor}`,
      }}
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
        {value.toLocaleString("ru-RU")} (100%)
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
  equipment,
  user,
}: {
  equipment: UserEquipment[];
  user?: { username?: string | null } | null;
}) {
  const bonus = computeEquippedBonuses(equipment);
  const base = BASE_CHARACTER_STATS;
  const weaponBuff = getActiveWeaponBuff(equipment);
  const setBuffs = [
    ...getActiveSetBuffs(equipment),
    ...getActiveQualitySetBuffs(equipment),
    ...(weaponBuff ? [weaponBuff] : []),
  ];

  const defense = base.defense + bonus.defense;
  const resist = base.resist + bonus.resist;
  const str = base.str + bonus.str;
  const int = base.int + bonus.int;
  const dex = base.dex + bonus.dex;
  const spi = base.spi + bonus.spi;
  const sta = base.sta + bonus.sta;

  return (
    <div className="w-full flex-1 space-y-3 rounded-xl border bg-muted/40 p-3 text-xs lg:w-96">
      <div className="truncate text-sm font-semibold">
        {user?.username ?? "Без имени"}
      </div>

      <div className="space-y-1">
        <StatBar value={base.health} color="#4caf50" borderColor="#8ee08e" />
        <StatBar value={base.mana} color="#3b82f6" borderColor="#8ec5f5" />
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
          value={base.meleeAttack.toFixed(2)}
          boosted={false}
        />
        <StatRow
          label="Сила атаки в дальнем бою"
          value={base.rangedAttack.toFixed(2)}
          boosted={false}
        />
        <StatRow
          label="Сила заклинаний"
          value={base.spellPower.toFixed(2)}
          boosted={false}
        />
        <StatRow
          label="Эффективность исцеления"
          value={base.healPower.toFixed(2)}
          boosted={false}
        />
        <StatRow label="Защита" value={String(defense)} boosted={bonus.defense > 0} />
        <StatRow
          label="Сопротивление"
          value={String(resist)}
          boosted={bonus.resist > 0}
        />
      </div>

      <div className="border-t" />

      <div className="grid grid-cols-2 gap-x-3">
        <div className="space-y-1.5 border-r pr-3">
          <StatRow label="Сила" value={String(str)} boosted={bonus.str > 0} />
          <StatRow label="Интеллект" value={String(int)} boosted={bonus.int > 0} />
          <StatRow label="Ловкость" value={String(dex)} boosted={bonus.dex > 0} />
        </div>
        <div className="space-y-1.5 pl-3">
          <StatRow label="Сила духа" value={String(spi)} boosted={bonus.spi > 0} />
          <StatRow
            label="Выносливость"
            value={String(sta)}
            boosted={bonus.sta > 0}
          />
        </div>
      </div>

      <div className="border-t" />

      <div className="space-y-1.5">
        <StatRow
          label="Скорость передвижения"
          value={`${base.moveSpeed} м/с`}
          boosted={false}
        />
        <StatRow
          label="Время применения умений"
          value={`${base.skillSpeed.toFixed(1)}%`}
          boosted={false}
        />
        <StatRow label="Сноровка" value={String(base.proficiency)} boosted={false} />
      </div>
    </div>
  );
}
