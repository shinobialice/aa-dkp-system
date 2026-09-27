import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

import { format, parse } from "date-fns";

export default function ProfileAdditionalInfo({
  user,
  vkRealName,
}: {
  user: any;
  vkRealName: string;
}) {
  const joinedDate = user.joined_at ? new Date(user.joined_at) : null;
  const now = new Date();

  const years = joinedDate ? differenceInYears(now, joinedDate) : 0;
  const months = joinedDate
    ? differenceInMonths(now, joinedDate) - years * 12
    : 0;
  const days = joinedDate
    ? differenceInDays(
        now,
        new Date(
          joinedDate.getFullYear() + years,
          joinedDate.getMonth() + months,
          joinedDate.getDate(),
        ),
      )
    : 0;

  const parts = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"}`);
  }
  if (months > 0) {
    parts.push(
      `${months} ${months === 1 ? "месяц" : months < 5 ? "месяца" : "месяцев"}`,
    );
  }
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`);
  }

  return (
    <>
      <div className="min-w-[160px] space-y-1.5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          VK
        </div>
        {user.vk_name || user.vk_id ? (
          <a
            href={
              user.vk_name
                ? `https://vk.ru/${user.vk_name}`
                : `https://vk.com/id${user.vk_id}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {vkRealName || "—"}
          </a>
        ) : (
          <div className="text-sm font-semibold text-muted-foreground">
            Нет данных
          </div>
        )}
      </div>

      <div className="min-w-[140px] space-y-1.5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Дата вступления
        </div>
        <div className="text-sm font-semibold">
          {user.joined_at
            ? format(
                parse(user.joined_at.slice(0, 10), "yyyy-MM-dd", new Date()),
                "dd.MM.yyyy",
              )
            : "Неизвестно"}
        </div>
      </div>

      <div className="min-w-[140px] space-y-1.5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Стаж в гильдии
        </div>
        <div className="text-sm font-semibold">
          {parts.length > 0 ? parts.join(" ") : "Меньше дня"}
        </div>
      </div>
    </>
  );
}
