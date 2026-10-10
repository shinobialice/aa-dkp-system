import type { ComponentProps } from "react";
import { Cake } from "lucide-react";
import { SidebarMenuButton } from "@/shared/ui";
import BalloonsArt from "./BalloonsArt";
import UncheeredDot from "./UncheeredDot";

type Props = ComponentProps<"button"> & {
  label: string;
  names: string;
  hasUncheered: boolean;
};

export default function SidebarAnniversaryButton({
  label,
  names,
  hasUncheered,
  ...props
}: Props) {
  return (
    <SidebarMenuButton
      size="lg"
      tooltip={label}
      className="cursor-pointer bg-gradient-to-br from-primary/15 via-chart-1/10 to-transparent hover:from-primary/25 data-[state=open]:from-primary/25"
      {...props}
    >
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
        <Cake className="size-4" />
        {hasUncheered && (
          <UncheeredDot className="absolute -top-0.5 -right-0.5" />
        )}
      </span>
      <span className="grid min-w-0 flex-1 text-left leading-tight">
        <span className="truncate font-semibold">Юбилей в гильдии</span>
        <span className="truncate text-xs text-muted-foreground">{names}</span>
      </span>
      <span className="flex h-9 w-11 shrink-0">
        <BalloonsArt className="size-full" />
      </span>
    </SidebarMenuButton>
  );
}
