"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import { Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getStats from "@/src/actions/getStats";
import Image from "next/image";
import MainPageClock from "./MainPageClock";
import UpcomingEvents from "./UpcomingEvents";

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
      title: "Последние новости",
      content: (
        <div>
          <div className="text-[14px]">
            <ul>📅 Распорядок по боссам начинается с понедельника!</ul>
            <ul>
              Каждый АГЛ собираете свой рейд и кидаетe союзку только БСам — весь
              лут ставите на себя.
            </ul>
            <ul>
              ⚠️ Утренний Морф будет проблемным, поэтому не просим помощи и
              стараемся закрыть сами.
            </ul>
            <ul>🎯 Цель — вытащить максимум с сервера за фришку.</ul>
            <ul>
              🗓 Распределение составлено на 2 недели, чтобы каждый забрал по 3
              босса.
            </ul>
            <ul>
              📌 Учитывалось, чтобы у кого-то были полностью свободны четверг и
              суббота.
            </ul>
            <ul>
              🎁 Лут также распределён: кому с каких боссов перепадает, всё
              указано.
            </ul>
          </div>
          <div className="pt-6">
            <Image
              src="/images/raspredeleine.jpg"
              alt="shared"
              width={800}
              height={100}
            />
          </div>
        </div>
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
