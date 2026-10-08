import type { ReactNode } from "react";
import BuildExtras from "../BuildExtras";
import ChangesNote from "../ChangesNote";
import ClassSelect from "../ClassSelect";
import type { CalculatorBuild, TrackedBuild } from "../calculatorModel";

type Props = {
  doll: TrackedBuild;
  dollMenu: ReactNode;
  targetMenu: ReactNode;
  saveButton: ReactNode;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
  onReset: () => void;
  onCompareWithOriginal: () => void;
};

export default function BuildToolbar({
  doll,
  dollMenu,
  targetMenu,
  saveButton,
  onUpdate,
  onReset,
  onCompareWithOriginal,
}: Props) {
  return (
    <div className="flex w-full flex-wrap items-center gap-x-5 gap-y-2">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Кукла</span>
        {dollMenu}
        {saveButton}
        <ClassSelect
          value={doll.current.roleClass}
          onChange={(roleClass) => onUpdate({ roleClass })}
        />
        <BuildExtras build={doll.current} onUpdate={onUpdate} />
      </div>
      <ChangesNote
        build={doll}
        onReset={onReset}
        onCompareWithOriginal={onCompareWithOriginal}
      />
      <div className="flex items-center gap-2 sm:ml-auto">
        <span className="text-sm text-muted-foreground">Сравнить с</span>
        {targetMenu}
      </div>
    </div>
  );
}
