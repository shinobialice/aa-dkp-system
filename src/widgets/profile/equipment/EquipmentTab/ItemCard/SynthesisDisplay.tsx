import { highlightNumbers } from "../../highlightNumbers";
import {
  formatSynthesisValue,
  type SynthesisRoll,
} from "../../itemsData/synthesis";

type Props = {
  title: string;
  rolls: SynthesisRoll[];
};

export default function SynthesisDisplay({ title, rolls }: Props) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">{title}</div>
      {rolls.map((roll, slot) => (
        <div key={slot} className="text-xs text-green-500">
          {highlightNumbers(
            `${roll.effect.label}: ${formatSynthesisValue(roll)}`,
          )}
        </div>
      ))}
    </div>
  );
}
