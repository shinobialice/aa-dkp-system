"use server";

import supabase from "@/lib/supabase";

export async function getAllUsersActivityWithPercent() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 1. Получаем все рейды за текущий месяц
  const { data: allRaids, error: raidsError } = await supabase
    .from("raid")
    .select("id, start_date, type, dkp_summary");

  if (raidsError || !allRaids) {
    console.error("Ошибка при получении рейдов:", raidsError);
    throw new Error("Не удалось получить рейды");
  }

  // Фильтруем только текущий месяц
  const raidsThisMonth = allRaids.filter((raid) => {
    if (!raid.start_date) return false;
    const date = new Date(raid.start_date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  // 2. Считаем общее возможное DKP по типам
  let totalPrimeDkp = 0;
  let totalAglDkp = 0;

  const raidDkpMap = new Map<number, { type: string; dkp: number }>();

  for (const raid of raidsThisMonth) {
    const dkp = raid.dkp_summary ?? 0;
    const type = raid.type;

    raidDkpMap.set(raid.id, { type, dkp });

    if (type === "Прайм") totalPrimeDkp += dkp;
    if (type === "АГЛ") totalAglDkp += dkp;
  }

  const totalMaxDkp = totalPrimeDkp + totalAglDkp;

  // 3. Получаем посещения всех пользователей в этих рейдах
  const raidIds = Array.from(raidDkpMap.keys());

  const { data: attendances, error: attError } = await supabase
    .from("raid_attendance")
    .select("user_id, raid_id");

  if (attError || !attendances) {
    console.error("Ошибка при получении посещений:", attError);
    throw new Error("Не удалось получить активности");
  }

  // 4. Считаем сколько DKP получил каждый пользователь
  const userScores: Record<number, { prime: number; agl: number }> = {};

  for (const att of attendances) {
    const raid = raidDkpMap.get(att.raid_id);
    if (!raid) continue;

    const type = raid.type;
    const dkp = raid.dkp;

    if (!userScores[att.user_id]) {
      userScores[att.user_id] = { prime: 0, agl: 0 };
    }

    if (type === "Прайм") {
      userScores[att.user_id].prime += dkp;
    } else if (type === "АГЛ") {
      userScores[att.user_id].agl += dkp;
    }
  }

  // 5. Переводим в проценты
  const result: Record<
    number,
    {
      primePercent: number;
      aglPercent: number;
      totalPercent: number;
    }
  > = {};

  for (const [userIdStr, scores] of Object.entries(userScores)) {
    const userId = Number(userIdStr);
    const primePercent = totalPrimeDkp
      ? (scores.prime / totalPrimeDkp) * 100
      : 0;
    const aglPercent = totalAglDkp ? (scores.agl / totalAglDkp) * 100 : 0;
    const totalPercent = totalMaxDkp
      ? ((scores.prime + scores.agl) / totalMaxDkp) * 100
      : 0;

    result[userId] = {
      primePercent,
      aglPercent,
      totalPercent,
    };
  }

  return result;
}
