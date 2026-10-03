import type { EphenSynthesisOption } from "../../../itemsData/ephenSynthesisData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { formatOption, type OptionContext } from "./formatOption";

const NONE = "none";

type Props = {
  options: EphenSynthesisOption[];
  value: string;
  excluded: string;
  placeholder: string;
  context: OptionContext;
  onChange: (value: string) => void;
};

export default function StatSelect({
  options,
  value,
  excluded,
  placeholder,
  context,
  onChange,
}: Props) {
  return (
    <Select
      value={value || NONE}
      onValueChange={(next) => onChange(next === NONE ? "" : next)}
    >
      <SelectTrigger className="w-full cursor-pointer">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>Выберите</SelectItem>
        {options
          .filter((option) => option.key !== excluded)
          .map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {formatOption(option, context)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
