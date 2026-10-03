import {
  getEphenSynthesisOptionRange,
  type EphenSynthesisOption,
} from "../../../itemsData/ephenSynthesisData";

export type OptionContext = { grade: number; minGrade: number };

export function formatOption(
  option: EphenSynthesisOption,
  { grade, minGrade }: OptionContext,
) {
  const range = getEphenSynthesisOptionRange(option, grade, minGrade);
  if (!range) return option.label;
  const unit = option.isPercent ? "%" : "";
  return `${option.label}: ${signed(range[0])}..${signed(range[1])}${unit}`;
}

function signed(value: number) {
  return value >= 0 ? `+${value}` : String(value);
}
