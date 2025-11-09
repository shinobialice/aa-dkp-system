"use client";

import { useEffect, useState } from "react";
import supabase from "@/shared/lib/supabase";

interface HistoryRow {
  id: number;
  boss_name: string;
  action: string;
  kill_time: string;
  prev_kill_time: string | null;
  next_respawn: string | null;
  user_id: number;
  created_at: string;
  username: string;
}

const PAGE_SIZE = 15;

export default function BossRespawnHistory() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchHistory() {
      setLoading(true);
      const { count } = await supabase
        .from("boss_respawn_history")
        .select("id", { count: "exact", head: true });
      if (isMounted && typeof count === "number") setTotal(count);
      const { data } = await supabase
        .from("boss_respawn_history")
        .select(
          "id,boss_name,action,kill_time,prev_kill_time,next_respawn,user_id,created_at",
        )
        .order("id", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      let userMap: Record<number, string> = {};
      if (data && data.length > 0) {
        // Get unique user_ids
        const userIds = Array.from(
          new Set(data.map((row: any) => row.user_id)),
        );
        // Fetch usernames for those ids
        const { data: users } = await supabase
          .from("user")
          .select("id,username")
          .in("id", userIds);
        if (users) {
          users.forEach((u: any) => {
            userMap[u.id] = u.username;
          });
        }
      }
      if (isMounted && data) {
        setRows(
          data.map((row: any) => ({
            ...row,
            username: userMap[row.user_id] || "?",
          })),
        );
      }
      setLoading(false);
    }
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">История убийств боссов</h2>
      <div className="mb-2 text-sm text-muted-foreground">{total} записей</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Босс</th>
              <th className="p-2 border">Действие</th>
              <th className="p-2 border">Время убийства</th>
              <th className="p-2 border">Предыдущее время</th>
              <th className="p-2 border">Следующий респаун</th>
              <th className="p-2 border">Кто установил</th>
              <th className="p-2 border">Когда установлено</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Загрузка...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Нет записей
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="p-2 border font-bold">{row.boss_name}</td>
                  <td className="p-2 border">{row.action}</td>
                  <td className="p-2 border">{formatDT(row.kill_time)}</td>
                  <td className="p-2 border">
                    {row.prev_kill_time ? formatDT(row.prev_kill_time) : "-"}
                  </td>
                  <td className="p-2 border">
                    {row.next_respawn ? formatDT(row.next_respawn) : "-"}
                  </td>
                  <td className="p-2 border">{row.username}</td>
                  <td className="p-2 border">{formatDT(row.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 mt-2 items-center">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          «
        </button>
        <span>
          Стр. {page} / {Math.max(1, Math.ceil(total / PAGE_SIZE))}
        </span>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={page * PAGE_SIZE >= total}
        >
          »
        </button>
      </div>
    </div>
  );
}

function formatDT(dt: string) {
  return (
    new Date(dt).toLocaleString("ru-RU", {
      hour12: false,
      timeZone: "Europe/Moscow",
    }) + " (МСК)"
  );
}
