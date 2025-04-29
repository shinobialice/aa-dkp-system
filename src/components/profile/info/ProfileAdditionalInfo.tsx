"use client";

import { CardDescription } from "@/components/ui/card";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { Input } from "@/components/ui/input";
import { TaskDatePicker } from "../tasks/TaskDatePicker";
import { format } from "date-fns";

export default function ProfileAdditionalInfo({
  user,
  formData,
  setFormData,
  editMode,
}: {
  user: any;
  formData: any;
  setFormData: (data: any) => void;
  editMode: boolean;
}) {
  const joinedDate = user.joined_at ? new Date(user.joined_at) : null;
  const now = new Date();

  let years = joinedDate ? differenceInYears(now, joinedDate) : 0;
  let months = joinedDate
    ? differenceInMonths(now, joinedDate) - years * 12
    : 0;
  let days = joinedDate
    ? differenceInDays(
        now,
        new Date(
          joinedDate.getFullYear() + years,
          joinedDate.getMonth() + months,
          joinedDate.getDate()
        )
      )
    : 0;

  const parts = [];
  if (years > 0)
    parts.push(`${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"}`);
  if (months > 0)
    parts.push(
      `${months} ${months === 1 ? "месяц" : months < 5 ? "месяца" : "месяцев"}`
    );
  if (days > 0)
    parts.push(`${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`);

  return (
    <div className="pt-2 border-t">
      <CardDescription className="text-sm mb-6">
        Дополнительная информация:
      </CardDescription>

      <div>
        <span>VK: </span>
        {editMode ? (
          <Input
            className="w-[200px]"
            value={formData.vkName ?? ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, vkName: e.target.value }))
            }
          />
        ) : user.vk_name ? (
          <a
            href={`https://vk.com/${formData.vkName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {formData.vkName}
          </a>
        ) : (
          "Нет данных"
        )}
      </div>

      <div className="mt-4">
        <span>Дата вступления: </span>
        {editMode ? (
          <TaskDatePicker
            value={
              formData.joinedDate ? new Date(formData.joinedDate) : undefined
            }
            onChange={(date) =>
              setFormData((prev: any) => ({
                ...prev,
                joinedDate: date ? format(date, "yyyy-MM-dd") : "",
              }))
            }
          />
        ) : formData.joinedDate ? (
          new Date(formData.joinedDate).toLocaleDateString("ru-RU")
        ) : (
          "Неизвестно"
        )}
      </div>

      <div className="mt-4">
        Время в гильдии: {parts.length > 0 ? parts.join(" ") : "Меньше дня"}
      </div>
    </div>
  );
}
