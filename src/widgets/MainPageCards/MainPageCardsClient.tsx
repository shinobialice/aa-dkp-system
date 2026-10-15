"use client";

import { getEventSettings } from "@/actions/eventSettings";
import {
  getMyFighterCard,
  type MyFighterCard,
} from "@/actions/getMyFighterCard";
import { getHomeWarSummary } from "@/actions/getHomeWarSummary";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Skeleton } from "@/shared/ui";
import HeaderClocks from "@/widgets/HeaderClocks";
import FighterCard from "./FighterCard";
import HomeWarPanel from "./HomeWarPanel";
import MainPageBanner from "./MainPageBanner";
import NextFightPoster from "./NextFightPoster";
import RespawnTracker from "./RespawnTracker";

export default function MainPageCardsClient() {
  const event = useAsyncData("event-settings", getEventSettings);
  const fighter = useAsyncData("my-fighter-card", getMyFighterCard);
  const war = useAsyncData("home-war-summary", getHomeWarSummary);

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5">
      <div className="md:hidden">
        <HeaderClocks />
      </div>
      <MainPageBanner event={event.data} />
      <NextFightPoster />
      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="order-last lg:order-none">
          <FighterSlot card={fighter.data} isLoading={fighter.isLoading} />
        </div>
        <RespawnTracker />
      </div>
      {war.data && <HomeWarPanel summary={war.data} />}
    </div>
  );
}

function FighterSlot({
  card,
  isLoading,
}: {
  card: MyFighterCard | null | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Skeleton className="arena-card-shape mx-auto aspect-[5/7.3] w-full max-w-[290px]" />
    );
  }
  if (!card) return null;
  return <FighterCard card={card} />;
}
