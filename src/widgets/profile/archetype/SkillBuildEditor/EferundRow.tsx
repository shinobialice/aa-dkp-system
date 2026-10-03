import { Check } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { type Skill } from "../skills";
import { type DisplaySkill } from "./skillBuildModel";
import SkillTooltipBody from "./SkillTooltipBody";
import SkillIcon from "./SkillIcon";

export default function EferundRow({
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
    <div
      className={cn("grid grid-cols-4 gap-0.5", !baseSelected && "opacity-40")}
    >
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
