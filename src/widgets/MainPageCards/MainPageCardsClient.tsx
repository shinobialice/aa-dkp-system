"use client";

import { Loader } from "lucide-react";
import { getEventSettings } from "@/actions/eventSettings";
import getStats from "@/actions/getStats";
import { getMarketplaceListings } from "@/actions/marketplaceActions";
import { useAsyncData } from "@/hooks/useAsyncData";
import BossRespawnHistory from "./BossRespawnHistory";
import GuildComposition from "./GuildComposition";
import MainPageBanner from "./MainPageBanner";
import MainPageHeader from "./MainPageHeader";
import RespawnTracker from "./RespawnTracker";
import UpcomingEvents from "./UpcomingEvents";

export default function MainPageCardsClient() {
  const stats = useAsyncData("main-stats", getStats);
  const event = useAsyncData("event-settings", getEventSettings);
  const listings = useAsyncData("marketplace-listings", getMarketplaceListings);

  if (stats.isLoading || event.isLoading || listings.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5">
      <MainPageHeader />
      <MainPageBanner event={event.data} listings={listings.data} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">Респаун боссов</h2>
              <span className="text-xs text-muted-foreground">
                обновляется само
              </span>
            </div>
            <RespawnTracker />
          </section>
          <BossRespawnHistory />
        </div>
        <UpcomingEvents className="order-first xl:order-none" />
      </div>

      <GuildComposition stats={stats.data ?? null} />
    </div>
  );
}
