import type { ComponentProps } from "react";
import BalloonsArt from "./BalloonsArt";
import UncheeredDot from "./UncheeredDot";

type Props = ComponentProps<"button"> & {
  label: string;
  hasUncheered: boolean;
};

export default function FloatingBalloonsButton({
  label,
  hasUncheered,
  ...props
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="relative block h-9 w-20 cursor-pointer rounded-b-lg outline-none transition-transform hover:translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      {...props}
    >
      <BalloonsArt className="absolute top-0 left-0 h-[67.5px] w-20" />
      {hasUncheered && <UncheeredDot className="absolute right-1 -bottom-1" />}
    </button>
  );
}
