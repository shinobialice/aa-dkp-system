import { notFound } from "next/navigation";
import { getCurrentPromoEvent } from "@/server/promo";
import { moscowTodayKey } from "@/widgets/Attendance/attendanceModel";
import PromoQuests from "@/widgets/PromoQuests";
import { promoStartKey } from "@/widgets/PromoQuests/promoWeeks";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PromoPage({ params }: Props) {
  const { slug } = await params;
  const event = await getCurrentPromoEvent();
  if (!event || event.promo !== slug) notFound();

  return (
    <PromoQuests
      event={event}
      startKey={promoStartKey(event.startsAt)}
      todayKey={moscowTodayKey()}
    />
  );
}
