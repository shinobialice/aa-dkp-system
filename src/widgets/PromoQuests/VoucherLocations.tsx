"use client";

import { getVoucherBoard } from "@/actions/voucherBoardActions";
import { useAsyncData } from "@/hooks/useAsyncData";
import type { GameServer } from "@/shared/config/gameServers";
import type { PromoQuestVoucher } from "@/shared/config/promoQuests";
import {
  VOUCHER_RESOURCE_NAMES,
  VOUCHER_SIDE_NAMES,
  type VoucherSide,
} from "@/shared/config/voucherBoard";
import { errorMessage } from "@/shared/lib/errorMessage";
import VoucherZoneValue from "./VoucherZoneValue";

const SIDES: VoucherSide[] = ["west", "east"];

type Props = {
  voucher: PromoQuestVoucher;
  server: GameServer;
};

export default function VoucherLocations({ voucher, server }: Props) {
  const board = useAsyncData(`voucher:${server}`, () =>
    getVoucherBoard(server),
  );
  const sides = board.data?.[voucher.resource];

  return (
    <div className="mt-1 flex flex-col gap-1 rounded-md border bg-muted/40 px-2 py-1.5 text-xs">
      <span className="font-medium">
        {VOUCHER_RESOURCE_NAMES[voucher.resource]} · сдать {voucher.amount} ·{" "}
        {server}
      </span>
      {board.isLoading && (
        <span className="text-muted-foreground">Загружаю…</span>
      )}
      {board.error !== undefined && (
        <span className="text-destructive">
          {errorMessage(board.error, "Не удалось загрузить, где сдавать")}
        </span>
      )}
      {sides &&
        SIDES.map((side) => (
          <div key={side} className="flex flex-wrap items-center gap-x-2">
            <span className="text-muted-foreground">
              {VOUCHER_SIDE_NAMES[side]}:
            </span>
            {sides[side].map((zone) => (
              <span key={zone.zone} className="inline-flex items-center gap-1">
                {zone.zone}
                <VoucherZoneValue
                  zone={zone}
                  server={server}
                  needed={voucher.amount}
                  onReported={board.reload}
                />
              </span>
            ))}
          </div>
        ))}
    </div>
  );
}
