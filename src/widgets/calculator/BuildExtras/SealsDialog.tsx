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
import SealSlotEditor, {
  type SealSlot,
} from "@/widgets/profile/seals/SealSlotEditor";
import type { CalculatorBuild } from "../calculatorModel";
import {
  sealSlotsOf,
  sealsFromSlots,
  takenSealNames,
  withSealLevel,
  withSealName,
} from "./extrasModel";

type Props = {
  build: CalculatorBuild;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
};

export default function SealsDialog({ build, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SealSlot[]>(sealSlotsOf(build.seals));

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(sealSlotsOf(build.seals));
    setOpen(next);
  };

  const handleApply = () => {
    onUpdate({ seals: sealsFromSlots(draft) });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Печати
          <span className="text-muted-foreground tabular-nums">
            {build.seals.length}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Печати</DialogTitle>
          <DialogDescription>
            Выберите до трёх печатей и их уровень. Бонусы прокачанных уровней
            учитываются в характеристиках
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
          {draft.map((slot, index) => (
            <SealSlotEditor
              key={index}
              index={index}
              slot={slot}
              takenNames={takenSealNames(draft, index)}
              onNameChange={(name) =>
                setDraft((current) => withSealName(current, index, name))
              }
              onLevelChange={(level) =>
                setDraft((current) => withSealLevel(current, index, level))
              }
            />
          ))}
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
