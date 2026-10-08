import type { VoucherZone } from "@/actions/voucherBoardActions";
import type { GameServer } from "@/shared/config/gameServers";
import { cn } from "@/shared/lib/tw-merge";
import VoucherAmountPicker from "./VoucherAmountPicker";
import { amountTone } from "./voucherModel";

type Props = {
  zone: VoucherZone;
  server: GameServer;
  needed: number;
  onReported: () => Promise<void>;
};

export default function VoucherZoneValue({
  zone,
  server,
  needed,
  onReported,
}: Props) {
  if (zone.source === "gisaa" && zone.amount !== null) {
    return (
      <span
        title="По данным gisaa.ru"
        className={cn("font-semibold", amountTone(zone.amount, needed))}
      >
        {zone.amount}
      </span>
    );
  }

  return (
    <VoucherAmountPicker
      zone={zone}
      server={server}
      needed={needed}
      onReported={onReported}
    />
  );
}
