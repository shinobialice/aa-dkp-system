"use client";

import { useEffect, useState, FC } from "react";
import { Loader } from "lucide-react";
import getStats from "@/actions/getStats";
import { getEventSettings, type EventSettings } from "@/actions/eventSettings";
import MainPageHeader from "./MainPageHeader";
import UpcomingEvents from "./UpcomingEvents";
import RespawnTracker from "./RespawnTracker";
import BossRespawnHistory from "./BossRespawnHistory";
import GuildComposition from "./GuildComposition";

type Stats = Awaited<ReturnType<typeof getStats>>;

const MainPageCardsClient: FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [event, setEvent] = useState<EventSettings | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch {}
    };
    const fetchEvent = async () => {
      try {
        const data = await getEventSettings();
        setEvent(data);
      } catch {
        setEvent({ title: null, imageUrl: null, startsAt: null, endsAt: null, link: null });
      }
    };

    fetchStats();
    fetchEvent();
  }, []);

  if (!stats || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const eventActive =
    !!event.title &&
    !!event.startsAt &&
    !!event.endsAt &&
    new Date(event.startsAt) <= new Date() &&
    new Date(event.endsAt) > new Date();

  const EventBanner = event.link ? "a" : "div";

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5">
      <MainPageHeader />

      {eventActive && (
        <EventBanner
          {...(event.link
            ? { href: event.link, target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt={event.title ?? ""}
              className="block h-16 w-full object-cover object-left sm:h-auto"
            />
          ) : (
            <p className="px-5 py-4 text-lg font-semibold">{event.title}</p>
          )}
        </EventBanner>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[17px] font-semibold">Респаун боссов</h2>
              <span className="text-xs text-muted-foreground">обновляется само</span>
            </div>
            <RespawnTracker />
          </section>
          <BossRespawnHistory />
        </div>
        <UpcomingEvents className="order-first xl:order-none" />
      </div>

      <GuildComposition stats={stats} />
    </div>
  );
};

export default MainPageCardsClient;
