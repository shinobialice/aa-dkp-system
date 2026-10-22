import "server-only";
import sql from "@/shared/lib/db";
import { getBaseUrl } from "@/shared/lib";
import { sendVkMessage } from "@/shared/lib/vkBot";

export async function notifyKillCountAdded(day: string) {
  try {
    const [top] = await sql<
      { date: string; userName: string; kills: number }[]
    >`
      SELECT
        s.recorded_at::date::text AS date,
        u.username AS "userName",
        (s.end_kills - s.start_kills) AS kills
      FROM killcount_stats s
      JOIN "user" u ON u.id = s.user_id
      WHERE s.recorded_at::date = ${day}::date
      ORDER BY kills DESC, (s.end_honor - s.start_honor) DESC
      LIMIT 1
    `;

    if (!top) return;

    const displayDate = top.date.split("-").reverse().join(".");

    await sendVkMessage(
      [
        `⚔️ Добавлен киллкаунт за ${displayDate}`,
        `🏆 Топ по киллам сегодня: ${top.userName} — ${top.kills} 🎉`,
        `📊 ${getBaseUrl()}/kill-counter/history/${top.date}`,
      ].join("\n"),
    );
  } catch (error) {
    console.error("Не удалось отправить уведомление о киллкаунте в ВК:", error);
  }
}
