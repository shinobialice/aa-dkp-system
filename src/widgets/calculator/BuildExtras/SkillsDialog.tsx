import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";
import ArchetypeSpecPicker, {
  SPEC_KEYS,
  type SpecKey,
} from "@/widgets/profile/archetype/ArchetypeSpecPicker";
import SkillBuildEditor from "@/widgets/profile/archetype/SkillBuildEditor";
import { selectedSkillCount, type CalculatorBuild } from "../calculatorModel";
import {
  archetypeOf,
  chosenSpecializations,
  skillsDraftOf,
  withSpecialization,
  type SkillsDraft,
} from "./extrasModel";

type Props = {
  build: CalculatorBuild;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
};

export default function SkillsDialog({ build, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SkillsDraft>(skillsDraftOf(build));

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(skillsDraftOf(build));
    setOpen(next);
  };

  const handleSpecializationChange = (key: SpecKey, id: string | null) => {
    setDraft((current) =>
      withSpecialization(current, SPEC_KEYS.indexOf(key), id),
    );
  };

  const handleApply = () => {
    onUpdate(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Умения
          <span className="text-muted-foreground tabular-nums">
            {selectedSkillCount(build)}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Умения</DialogTitle>
          <DialogDescription>
            Выберите три специализации и умения. Пассивные умения веток
            учитываются в характеристиках
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
          <ArchetypeSpecPicker
            value={archetypeOf(draft.specializations)}
            onChange={handleSpecializationChange}
          />
          <SkillBuildEditor
            specializationIds={chosenSpecializations(draft.specializations)}
            build={draft.skillBuild}
            editable
            onChange={(skillBuild) =>
              setDraft((current) => ({ ...current, skillBuild }))
            }
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Отмена
          </Button>
          <Button className="cursor-pointer" onClick={handleApply}>
            Применить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
