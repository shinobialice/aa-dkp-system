import { useState } from "react";
import type { UserEquipment } from "@/actions/getUserEquipment";
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
import EpheSidebar from "@/widgets/profile/ephe/EpheSidebar";
import { EPHE_SIDEBAR_GROUPS } from "@/widgets/profile/ephe/epheSlotGroups";
import {
  epheSlotCount,
  equipmentBySlot,
  type CalculatorBuild,
} from "../calculatorModel";
import EpheSlotLevels from "./EpheSlotLevels";
import { withEpheLevel, withMaxEphe } from "./extrasModel";

type Props = {
  build: CalculatorBuild;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
};

const FIRST_EPHE_SLOT = EPHE_SIDEBAR_GROUPS[0].slots[0];

export default function EpheDialog({ build, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<UserEquipment[]>(build.equipment);
  const [activeSlot, setActiveSlot] = useState(FIRST_EPHE_SLOT);
  const draftBySlot = equipmentBySlot(draft);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(build.equipment);
    setOpen(next);
  };

  const handleLevelSelect = (level: number) => {
    setDraft((current) => withEpheLevel(current, activeSlot, level));
  };

  const handleApply = () => {
    onUpdate({ equipment: draft });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Эфе
          <span className="text-muted-foreground tabular-nums">
            {epheSlotCount(build)}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Печати Эфе</DialogTitle>
          <DialogDescription>
            Уровень печати Эфе для каждого надетого предмета. Она поднимает
            характеристики предмета
          </DialogDescription>
        </DialogHeader>
        <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1 lg:flex-row">
          <EpheSidebar
            equipmentBySlot={draftBySlot}
            activeSlot={activeSlot}
            onSelect={setActiveSlot}
          />
          <div className="min-w-0 flex-1">
            <EpheSlotLevels
              slot={activeSlot}
              item={draftBySlot[activeSlot]}
              onLevelSelect={handleLevelSelect}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setDraft(withMaxEphe)}
          >
            Замаксить всё
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
