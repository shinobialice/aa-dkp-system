import { getSpecialization } from "../specializationsData";
import {
  getSkillsForSpecialization,
  hasSkillData,
  type Skill,
} from "../skills";
import type { SpecializationBuild } from "@/actions/getUserSkillBuild";
import { activeCountOf, removeWithCascade } from "./skillBuildModel";
import EferundRow from "./EferundRow";
import SkillButton from "./SkillButton";

export default function SpecializationColumn({
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
      <div className="flex w-47.5 flex-none flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
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
      const nextSelected = removeWithCascade(
        skills,
        specBuild.selected,
        skill.id,
      );
      const removedIds = specBuild.selected.filter(
        (id) => !nextSelected.includes(id),
      );
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
    <div className="w-47.5 flex-none space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">
          {spec?.name ?? specializationId}
        </div>
        <div className="text-xs text-muted-foreground">
          {activeSelectedCount}/{active.length}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
          Активные
        </div>
        {renderGrid(active)}
      </div>

      {passive.length > 0 && (
        <div className="space-y-1">
          <div className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
            Пассивные
          </div>
          {renderGrid(passive)}
        </div>
      )}

      {editable && eferundSkills.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
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
