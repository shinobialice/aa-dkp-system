"use client";

import { useState } from "react";
import NewsCardList from "./NewsCardsList";
import { NewsFormDialog } from "./NewsFormDialog";
import { Button } from "@/components/ui/button";
import { createNews } from "@/src/actions/news";
import useUserTag from "@/src/hooks/useUserTag";

type NewsItem = {
  id: number;
  title: string;
  content: string;
  date: string;
};

export default function NewsPageClient({ items }: { items: NewsItem[] }) {
  const [open, setOpen] = useState(false);
  const [news, setNews] = useState(items);
  const isAdmin = useUserTag("Администратор");

  const handleCreate = async (data: { title: string; content: string }) => {
    const newItem = await createNews(data.title, data.content);
    const formattedItem = {
      ...newItem,
      date: new Date(newItem.date).toISOString(),
    };
    setNews((prev) => [formattedItem, ...prev]);
    setOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-onBackground">
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Новости</h1>
          {isAdmin && (
            <Button className="cursor-pointer" onClick={() => setOpen(true)}>
              Добавить новость
            </Button>
          )}
        </div>
        <NewsCardList items={news} />
        <NewsFormDialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}
