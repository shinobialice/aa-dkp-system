import Image from "next/image";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";

const GOLD_ICON_URL = "https://archeagecodex.com/items/gold.png";

const SIZES = {
  sm: { icon: 14, text: "", iconClass: "" },
  md: { icon: 20, text: "text-xl", iconClass: "size-4.5 sm:size-5" },
  lg: {
    icon: 20,
    text: "text-2xl sm:text-3xl",
    iconClass: "size-4.5 sm:size-5",
  },
};

type GoldAmountProps = {
  value: number;
  size?: keyof typeof SIZES;
  className?: string;
};

function GoldAmount({ value, size = "sm", className }: GoldAmountProps) {
  const { icon, text, iconClass } = SIZES[size];
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold tabular-nums",
        size === "sm" ? "gap-1.5" : "gap-2 leading-tight",
        text,
        className,
      )}
    >
      <Image
        src={GOLD_ICON_URL}
        alt=""
        width={icon}
        height={icon}
        className={iconClass}
      />
      {formatNumber(value, 0)}
    </span>
  );
}

function GoldIcon({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={GOLD_ICON_URL}
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}

export { GoldAmount, GoldIcon, GOLD_ICON_URL };
