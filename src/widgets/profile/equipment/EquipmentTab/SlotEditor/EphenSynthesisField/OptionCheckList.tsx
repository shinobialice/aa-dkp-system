import type { EphenSynthesisOption } from "../../../itemsData/ephenSynthesisData";
import { formatOption, type OptionContext } from "./formatOption";

type Props = {
  options: EphenSynthesisOption[];
  selected: string[];
  limit: number;
  context: OptionContext;
  onToggle: (key: string) => void;
};

export default function OptionCheckList({
  options,
  selected,
  limit,
  context,
  onToggle,
}: Props) {
  return (
    <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border p-1">
      {options.map((option) => {
        const checked = selected.includes(option.key);
        const disabled = !checked && selected.length >= limit;
        return (
          <label
            key={option.key}
            className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent ${
              disabled
                ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                : ""
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={() => onToggle(option.key)}
              className="cursor-pointer"
            />
            <span className="min-w-0 flex-1 truncate">
              {formatOption(option, context)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
