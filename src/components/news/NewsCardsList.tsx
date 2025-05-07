"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { NewsFormDialog } from "./NewsFormDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { deleteNews, updateNews } from "@/src/actions/news";
import useUserTag from "@/src/hooks/useUserTag";

type NewsItem = {
  id: number;
  title: string;
  date: string;
  content: string;
};

export default function NewsCardList({
  items: initialItems,
}: {
  items: NewsItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const isAdmin = useUserTag("Администратор");

  const handleDelete = async (id: number) => {
    await deleteNews(id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUpdate = async (data: { title: string; content: string }) => {
    if (!editing) {
      return;
    }
    const updated = await updateNews(editing.id, data.title, data.content);

    const updatedFixed: NewsItem = {
      ...updated,
      date: new Date(updated.date).toISOString(),
    };

    setItems((prev) =>
      prev.map((n) => (n.id === editing.id ? updatedFixed : n))
    );
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {items.map((newsItem) => (
        <Card
          key={newsItem.id}
          className="transition hover:bg-primaryVariant/50 duration-300"
        >
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle className="text-primary">{newsItem.title}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {new Date(newsItem.date).toLocaleDateString("ru-RU")}
              </CardDescription>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditing(newsItem)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  className="cursor-pointer"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(newsItem.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-onSurface whitespace-pre-line">
              {newsItem.content}
            </p>
          </CardContent>
        </Card>
      ))}

      {editing && (
        <NewsFormDialog
          open
          onClose={() => setEditing(null)}
          initialData={editing}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}
