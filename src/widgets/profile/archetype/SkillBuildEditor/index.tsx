"use client";
import { cn } from "@/shared/lib/tw-merge";
import { SKILL_POINTS_BUDGET } from "../skills";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import { EMPTY_SPEC_BUILD, totalActiveSelected } from "./skillBuildModel";
import SpecializationColumn from "./SpecializationColumn";

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
            onChange={(next) =>
              onChange({ ...build, [specializationId]: next })
            }
          />
        ))}
      </div>
    </div>
  );
}
