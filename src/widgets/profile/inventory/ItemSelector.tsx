import type { InventoryItem } from "@/actions/getUserInventory";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";
import {
  NONE,
  PRESENT,
  SELECTOR_OPTIONS,
  selectorKind,
  selectorValue,
} from "./inventoryModel";

type Props = {
  itemName: string;
  userItem?: InventoryItem;
  onChange: (value: string) => void;
  canEdit: boolean;
};

const TRIGGER_CLASS =
  "h-6 w-auto min-w-0 gap-1 rounded-full border-none bg-secondary px-2.5 text-2xs font-medium shadow-none hover:bg-secondary/80 cursor-pointer data-[size=sm]:h-6";

const BADGE_TONES = {
  tier2:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  present:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  missing: "bg-muted text-muted-foreground",
};

export default function ItemSelector({
  itemName,
  userItem,
  onChange,
  canEdit,
}: Props) {
  const kind = selectorKind(itemName);

  if (!canEdit) {
    const value =
      kind === "dragon" && userItem ? PRESENT : selectorValue(kind, userItem);
    return <PresenceBadge value={value} />;
  }

  return (
    <Select value={selectorValue(kind, userItem)} onValueChange={onChange}>
      <SelectTrigger size="sm" className={TRIGGER_CLASS}>
        <SelectValue placeholder="Выбрать" />
      </SelectTrigger>
      <SelectContent>
        {SELECTOR_OPTIONS[kind].map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PresenceBadge({ value }: { value: string }) {
  const tone = badgeTone(value);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${BADGE_TONES[tone]}`}
    >
      {value}
    </span>
  );
}

function badgeTone(value: string): keyof typeof BADGE_TONES {
  if (value === "T2") return "tier2";
  return value === NONE ? "missing" : "present";
}
