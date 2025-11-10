"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import supabase from "@/shared/lib/supabase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import getStats from "@/actions/getStats";
import Image from "next/image";
import MainPageClock from "./MainPageClock";
import UpcomingEvents from "./UpcomingEvents";
import RespawnTracker from "./RespawnTracker";
import BossRespawnHistory from "./BossRespawnHistory";

type Stats = Awaited<ReturnType<typeof getStats>>;

const StatCard: FC<{ title: string; value: number }> = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{value}</p>
    </CardContent>
  </Card>
);

const InfoCard: FC<{ title: string; content: ReactNode }> = ({
  title,
  content,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div>{content}</div>
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
    { title: "Активные игроки", value: stats.activePlayers },
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
    <div className="space-y-8 p-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 text-2xl">
        {statItems.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} />
        ))}
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 text-2xl">
        {infoItems.map((item) => (
          <InfoCard
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPageCardsClient;
