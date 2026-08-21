"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ExternalLink, Loader, Swords, Trophy, Users } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import getStats from "@/actions/getStats";
import { getEventSettings, type EventSettings } from "@/actions/eventSettings";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import MainPageClock from "./MainPageClock";
import UpcomingEvents from "./UpcomingEvents";
import RespawnTracker from "./RespawnTracker";
import BossRespawnHistory from "./BossRespawnHistory";
import SoundNotificationToggle from "./SoundNotificationToggle";

type Stats = Awaited<ReturnType<typeof getStats>>;

const EVENT_LINK = "https://archeage.ru/promo/summerevent3/";

const statIcons: Record<string, React.ReactNode> = {
  Общее: <Users className="size-4" />,
  ДД: <Swords className="size-4" />,
  Хилы: classIcons["Хил"],
  Тактики: classIcons["Тактик"],
  Барды: classIcons["Бард"],
  Танцоры: classIcons["Танцор"],
};

const statColors: Record<string, string> = {
  Общее: "#6366f1",
  ДД: "#f97316",
  Хилы: classColors["Хил"],
  Тактики: classColors["Тактик"],
  Барды: classColors["Бард"],
  Танцоры: classColors["Танцор"],
};

const StatCard: FC<{ title: string; value: number }> = ({ title, value }) => {
  const color = statColors[title];

  return (
    <Card
      className="flex-row items-center justify-between gap-2 border-t-4 py-2.5 px-3"
      style={{ borderTopColor: color, backgroundColor: `${color}0d` }}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span style={{ color }}>{statIcons[title]}</span>
        {title}
      </div>
      <p className="text-lg font-bold" style={{ color }}>
        {value}
      </p>
    </Card>
  );
};

const InfoCard: FC<{
  title: string;
  action?: ReactNode;
  content: ReactNode;
  compactHeader?: boolean;
  heightClassName?: string;
}> = ({ title, action, content, compactHeader, heightClassName = "h-[780px]" }) => (
  <Card className={cn(heightClassName, "min-w-0", compactHeader && "gap-3 py-3")}>
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
    <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{content}</div>
    </CardContent>
  </Card>
);

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
        setEvent({ title: null, imageUrl: null, startsAt: null, endsAt: null });
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

  const statItems = [
    { title: "Общее", value: stats.activePlayers },
    { title: "ДД", value: stats.dds },
    { title: "Хилы", value: stats.healers },
    { title: "Тактики", value: stats.tacticians },
    { title: "Барды", value: stats.bards },
    { title: "Танцоры", value: stats.dancers },
  ];

  const infoItems = [
    {
      title: "Трекер респауна боссов",
      compactHeader: true,
      // Раньше высота была фиксированной вместе со вторым блоком, но после
      // сокращения истории убийств до 4 записей контент стал заметно короче
      // 780px — под фиксированную высоту оставалось много пустого места.
      heightClassName: "h-auto",
      content: (
        <>
          <RespawnTracker />
          <BossRespawnHistory />
        </>
      ),
    },
    {
      title: "Предстоящие мероприятия",
      action: <SoundNotificationToggle />,
      content: (
        <div className="flex h-full min-h-0 flex-col">
          <MainPageClock />
          <div className="w-full min-h-0 flex-1 p-4">
            <UpcomingEvents />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 p-4">
      {eventActive && (
        <a
          href={EVENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-[120px] w-full items-center justify-between gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-6 text-white shadow-md transition-transform hover:scale-[1.01] hover:shadow-lg"
        >
          {event.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
          <div className="relative flex items-center gap-3">
            <Trophy className="size-6 shrink-0" />
            <span className="text-lg font-semibold">{event.title}</span>
          </div>
          <ExternalLink className="relative size-5 shrink-0 opacity-80 transition-opacity group-hover:opacity-100" />
        </a>
      )}
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {statItems.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} />
        ))}
      </div>
      <div className="grid w-full items-start grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1080px_auto]">
        <InfoCard
          title={infoItems[0].title}
          content={infoItems[0].content}
          compactHeader={infoItems[0].compactHeader}
          heightClassName={infoItems[0].heightClassName}
        />
        <InfoCard
          title={infoItems[1].title}
          action={infoItems[1].action}
          content={infoItems[1].content}
        />
      </div>
    </div>
  );
};

export default MainPageCardsClient;
