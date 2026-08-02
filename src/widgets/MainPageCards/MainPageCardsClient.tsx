"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Loader, Swords, Users } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui";
import getStats from "@/actions/getStats";
import Image from "next/image";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import MainPageClock from "./MainPageClock";
import UpcomingEvents from "./UpcomingEvents";
import RespawnTracker from "./RespawnTracker";
import BossRespawnHistory from "./BossRespawnHistory";
import SoundNotificationToggle from "./SoundNotificationToggle";

type Stats = Awaited<ReturnType<typeof getStats>>;

const statIcons: Record<string, React.ReactNode> = {
  "Общее": <Users className="size-4" />,
  ДД: <Swords className="size-4" />,
  Хилы: classIcons["Хил"],
  Тактики: classIcons["Тактик"],
  Барды: classIcons["Бард"],
  Танцоры: classIcons["Танцор"],
};

const statColors: Record<string, string> = {
  "Общее": "#6366f1",
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
      className="border-t-4"
      style={{ borderTopColor: color, backgroundColor: `${color}0d` }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span style={{ color }}>{statIcons[title]}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-bold" style={{ color }}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
};

const InfoCard: FC<{ title: string; action?: ReactNode; content: ReactNode }> = ({
  title,
  action,
  content,
}) => (
  <Card className="min-w-0">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
    <CardContent className="min-w-0">
      <div className="min-w-0">{content}</div>
    </CardContent>
  </Card>
);

const MainPageCardsClient: FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch {}
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

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
        <div>
          <MainPageClock />
          <div className="w-full p-4">
            <UpcomingEvents />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 p-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 text-2xl">
        {statItems.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} />
        ))}
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1080px_auto] items-start text-2xl">
        <InfoCard title={infoItems[0].title} content={infoItems[0].content} />
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
