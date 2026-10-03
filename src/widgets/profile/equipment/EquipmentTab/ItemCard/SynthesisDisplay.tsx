import { highlightNumbers } from "../../highlightNumbers";

export type SynthesisLine = {
  key: string | number;
  label: string;
  value: number;
  isPercent: boolean;
};

type Props = {
  title: string;
  lines: SynthesisLine[];
  showPlus?: boolean;
};

export default function SynthesisDisplay({ title, lines, showPlus }: Props) {
  if (lines.length === 0) return null;

  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">{title}</div>
      {lines.map((line) => (
        <div key={line.key} className="text-xs text-green-500">
          {highlightNumbers(
            `${line.label}: ${showPlus && line.value >= 0 ? "+" : ""}${line.value}${line.isPercent ? "%" : " ед."}`,
          )}
        </div>
      ))}
    </div>
  );
}
