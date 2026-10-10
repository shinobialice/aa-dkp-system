"use client";

import { useIsMobile } from "@/shared/lib/use-mobile";
import AnniversaryPopover from "./AnniversaryPopover";

type Props = {
  placement: "sidebar" | "floating";
};

export default function AnniversaryBalloons({ placement }: Props) {
  const isMobile = useIsMobile();
  const activePlacement = isMobile ? "floating" : "sidebar";
  if (placement !== activePlacement) return null;
  return <AnniversaryPopover placement={placement} />;
}
