"use client";
import Image from "next/image";
import { Check, Lock } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { getSpecialization } from "./specializationsData";
import {
  SKILL_POINTS_BUDGET,
  getSkillsForSpecialization,
  hasSkillData,
  type Skill,
} from "./skills";
import type { RoleSkillBuild, SpecializationBuild } from "@/actions/getUserSkillBuild";

const EMPTY_SPEC_BUILD: SpecializationBuild = { selected: [], eferund: {} };

type DisplaySkill = {
  name: string;
  iconUrl: string;
  meta: string[];
  description: string;
};

// Бюджет (21) и пороги открытия считаются только по АКТИВНЫМ навыкам —
// пассивки бесплатны, лишь гейтятся числом взятых активных той же ветки.
function activeCountOf(skills: Skill[], selected: string[]): number {
  const activeIds = new Set(
    skills.filter((s) => s.kind === "active").map((s) => s.id),
  );
  return selected.filter((id) => activeIds.has(id)).length;
}

function totalActiveSelected(build: RoleSkillBuild): number {
  return Object.entries(build).reduce((sum, [specId, spec]) => {
    const skills = getSkillsForSpecialization(specId);
    return sum + activeCountOf(skills, spec?.selected ?? []);
  }, 0);
}

// Если сняли активный навык, у которого были "дети" по порогу открытия
// (unlockThreshold) — снимаем и их, рекурсивно, как в игре. Порог всегда
// считается по числу взятых активных, поэтому снятие пассивки ни на что
// каскадом не влияет.
function removeWithCascade(skills: Skill[], selected: string[], skillId: string): string[] {
  let next = selected.filter((id) => id !== skillId);
  let changed = true;
  while (changed) {
    changed = false;
    const activeCount = activeCountOf(skills, next);
    for (const id of [...next]) {
      const skill = skills.find((s) => s.id === id);
      const threshold = skill?.unlockThreshold ?? 0;
      if (threshold > 0 && activeCount < threshold) {
        next = next.filter((x) => x !== id);
        changed = true;
      }
    }
  }
  return next;
}

