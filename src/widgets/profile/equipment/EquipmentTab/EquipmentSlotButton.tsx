import { useState, type ComponentProps } from "react";
import Image from "next/image";
import type { UserEquipment } from "@/actions/getUserEquipment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { getSealGradeColor } from "@/widgets/profile/seals/sealsData";
import type { EquipmentSlot } from "../equipmentData";
import { findGearItem, type GearItem } from "../itemsData";
import { findRune } from "../itemsData/runes";
import { GearItemIcon } from "../GearItemIcon";
import { RuneIcon } from "../RuneIcon";
import { RuneTooltip } from "../RuneTooltip";
import ItemCard from "./ItemCard";
import SlotEditor from "./SlotEditor";
import SlotReadonlyView from "./SlotReadonlyView";
import type { SlotValues } from "./slotValues";
import { DEFAULT_GRADE } from "./slotLayout";

type Side = "left" | "right";

type Props = {
  slot: EquipmentSlot;
  item: UserEquipment | undefined;
  equipment: UserEquipment[];
  canEdit: boolean;
  onSave: (values: SlotValues) => Promise<void>;
  tooltipSide?: Side;
  showRune?: boolean;
  compareItem?: UserEquipment;
};

const EMPTY_GLOW = "var(--border)";
const DEFAULT_GLOW = "#d6b673";

export default function EquipmentSlotButton({
  slot,
  item,
  equipment,
  canEdit,
  onSave,
  tooltipSide = "left",
  showRune = true,
  compareItem,
}: Props) {
  const [open, setOpen] = useState(false);
  const gearItem = findGearItem(slot.key, item?.item_name);
  const rune = item?.rune_id ? findRune(item.rune_id) : undefined;

  const trigger = (
    <DialogTrigger asChild>
      <SlotIconButton equipmentSlot={slot} item={item} gearItem={gearItem} />
    </DialogTrigger>
  );

  return (
    <div className="relative">
      <Dialog open={open} onOpenChange={setOpen}>
        {gearItem && item ? (
          <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent
              side={tooltipSide}
              className="dark pointer-events-none w-64 border-border bg-background p-3 text-foreground"
            >
              <ItemCard
                slotKey={slot.key}
                item={item}
                gearItem={gearItem}
                equipment={equipment}
                compareItem={compareItem}
              />
            </TooltipContent>
          </Tooltip>
        ) : (
          trigger
        )}
        <DialogContent
          aria-describedby={undefined}
          className={cn(
            "dark flex flex-col gap-0 overflow-hidden border-border bg-background p-0 text-foreground",
            canEdit
              ? "h-[100dvh] max-h-[100dvh] w-full max-w-none rounded-none sm:h-auto sm:max-h-[90dvh] sm:max-w-4xl sm:rounded-xl"
              : "w-full max-w-2xl",
          )}
        >
          <DialogHeader className="shrink-0 gap-0.5 border-b px-5 py-4 pr-12 text-left">
            <DialogTitle>{slot.label}</DialogTitle>
            {canEdit && (
              <p className="text-sm text-muted-foreground">
                Изменения видны в карточке сразу, сохраняются кнопкой внизу
              </p>
            )}
          </DialogHeader>
          {canEdit && (
            <SlotEditor
              slot={slot}
              item={item}
              equipment={equipment}
              onCancel={() => setOpen(false)}
              onSave={async (values) => {
                await onSave(values);
                setOpen(false);
              }}
            />
          )}
          {!canEdit && (
            <SlotReadonlyView
              slotKey={slot.key}
              item={item}
              gearItem={gearItem}
            />
          )}
        </DialogContent>
      </Dialog>
      {showRune && rune && (
        <RuneTooltip rune={rune} side={tooltipSide} equipment={equipment}>
          <div
            className={`absolute top-1/2 flex size-7 -translate-y-1/2 cursor-default items-center justify-center overflow-hidden rounded-md border border-border bg-background shadow-sm ${
              tooltipSide === "left" ? "-left-8" : "-right-8"
            }`}
          >
            <RuneIcon rune={rune} size={24} />
          </div>
        </RuneTooltip>
      )}
    </div>
  );
}

function SlotIconButton({
  equipmentSlot,
  item,
  gearItem,
  ...buttonProps
}: {
  equipmentSlot: EquipmentSlot;
  item: UserEquipment | undefined;
  gearItem: GearItem | undefined;
} & ComponentProps<"button">) {
  const grade = item?.grade ?? DEFAULT_GRADE;
  const glow = gearItem
    ? (getSealGradeColor(grade) ?? DEFAULT_GLOW)
    : EMPTY_GLOW;
  const enchant = item?.enchant ?? 0;

  return (
    <button
      type="button"
      {...buttonProps}
      className="group relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 8px 0 color-mix(in srgb, ${glow} 65%, transparent), 0 0 18px 2px color-mix(in srgb, ${glow} 40%, transparent), 0 0 28px 6px color-mix(in srgb, ${glow} 20%, transparent)`,
        }}
      />
      {gearItem && (
        <GearItemIcon
          item={gearItem}
          grade={grade}
          className="transition-transform duration-200 ease-out group-hover:scale-110"
        />
      )}
      {!gearItem && (
        <Image
          src={equipmentSlot.iconUrl}
          alt={equipmentSlot.label}
          fill
          sizes="44px"
          className="object-contain transition-transform duration-200 ease-out group-hover:scale-110"
        />
      )}
      {gearItem && enchant > 0 && (
        <span className="pointer-events-none absolute -bottom-1.5 -left-1 z-10 rounded bg-green-600 px-1 text-2xs leading-[15px] font-extrabold text-white shadow-sm">
          +{enchant}
        </span>
      )}
    </button>
  );
}
