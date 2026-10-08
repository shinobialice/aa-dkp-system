import { isGameServer } from "@/shared/config/gameServers";
import type { PromoQuestVoucher } from "@/shared/config/promoQuests";
import VoucherLocations from "./VoucherLocations";

type Props = {
  voucher: PromoQuestVoucher;
  server: string | null;
};

export default function QuestVoucher({ voucher, server }: Props) {
  if (server === null || !isGameServer(server)) {
    return (
      <span className="text-xs text-muted-foreground">
        Укажите сервер в настройках персонажа, чтобы видеть, где сдавать ресурсы
      </span>
    );
  }

  return <VoucherLocations voucher={voucher} server={server} />;
}
