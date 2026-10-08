import type { CalculatorBuild } from "../calculatorModel";
import EpheDialog from "./EpheDialog";
import SealsDialog from "./SealsDialog";
import SkillsDialog from "./SkillsDialog";

type Props = {
  build: CalculatorBuild;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
};

export default function BuildExtras({ build, onUpdate }: Props) {
  return (
    <>
      <SkillsDialog build={build} onUpdate={onUpdate} />
      <SealsDialog build={build} onUpdate={onUpdate} />
      <EpheDialog build={build} onUpdate={onUpdate} />
    </>
  );
}
