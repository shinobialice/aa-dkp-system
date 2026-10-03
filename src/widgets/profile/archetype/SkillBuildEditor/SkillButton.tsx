import { Lock } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { type Skill } from "../skills";
import { type DisplaySkill } from "./skillBuildModel";
import SkillTooltipBody from "./SkillTooltipBody";
import SkillIcon from "./SkillIcon";

export default function SkillButton({
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
  const locked = !selected && (thresholdLocked || budgetLocked);
  const disabled = !clickable || locked;
  const remainingBadge =
    !selected && thresholdLocked && editable && remaining > 0;
  const hint = selected ? null : lockHint(skill, thresholdLocked, budgetLocked);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={buttonClass(selected, clickable, disabled)}
        >
          <SkillIcon
            src={display.iconUrl}
            alt={display.name}
            size={34}
            dimmed={!selected}
          />
          {locked && editable && (
            <Lock className="absolute -right-1 -bottom-1 size-3.5 rounded-full bg-background p-0.5 text-muted-foreground" />
          )}
          {remainingBadge && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-amber-500 text-2xs font-bold text-white ring-2 ring-background">
              {remaining}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-none pointer-events-none p-3">
        <SkillTooltipBody skill={display} kind={skill.kind} />
        {hint && <p className="mt-1.5 text-xs text-amber-500">{hint}</p>}
      </TooltipContent>
    </Tooltip>
  );
}

function lockHint(
  skill: Skill,
  thresholdLocked: boolean,
  budgetLocked: boolean,
) {
  if (thresholdLocked) {
    return `Нужно взять ещё навыков в этой ветке: ${skill.unlockThreshold}`;
  }
  return budgetLocked ? "Нет свободных очков навыков" : null;
}

function buttonClass(selected: boolean, clickable: boolean, disabled: boolean) {
  return cn(
    "relative flex size-10 items-center justify-center rounded-md border-2 transition-colors",
    selected ? "border-primary bg-primary/10" : "border-border bg-muted/30",
    clickable && !disabled && "cursor-pointer hover:border-primary/60",
    !clickable && "cursor-default",
  );
}
