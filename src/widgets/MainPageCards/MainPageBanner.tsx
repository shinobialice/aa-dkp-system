import type { EventSettings } from "@/actions/eventSettings";
import { isEventActive } from "@/shared/lib/eventStatus";
import EventBanner from "./EventBanner";

type Props = {
  event: EventSettings | undefined;
};

export default function MainPageBanner({ event }: Props) {
  if (!event || event.promo || !isEventActive(event)) return null;
  return <EventBanner event={event} />;
}
