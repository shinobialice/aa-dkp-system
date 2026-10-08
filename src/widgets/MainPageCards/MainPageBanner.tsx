import type { EventSettings } from "@/actions/eventSettings";
import type { MarketplaceListing } from "@/actions/marketplaceActions";
import { isEventActive } from "@/shared/lib/eventStatus";
import EventBanner from "./EventBanner";
import ListingsShowcase from "./ListingsShowcase";

type Props = {
  event: EventSettings | undefined;
  listings: MarketplaceListing[] | undefined;
};

export default function MainPageBanner({ event, listings }: Props) {
  if (event && !event.promo && isEventActive(event)) {
    return <EventBanner event={event} />;
  }
  if (listings && listings.length > 0) {
    return <ListingsShowcase listings={listings} />;
  }
  return null;
}