function SkillTooltipBody({
  skill,
  kind,
}: {
  skill: DisplaySkill;
  kind: "active" | "passive";
}) {
  return (
    <div className="w-72 space-y-1.5 text-left whitespace-normal">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{skill.name}</span>
        <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          {kind === "active" ? "Активное" : "Пассивное"}
        </span>
      </div>
      {skill.meta.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          {skill.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
      <div
        className="text-xs leading-snug"
        dangerouslySetInnerHTML={{ __html: skill.description }}
      />
    </div>
  );
}

function SkillIcon({
  src,
  alt,
  size,
  dimmed,
}: {
  src: string;
  alt: string;
  size: number;
  dimmed?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={cn("rounded", dimmed && "opacity-70 grayscale-[70%]")}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

// Эфе'рунд — свои формы уже взятого навыка (в отдельной секции внизу
// колонки, как на archa.ge, а не под самим навыком). Выбор бесплатный и
// доступен только пока базовый навык взят.
function EferundRow({
  skill,
  baseSelected,
  chosenVariantId,
  editable,
  onChoose,
}: {
  skill: Skill;
  baseSelected: boolean;
  chosenVariantId: string | undefined;
  editable: boolean;
  onChoose: (variantId: string | null) => void;
}) {
  if (!skill.eferund || skill.eferund.length === 0) return null;

  const interactive = editable && baseSelected;
  const options: { id: string | null; display: DisplaySkill }[] = [
    { id: null, display: skill },
    ...skill.eferund.map((v) => ({ id: v.id, display: v })),
  ];

  // Та же сетка в 4 колонки, что и у активных/пассивных навыков — чтобы
  // иконки построчно выравнивались по тем же вертикалям, без подписи.
  return (
    <div className={cn("grid grid-cols-4 gap-0.5", !baseSelected && "opacity-40")}>
      {options.map((opt) => {
        const active = (chosenVariantId ?? null) === opt.id;
        return (
          <Tooltip key={opt.id ?? "base"}>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={!interactive}
                onClick={() => interactive && onChoose(opt.id)}
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-md border-2 transition-colors",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/30",
                  interactive && "cursor-pointer hover:border-primary/60",
                  !interactive && "cursor-default",
                )}
              >
                <SkillIcon
                  src={opt.display.iconUrl}
                  alt={opt.display.name}
                  size={34}
                  dimmed={!active}
                />
                {active && (
                  <Check className="absolute -right-1 -bottom-1 size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground ring-2 ring-background" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-none pointer-events-none p-3">
              <SkillTooltipBody skill={opt.display} kind={skill.kind} />
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

function SkillButton({
  skill,
  display,
  selected,
  thresholdLocked,
  budgetLocked,
  remaining,
  editable,
  clickable,
  onToggle,
}: {
  skill: Skill;
  display: DisplaySkill;
  selected: boolean;
  thresholdLocked: boolean;
  budgetLocked: boolean;
  remaining: number;
  editable: boolean;
  clickable: boolean;
  onToggle: () => void;
}) {
  const locked = thresholdLocked || budgetLocked;
  const disabled = !clickable || (!selected && locked);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={cn(
            "relative flex size-10 items-center justify-center rounded-md border-2 transition-colors",
            selected
              ? "border-primary bg-primary/10"
              : "border-border bg-muted/30",
            clickable && !disabled && "cursor-pointer hover:border-primary/60",
            !clickable && "cursor-default",
          )}
        >
          <SkillIcon src={display.iconUrl} alt={display.name} size={34} dimmed={!selected} />
          {!selected && locked && editable && (
            <Lock className="absolute -right-1 -bottom-1 size-3.5 rounded-full bg-background p-0.5 text-muted-foreground" />
          )}
          {!selected && thresholdLocked && editable && remaining > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-background">
              {remaining}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-none pointer-events-none p-3">
        <SkillTooltipBody skill={display} kind={skill.kind} />
        {!selected && thresholdLocked && (
          <p className="mt-1.5 text-xs text-amber-500">
            Нужно взять ещё навыков в этой ветке: {skill.unlockThreshold}
          </p>
        )}
        {!selected && !thresholdLocked && budgetLocked && (
          <p className="mt-1.5 text-xs text-amber-500">
            Нет свободных очков навыков
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function SpecializationColumn({
  specializationId,
  specBuild,
  editable,
  pointsLeft,
  onChange,
}: {
  specializationId: string;
  specBuild: SpecializationBuild;
  editable: boolean;
  pointsLeft: number;
  onChange: (next: SpecializationBuild) => void;
}) {
  const spec = getSpecialization(specializationId);
  const skills = getSkillsForSpecialization(specializationId);

  if (!hasSkillData(specializationId)) {
    return (
      <div className="flex w-[190px] flex-none flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        <span className="font-medium">{spec?.name ?? specializationId}</span>
        <span className="text-xs">Нет данных о навыках</span>
      </div>
    );
  }

  const active = skills.filter((s) => s.kind === "active");
  const passive = skills.filter((s) => s.kind === "passive");
  const activeSelectedCount = activeCountOf(skills, specBuild.selected);

  const toggleSkill = (skill: Skill) => {
    const isSelected = specBuild.selected.includes(skill.id);
    if (isSelected) {
      const nextSelected = removeWithCascade(skills, specBuild.selected, skill.id);
      const removedIds = specBuild.selected.filter((id) => !nextSelected.includes(id));
      const nextEferund = { ...specBuild.eferund };
      for (const id of removedIds) delete nextEferund[id];
      onChange({ selected: nextSelected, eferund: nextEferund });
    } else {
      const threshold = skill.unlockThreshold ?? 0;
      if (activeSelectedCount < threshold) return;
      if (skill.kind === "active" && pointsLeft <= 0) return;
      onChange({
        selected: [...specBuild.selected, skill.id],
        eferund: specBuild.eferund,
      });
    }
  };

  const setEferund = (skillId: string, variantId: string | null) => {
    const nextEferund = { ...specBuild.eferund };
    if (variantId) nextEferund[skillId] = variantId;
    else delete nextEferund[skillId];
    onChange({ selected: specBuild.selected, eferund: nextEferund });
  };

  const eferundSkills = active.filter((s) => s.eferund && s.eferund.length > 0);

  // Порог пассивки не хранится в данных — она открывается по позиции в
  // списке пассивок ветки: 1-я требует 3 взятых активных, 2-я — 4, ...
  // 6-я — 8. Правило единое для всех веток (в каждой ровно 6 пассивок).
  const renderGrid = (list: Skill[]) => (
    <div className="grid grid-cols-4 gap-0.5">
      {list.map((skill) => {
        const threshold =
          skill.kind === "passive"
            ? passive.indexOf(skill) + 3
            : (skill.unlockThreshold ?? 0);
        const thresholdLocked = activeSelectedCount < threshold;
        // Пассивки бесплатны и не переключаются вручную — становятся
        // цветными сами, как только в ветке набрано достаточно активных.
        const selected =
          skill.kind === "passive"
            ? !thresholdLocked
            : specBuild.selected.includes(skill.id);
        const budgetLocked = skill.kind === "active" && pointsLeft <= 0;
        const display = selected
          ? (skill.eferund?.find((v) => v.id === specBuild.eferund[skill.id]) ??
            skill)
          : skill;
        return (
          <SkillButton
            key={skill.id}
            skill={skill}
            display={display}
            selected={selected}
            thresholdLocked={thresholdLocked}
            budgetLocked={budgetLocked}
            remaining={threshold - activeSelectedCount}
            editable={editable}
            clickable={editable && skill.kind === "active"}
            onToggle={() => toggleSkill(skill)}
          />
        );
      })}
    </div>
  );

  const isEmpty = specBuild.selected.length === 0;

  return (
    <div className="w-[190px] flex-none space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">{spec?.name ?? specializationId}</div>
        <div className="text-xs text-muted-foreground">
          {activeSelectedCount}/{active.length}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Активные
        </div>
        {renderGrid(active)}
      </div>

      {passive.length > 0 && (
        <div className="space-y-1">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Пассивные
          </div>
          {renderGrid(passive)}
        </div>
      )}

      {editable && eferundSkills.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Эфе&apos;рунд
          </div>
          <div className="space-y-1">
            {eferundSkills.map((skill) => (
              <EferundRow
                key={skill.id}
                skill={skill}
                baseSelected={specBuild.selected.includes(skill.id)}
                chosenVariantId={specBuild.eferund[skill.id]}
                editable={editable}
                onChoose={(variantId) => setEferund(skill.id, variantId)}
              />
            ))}
          </div>
        </div>
      )}

      {editable && !isEmpty && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            className="cursor-pointer text-xs text-muted-foreground hover:text-destructive"
            onClick={() => onChange({ selected: [], eferund: {} })}
          >
            Сбросить ветку
          </button>
        </div>
      )}
    </div>
  );
}

export default function SkillBuildEditor({
  specializationIds,
  build,
  editable,
  onChange,
}: {
  specializationIds: string[];
  build: RoleSkillBuild;
  editable: boolean;
  onChange: (next: RoleSkillBuild) => void;
}) {
  const ids = specializationIds.filter(Boolean);
  if (ids.length === 0) return null;

  const used = totalActiveSelected(build);
  const pointsLeft = SKILL_POINTS_BUDGET - used;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Билд
        </div>
        <div
          className={cn(
            "text-xs font-medium",
            pointsLeft < 0 ? "text-destructive" : "text-muted-foreground",
          )}
        >
          Очки: {used} / {SKILL_POINTS_BUDGET}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {ids.map((specializationId) => (
          <SpecializationColumn
            key={specializationId}
            specializationId={specializationId}
            specBuild={build[specializationId] ?? EMPTY_SPEC_BUILD}
            editable={editable}
            pointsLeft={pointsLeft}
            onChange={(next) => onChange({ ...build, [specializationId]: next })}
          />
        ))}
      </div>
    </div>
  );
}
